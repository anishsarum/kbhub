"use client";

import { useState } from "react";
import Link from "next/link";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { useTagAutocomplete } from "@/app/ui/dashboard/shared/hooks/use-tag-autocomplete";
import { Button } from "@/app/ui/shared/button";
import { Document } from "@/app/lib/definitions";

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
  const [title, setTitle] = useState(document?.title || "");
  const [content, setContent] = useState(document?.content || "");
  const [tags, setTags] = useState(() => {
    // Convert existing tags to @notation format
    if (document?.tags.length) {
      return document.tags.map((tag) => `@${tag}`).join(" ");
    }
    return "";
  });

  // Tag validation: ensures @tags follow single-word format
  const validateTags = (tagsValue: string) => {
    const trimmed = tagsValue.trim();
    if (!trimmed) {
      return {
        isValid: true,
        invalidTags: [],
        hasIncomplete: false,
        missingAt: [],
      };
    }

    // Split by spaces and filter out empty strings
    const words = trimmed.split(/\s+/).filter((word) => word.length > 0);

    // Find words that don't start with @
    const missingAt = words.filter((word) => !word.startsWith("@"));

    // Find all @tag patterns in the input
    const tagMatches = tagsValue.match(/@[\w-]+/g) || [];
    const invalidTags = tagMatches.filter((tag) => {
      const tagContent = tag.slice(1); // Remove @ symbol
      return !/^[\w-]+$/.test(tagContent); // Only allow letters, numbers, underscores, hyphens
    });

    // Detect incomplete tags: @word followed by space then more text (indicates multi-word attempt)
    const incompleteMatches = tagsValue.match(/@\w+\s+\w/g) || [];

    return {
      isValid:
        invalidTags.length === 0 &&
        incompleteMatches.length === 0 &&
        missingAt.length === 0,
      invalidTags,
      hasIncomplete: incompleteMatches.length > 0,
      missingAt,
    };
  };

  const tagValidation = validateTags(tags);

  // Form validation: check if all required fields are filled
  const isFormValid =
    title.trim() !== "" && content.trim() !== "" && tagValidation.isValid;

  // Initialize tag autocomplete with current input and available options
  const tagAutocomplete = useTagAutocomplete(tags, availableTags, (newTags) =>
    setTags(newTags)
  );

  // Process @notation tags into comma-separated format for server submission
  const extractedTags =
    tags
      .match(/@[\w-]+/g) // Find all valid @tags
      ?.map((tag) => tag.slice(1)) // Remove @ symbols
      .join(", ") || "";

  // Convert @notation tags to comma-separated format for server
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Validate tags before submission
    const validation = validateTags(tags);
    if (!validation.isValid) {
      // Prevent form submission if there are invalid tags
      event.preventDefault();
      return;
    }

    // Let the form handle the submission naturally
    // The processed tags will be sent via the hidden input
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

      <form className="space-y-6" action={formAction} onSubmit={handleSubmit}>
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
              type="text"
              id="tags-display"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              onKeyDown={tagAutocomplete.handleKeyDown}
              onFocus={tagAutocomplete.handleFocus}
              onBlur={tagAutocomplete.handleBlur}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${
                !tagValidation.isValid
                  ? "border-red-300 bg-red-50"
                  : "border-slate-300"
              }`}
              placeholder="@research @notes @important"
            />
            {/* Hidden input with processed tags for form submission */}
            <input type="hidden" name="tags" value={extractedTags} />
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
                      onMouseDown={(e) => e.preventDefault()}
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
          {!tagValidation.isValid && (
            <div className="mt-2 text-sm text-red-600">
              {tagValidation.missingAt.length > 0 && (
                <p>
                  All tags must start with @. Missing @ for:{" "}
                  {tagValidation.missingAt.join(", ")}
                </p>
              )}
              {tagValidation.hasIncomplete && (
                <p>
                  Tags must be single words. Separate tags with spaces, not
                  within tag names.
                </p>
              )}
              {tagValidation.invalidTags.length > 0 && (
                <p>
                  Invalid tags: {tagValidation.invalidTags.join(", ")}. Use only
                  letters, numbers, and underscores.
                </p>
              )}
            </div>
          )}
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
            <Link href={`/dashboard/library/${document.id}`}>
              <Button variant="secondary" size="lg">
                Cancel
              </Button>
            </Link>
          )}

          <Button
            type="submit"
            loading={isPending}
            disabled={!isFormValid}
            size="lg"
          >
            {isPending
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Document"
              : "Create Document"}
          </Button>
        </div>
      </form>
    </div>
  );
}
