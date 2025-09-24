"use client";

import { useActionState } from "react";
import { updateTextDocument } from "@/app/lib/actions";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type Document = {
  id: string;
  title: string;
  content: string | null;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
};

interface EditDocumentFormProps {
  document: Document;
}

export function EditDocumentForm({ document }: EditDocumentFormProps) {
  // Create bound action with document ID
  const updateDocumentWithId = updateTextDocument.bind(null, document.id);
  const [errorMessage, formAction, isPending] = useActionState(
    updateDocumentWithId,
    undefined
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center mb-6">
        <DocumentTextIcon className="w-5 h-5 text-emerald-600 mr-2" />
        <h2 className="text-xl font-semibold text-slate-900">
          Edit Text Document
        </h2>
      </div>

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
            defaultValue={document.title}
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
            defaultValue={document.content || ""}
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
            defaultValue={document.tags.join(", ")}
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
        <div className="flex justify-end space-x-3">
          <Link
            href={`/dashboard/library/${document.id}`}
            className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className={`px-6 py-2 rounded-lg text-white font-medium ${
              isPending
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            } focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2`}
          >
            {isPending ? "Updating..." : "Update Document"}
          </button>
        </div>
      </form>
    </div>
  );
}
