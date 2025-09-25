"use client";

import { useActionState } from "react";
import { createTextDocument } from "@/app/lib/actions";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

export function CreateTextDocumentForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    createTextDocument,
    undefined
  );

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-4">
        Create Text Document
      </h2>

      <form action={formAction} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            maxLength={200}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter document title..."
          />
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={12}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Write your content here..."
          />
        </div>

        {/* Tags */}
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter tags separated by commas..."
          />
          <p className="text-xs text-slate-500 mt-1">
            e.g., research, notes, important
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className={`px-6 py-2 rounded-lg text-white font-medium ${
              isPending
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            } focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2`}
          >
            {isPending ? "Creating..." : "Create Document"}
          </button>
        </div>
      </form>
    </div>
  );
}
