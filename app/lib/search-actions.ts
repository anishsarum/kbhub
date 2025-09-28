"use server";

import { auth } from "@/auth";
import { prisma } from "./db";
import { generateEmbedding } from "./embeddings";
import { searchSimilarChunks } from "./vector-db";

export async function semanticSearch(query: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("You must be logged in to search documents.");
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!query.trim()) {
      return [];
    }

    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(query.trim());

    // Search for similar document chunks
    const results = await searchSimilarChunks(
      queryEmbedding,
      user.id,
      15, // limit to 15 results for better demonstration
      0.1 // similarity threshold (0.1 = 10% similar - very permissive for demo)
    );

    return results;
  } catch (error) {
    console.error("Semantic search error:", error);
    throw new Error("Failed to search documents");
  }
}
