"use client";

import { useState, useEffect, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { authenticate } from "@/app/lib/actions";

export default function AuthForm() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  // Initialize based on URL parameter, default to login
  const [isLogin, setIsLogin] = useState(true);

  // Use server action for authentication
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  // Set initial mode based on URL parameter
  useEffect(() => {
    if (mode === "signup") {
      setIsLogin(false);
    } else {
      setIsLogin(true); // Default to login for any other value or no parameter
    }
  }, [mode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {isLogin
              ? "Welcome back to your knowledge hub!"
              : "Join the knowledge community"}
          </p>
        </div>

        {/* Form */}
        <form action={formAction} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm 
                         focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm 
                         focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter your password"
              />
            </div>

            {/* Confirm Password Field - Only show for signup */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm 
                           focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Confirm your password"
                />
              </div>
            )}
          </div>

          {/* Hidden field for redirect */}
          <input type="hidden" name="redirectTo" value="/dashboard" />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg 
                     shadow-sm text-sm font-medium text-white ${
                       isPending
                         ? "bg-emerald-400 cursor-not-allowed"
                         : "bg-emerald-600 hover:bg-emerald-700"
                     } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500`}
          >
            {isPending
              ? "Signing in..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center space-x-2 text-red-500 text-sm">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p>{errorMessage}</p>
            </div>
          )}

          {/* Toggle Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-emerald-600 hover:text-emerald-500 underline"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
