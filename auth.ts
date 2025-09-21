import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import bcrypt from "bcrypt";

// Mock user type
type User = {
  id: string;
  email: string;
  password: string;
};

// Mock users data (in a real app, this would be in your database)
const mockUsers: User[] = [
  {
    id: "1",
    email: "test@example.com",
    // Password: "password123" - simplified for testing
    password: "password123",
  },
  {
    id: "2",
    email: "admin@example.com",
    // Password: "admin123" - simplified for testing
    password: "admin123",
  },
];

async function getUser(email: string): Promise<User | undefined> {
  try {
    // Simulate database lookup
    const user = mockUsers.find((user) => user.email === email);
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;

          const passwordsMatch = password === user.password;

          if (passwordsMatch) {
            // Return user without password
            return {
              id: user.id,
              email: user.email,
            };
          }
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
