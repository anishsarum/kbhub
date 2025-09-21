"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { prisma } from "./db";
import { z } from "zod";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

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
    if (!session?.user?.id) {
      return "You must be logged in to create documents.";
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
    await prisma.document.create({
      data: {
        title,
        description,
        type: "TEXT",
        content,
        tags,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/library");
  } catch (error) {
    console.error("Document creation error:", error);
    return "Something went wrong creating the document.";
  }

  redirect("/dashboard/library");
}
