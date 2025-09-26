import type { Metadata } from "next";
import { Suspense } from "react";
import AuthForm from "@/app/ui/auth/auth-form";
import { AuthFormSkeleton } from "@/app/ui/skeletons";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthFormSkeleton />}>
      <AuthForm />
    </Suspense>
  );
}
