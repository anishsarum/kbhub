import { prisma } from "./db";

export async function createDocumentChunk(
  documentId: string,
  content: string,
  embedding: number[],
  chunkIndex: number,
  wordCount?: number
) {
  const chunkId = `chunk_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 11)}`;

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

export async function searchSimilarChunks(
  embedding: number[],
  userId: string,
  limit: number = 10,
  similarityThreshold: number = 0.5
): Promise<SearchResult[]> {
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

  // Filter results by similarity threshold after getting them
  const filteredResults = results.filter(
    (result) => result.similarity_score > similarityThreshold
  );

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
