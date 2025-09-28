"use server";

import { auth } from "@/auth";
import { prisma } from "./db";
import { generateEmbedding } from "./embeddings";
import { searchSimilarChunks } from "./vector-db";

/**
 * Performs AI-powered semantic search across user's document collection
 * Uses vector embeddings to find contextually similar content, not just keyword matches
 *
 * @param query - Natural language search query from user
 * @returns Array of relevant document chunks with similarity scores
 */
export async function semanticSearch(query: string) {
  try {
    // Authentication check - ensure user is logged in
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("You must be logged in to search documents.");
    }

    // Retrieve user ID for database queries
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Handle empty queries
    if (!query.trim()) {
      return [];
    }

    // Convert search query to vector embedding using AI model
    const queryEmbedding = await generateEmbedding(query.trim());

    // Find document chunks with similar semantic meaning
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
