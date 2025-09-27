"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import bcrypt from "bcrypt";
import { z } from "zod";
import { auth, signIn } from "@/auth";
import { prisma } from "./db";
import { generateEmbedding, chunkText } from "./embeddings";
import {
  createDocumentChunk,
  deleteDocumentChunks,
  searchSimilarChunks,
} from "./vector-db";

const RegisterSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const CreateTextDocumentSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required"),
  tags: z.string().optional(),
});

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // If we get here, sign in was successful
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }

  redirect("/dashboard");
}

export async function registerUser(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate input
    const validatedFields = RegisterSchema.safeParse({
      email,
      password,
    });

    if (!validatedFields.success) {
      return "Please check your input and try again.";
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return "An account with this email already exists.";
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Auto sign in after registration
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return "Something went wrong during registration.";
  }

  redirect("/dashboard");
}

// Document Actions
export async function createTextDocument(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return "You must be logged in to create documents.";
    }

    // Get user ID from email since that's what we know works
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return "User not found.";
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tagsInput = formData.get("tags") as string;

    // Parse tags from comma-separated string
    const tags = tagsInput
      ? tagsInput
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    // Auto-generate description from first 100 characters of content
    const description =
      content.length > 100
        ? content.substring(0, 100).trim() + "..."
        : content.trim();

    // Validate input
    const validatedFields = CreateTextDocumentSchema.safeParse({
      title,
      content,
      tags: tagsInput,
    });

    if (!validatedFields.success) {
      return "Please check your input and try again.";
    }

    // Create text document
    const document = await prisma.document.create({
      data: {
        title,
        description,
        type: "TEXT",
        content,
        tags,
        userId: user.id,
      },
    });

    // Generate embeddings for the document content
    const chunks = chunkText(content);

    // Create document chunks with embeddings
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await generateEmbedding(chunk);

      await createDocumentChunk(
        document.id,
        chunk,
        embedding,
        i,
        chunk.split(/\s+/).length
      );
    }

    revalidatePath("/dashboard/library");
  } catch (error) {
    console.error("Document creation error:", error);
    return "Something went wrong creating the document.";
  }

  redirect("/dashboard/library");
}

export async function getUserDocuments() {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("You must be logged in to view documents.");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      documents: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          content: true,
          type: true,
          createdAt: true,
          tags: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.documents;
}

export async function getUserTags() {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("You must be logged in to view tags.");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      documents: {
        select: {
          tags: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Extract all unique tags from all documents
  const allTags = user.documents.flatMap((doc) => doc.tags);
  const uniqueTags = [...new Set(allTags)].sort();

  return uniqueTags;
}

export async function getDocumentById(id: string) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("You must be logged in to view documents.");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const document = await prisma.document.findFirst({
    where: {
      id: id,
      userId: user.id, // Ensure user can only access their own documents
    },
    select: {
      id: true,
      title: true,
      description: true,
      content: true,
      type: true,
      createdAt: true,
      updatedAt: true,
      tags: true,
    },
  });

  if (!document) {
    throw new Error("Document not found");
  }

  return document;
}

export async function updateTextDocument(
  id: string,
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return "You must be logged in to update documents.";
    }

    // Get user ID from email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return "User not found.";
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tagsInput = formData.get("tags") as string;

    // Parse tags from comma-separated string
    const tags = tagsInput
      ? tagsInput
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    // Auto-generate description from first 100 characters of content
    const description =
      content.length > 100
        ? content.substring(0, 100).trim() + "..."
        : content.trim();

    // Validate input
    const validatedFields = CreateTextDocumentSchema.safeParse({
      title,
      content,
      tags: tagsInput,
    });

    if (!validatedFields.success) {
      return "Please check your input and try again.";
    }

    // Update document (ensure user can only update their own documents)
    const updatedDocument = await prisma.document.updateMany({
      where: {
        id: id,
        userId: user.id, // Security: only update user's own documents
      },
      data: {
        title,
        description,
        content,
        tags,
        updatedAt: new Date(),
      },
    });

    if (updatedDocument.count === 0) {
      return "Document not found or you don't have permission to edit it.";
    }

    // Regenerate embeddings for the updated content
    // Delete existing chunks
    await deleteDocumentChunks(id);

    // Generate new chunks and embeddings
    const chunks = chunkText(content);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await generateEmbedding(chunk);

      await createDocumentChunk(
        id,
        chunk,
        embedding,
        i,
        chunk.split(/\s+/).length
      );
    }

    revalidatePath("/dashboard/library");
    revalidatePath(`/dashboard/library/${id}`);
  } catch (error) {
    console.error("Document update error:", error);
    return "Something went wrong updating the document.";
  }

  redirect(`/dashboard/library/${id}`);
}

export async function deleteDocument(id: string) {
  try {
    // Get the current user
    const session = await auth();
    if (!session?.user?.email) {
      return "Not authenticated";
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return "User not found";
    }

    // Delete document (ensure user can only delete their own documents)
    const deletedDocument = await prisma.document.deleteMany({
      where: {
        id: id,
        userId: user.id, // Security: only delete user's own documents
      },
    });

    if (deletedDocument.count === 0) {
      return "Document not found or you don't have permission to delete it.";
    }

    revalidatePath("/dashboard/library");
  } catch (error) {
    console.error("Document deletion error:", error);
    return "Something went wrong deleting the document.";
  }

  redirect("/dashboard/library");
}

// Semantic Search Actions
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
