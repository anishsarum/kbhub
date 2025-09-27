"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { useTagAutocomplete } from "./hooks/useTagAutocomplete";
import { useSearchURL } from "./hooks/useSearchURL";
import { useDebouncedSearch } from "./hooks/useDebouncedSearch";

type SearchMode = "semantic" | "local";

type SearchConfig = {
  mode?: SearchMode;
  placeholder?: string;
  description?: string;
  showButton?: boolean;
};

type URLConfig = {
  updateUrl?: boolean;
};

type TagConfig = {
  availableTags?: string[];
};

type SearchFormProps = SearchConfig &
  URLConfig &
  TagConfig & {
    initialQuery?: string;
    onSearch?: (query: string) => void;
  };

export function SearchForm({
  initialQuery = "",
  mode = "semantic",
  onSearch,
  placeholder,
  description,
  showButton = true,
  updateUrl = false,
  availableTags = [],
}: SearchFormProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Custom hooks
  const { getInitialQuery, updateURL } = useSearchURL(updateUrl);

  // Initialize query from URL if updateUrl is enabled, otherwise use initialQuery
  const [query, setQuery] = useState(() => {
    return updateUrl ? getInitialQuery() || initialQuery : initialQuery;
  });

  // Debounced search for local mode
  useDebouncedSearch(
    query,
    (searchQuery) => {
      if (onSearch) {
        onSearch(searchQuery);
      }
      updateURL(searchQuery);
    },
    mode === "local",
    300
  );

  // Tag autocomplete functionality
  const tagAutocomplete = useTagAutocomplete(
    query,
    availableTags,
    inputRef,
    (newQuery) => {
      setQuery(newQuery);
      if (mode === "local" && onSearch) {
        onSearch(newQuery);
        updateURL(newQuery);
      }
    }
  );

  // Initialize search on mount if there's a URL parameter
  useEffect(() => {
    if (updateUrl && mode === "local" && onSearch) {
      const urlQuery = getInitialQuery();
      if (urlQuery) {
        onSearch(urlQuery);
      }
    }
  }, [updateUrl, mode, onSearch, getInitialQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const handled = tagAutocomplete.handleKeyDown(e);
    // If tag autocomplete didn't handle it and it's Enter, proceed with form submission
    if (!handled && e.key === "Enter") {
      handleSubmit(e as any);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleInputClick = () => {
    if (mode === "local") {
      tagAutocomplete.updateCursorBasedSuggestions();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (mode === "semantic") {
      // Navigate to search page for semantic search
      router.push(`/dashboard/search?q=${encodeURIComponent(query.trim())}`);
    } else if (mode === "local" && onSearch) {
      // Trigger local search immediately
      onSearch(query.trim());
      updateURL(query.trim());
    }
  };

  const clearSearch = () => {
    setQuery("");
    if (mode === "local" && onSearch) {
      onSearch("");
    }
    updateURL("");
  };

  const getDefaultPlaceholder = () => {
    return mode === "semantic"
      ? "Enter your search query..."
      : "Search documents by title, content, tags... Use @tag for tag-only search";
  };

  const getDefaultDescription = () => {
    return mode === "semantic"
      ? "Use natural language to search through your documents using AI-powered semantic search."
      : "Search through your document collection using keywords and phrases. Use @tagname to search only tags.";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            {mode === "semantic" ? "Search Query" : "Search Documents"}
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              id="search"
              type="text"
              value={query}
              onChange={handleInputChange}
              onClick={handleInputClick}
              onKeyUp={handleInputClick}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || getDefaultPlaceholder()}
              className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
            {mode === "local" && query ? (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                title="Clear search"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            ) : (
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            )}

            {/* Tag Suggestions Dropdown */}
            {tagAutocomplete.showTagSuggestions && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {tagAutocomplete.tagSuggestions.map(
                  (tag: string, index: number) => (
                    <button
                      key={tag}
                      type="button"
                      role="option"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        tagAutocomplete.selectTag(tag);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent input from losing focus
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 transition-colors ${
                        index === tagAutocomplete.selectedSuggestionIndex
                          ? "bg-emerald-50 text-emerald-900"
                          : "text-slate-700"
                      }`}
                    >
                      <TagIcon className="w-4 h-4 text-slate-400" />
                      <span>{tag}</span>
                    </button>
                  )
                )}
                {tagAutocomplete.tagSuggestions.length === 0 &&
                  query.length > 1 && (
                    <div className="px-3 py-2 text-sm text-slate-500">
                      No tags found matching "{query.slice(1)}"
                    </div>
                  )}
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-slate-600">
            {description || getDefaultDescription()}
          </p>
          {mode === "local" && query && (
            <p className="mt-1 text-sm text-slate-600">
              Searching for: <span className="font-medium">"{query}"</span>
            </p>
          )}
        </div>

        {showButton && (
          <button
            type="submit"
            disabled={!query.trim()}
            className="flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
            Search
          </button>
        )}
      </form>
    </div>
  );
}
