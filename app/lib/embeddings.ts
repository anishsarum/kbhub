import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate embeddings for text content using OpenAI's text-embedding-3-small model
 * This model produces 1536-dimensional vectors optimized for semantic search
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding");
  }
}

/**
 * Chunk text into smaller pieces for better embedding quality
 * Large texts are split to stay within token limits and improve relevance
 */
export function chunkText(text: string, maxChunkSize = 1000): string[] {
  if (text.length <= maxChunkSize) {
    return [text];
  }

  const chunks: string[] = [];
  const sentences = text.split(/[.!?]+\s/);
  let currentChunk = "";

  for (const sentence of sentences) {
    const potentialChunk = currentChunk + sentence + ". ";

    if (potentialChunk.length > maxChunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence + ". ";
    } else {
      currentChunk = potentialChunk;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter((chunk) => chunk.length > 0);
}
