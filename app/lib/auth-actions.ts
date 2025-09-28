"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import bcrypt from "bcrypt";
import { z } from "zod";
import { signIn } from "@/auth";
import { prisma } from "./db";

const RegisterSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
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
