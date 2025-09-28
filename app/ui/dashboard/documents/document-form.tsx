"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { useTagAutocomplete } from "@/app/ui/dashboard/shared/hooks/useTagAutocomplete";

type Document = {
  id: string;
  title: string;
  content: string | null;
  type: string;
  createdAt: Date;
  updatedAt?: Date;
  tags: string[];
};

interface DocumentFormProps {
  mode: "create" | "edit";
  document?: Document;
  formAction: (formData: FormData) => void;
  isPending: boolean;
  errorMessage?: string;
  availableTags?: string[];
}

export function DocumentForm({
  mode,
  document,
  formAction,
  isPending,
  errorMessage,
  availableTags = [],
}: DocumentFormProps) {
  const isEdit = mode === "edit";
  const inputRef = useRef<HTMLInputElement>(null);
  const [tags, setTags] = useState(() => {
    // Convert existing tags to @notation format
    if (document?.tags.length) {
      return document.tags.map((tag) => `@${tag}`).join(" ");
    }
    return "";
  });

  // Tag autocomplete functionality
  const tagAutocomplete = useTagAutocomplete(
    tags,
    availableTags,
    inputRef,
    (newTags) => setTags(newTags)
  );

  // Convert @notation tags to comma-separated format for server
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    // Extract @tags and convert to comma-separated format
    const tagsValue = tags;
    const extractedTags = tagsValue
      .split(/\s+/)
      .filter((tag) => tag.startsWith("@"))
      .map((tag) => tag.slice(1).trim())
      .filter(Boolean)
      .join(", ");

    // Update the form data with converted tags
    formData.set("tags", extractedTags);

    // Call the original form action with the processed data
    formAction(formData);
  };

  return (
    <div
      className={
        isEdit
          ? "bg-white rounded-lg shadow-sm border border-slate-200 p-6"
          : ""
      }
    >
      {isEdit && (
        <div className="flex items-center mb-6">
          <DocumentTextIcon className="w-5 h-5 text-emerald-600 mr-2" />
          <h2 className="text-xl font-semibold text-slate-900">
            Edit Text Document
          </h2>
        </div>
      )}

      {!isEdit && (
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Create Text Document
        </h2>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
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
            defaultValue={document?.title || ""}
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
            defaultValue={document?.content || ""}
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
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              id="tags"
              name="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              onKeyDown={tagAutocomplete.handleKeyDown}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="@research @notes @important"
            />
            {tagAutocomplete.showTagSuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {tagAutocomplete.tagSuggestions.map(
                  (tag: string, index: number) => (
                    <button
                      key={tag}
                      type="button"
                      className={`w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 ${
                        index === tagAutocomplete.selectedSuggestionIndex
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-700"
                      }`}
                      onClick={() => tagAutocomplete.selectTag(tag)}
                    >
                      <span className="text-slate-400">@ </span>
                      {tag}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Type @ followed by tag name to add tags. e.g., @research @notes
            @important
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          {isEdit && document && (
            <Link
              href={`/dashboard/library/${document.id}`}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Cancel
            </Link>
          )}

          <button
            type="submit"
            disabled={isPending}
            className={`px-6 py-2 rounded-lg text-white font-medium ${
              isPending
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            } focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2`}
          >
            {isPending
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Document"
              : "Create Document"}
          </button>
        </div>
      </form>
    </div>
  );
}
