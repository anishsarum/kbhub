"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "./db";
import { generateEmbedding, chunkText } from "./embeddings";
import { createDocumentChunk, deleteDocumentChunks } from "./vector-db";

const CreateTextDocumentSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required"),
  tags: z.string().optional(),
});

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
