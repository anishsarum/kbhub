import { prisma } from "./db";

/**
 * Creates a new document chunk with vector embedding in the database
 * Used when processing documents - breaks large docs into searchable pieces
 *
 * @param documentId - Parent document ID
 * @param content - Text content of this chunk
 * @param embedding - Vector representation of the content for similarity search
 * @param chunkIndex - Order position within the document
 * @param wordCount - Optional word count for analytics
 */
export async function createDocumentChunk(
  documentId: string,
  content: string,
  embedding: number[],
  chunkIndex: number,
  wordCount?: number
) {
  // Generate unique chunk ID with timestamp and random suffix
  const chunkId = `chunk_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 11)}`;

  // Raw SQL needed for vector type casting (::vector)
  await prisma.$executeRaw`
    INSERT INTO document_chunks (id, content, embedding, "chunkIndex", "wordCount", "documentId", "createdAt")
    VALUES (
      ${chunkId},
      ${content},
      ${embedding}::vector,
      ${chunkIndex},
      ${wordCount},
      ${documentId},
      NOW()
    )
  `;
}

/**
 * Removes all document chunks when a document is deleted
 * Ensures cleanup of vector embeddings to prevent orphaned data
 */
export async function deleteDocumentChunks(documentId: string) {
  await prisma.$executeRaw`
    DELETE FROM document_chunks
    WHERE "documentId" = ${documentId}
  `;
}

export type SearchResult = {
  id: string;
  content: string;
  documentId: string;
  document_title: string;
  similarity_score: number;
};

/**
 * Performs vector similarity search across document chunks
 * Uses PostgreSQL's pgvector extension for efficient cosine similarity
 *
 * @param embedding - Query vector to find similar content
 * @param userId - Limit search to this user's documents only
 * @param limit - Maximum number of results to return
 * @param similarityThreshold - Minimum similarity score (0-1) to include
 * @returns Ranked list of similar document chunks with scores
 */
export async function searchSimilarChunks(
  embedding: number[],
  userId: string,
  limit: number = 10,
  similarityThreshold: number = 0.5
): Promise<SearchResult[]> {
  // Cosine distance query using pgvector <=> operator
  // Lower distance = higher similarity, so we calculate 1 - distance
  const results = await prisma.$queryRaw<SearchResult[]>`
    SELECT
      dc.id,
      dc.content,
      dc."documentId" as "documentId",
      d.title as document_title,
      1 - (dc.embedding <=> ${embedding}::vector) as similarity_score
    FROM document_chunks dc
    JOIN documents d ON dc."documentId" = d.id
    WHERE d."userId" = ${userId}
    ORDER BY dc.embedding <=> ${embedding}::vector
    LIMIT ${limit}
  `;

  // Apply similarity threshold filter (done after query for performance)
  const filteredResults = results.filter(
    (result) => result.similarity_score > similarityThreshold
  );

  // Debug logging for search performance analysis
  console.log(
    `Found ${results.length} total chunks, ${filteredResults.length} above threshold ${similarityThreshold}`
  );
  if (results.length > 0) {
    console.log(
      "All similarity scores:",
      results.map((r) => r.similarity_score)
    );
  }

  return filteredResults;
}
