"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { useTagAutocomplete } from "./hooks/use-tag-autocomplete";
import { Card } from "@/app/ui/shared/card";
import { Button } from "@/app/ui/shared/button";

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
  };

/**
 * Versatile search form component supporting two modes:
 * - "semantic": AI-powered search with navigation to results page
 * - "local": Real-time keyword search with instant results
 *
 * Features: URL synchronization, tag autocomplete, debounced updates
 */
export function SearchForm({
  initialQuery = "",
  mode = "semantic",
  placeholder,
  description,
  showButton = true,
  updateUrl = false,
  availableTags = [],
}: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // URL synchronization: updates browser address bar with search query (debounced)
  const debouncedUrlUpdate = useDebouncedCallback((term: string) => {
    if (!updateUrl) return;
    const params = new URLSearchParams(searchParams);
    if (term.trim()) {
      params.set("q", term); // Add query parameter
    } else {
      params.delete("q"); // Remove empty query
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300); // 300ms delay to avoid excessive URL updates

  const updateURL = useCallback(
    (query: string) => {
      if (updateUrl) {
        debouncedUrlUpdate(query);
      }
    },
    [updateUrl, debouncedUrlUpdate]
  );

  // Extract initial query from URL parameters when component mounts
  const getInitialQuery = useCallback((): string => {
    if (updateUrl && searchParams.get("q")) {
      return searchParams.get("q") || "";
    }
    return "";
  }, [updateUrl, searchParams]);

  // State initialization: prioritize URL query over prop when URL sync is enabled
  const [query, setQuery] = useState(() => {
    return updateUrl ? getInitialQuery() || initialQuery : initialQuery;
  });

  // Auto-update URL in local mode: updates browser URL as user types (debounced)
  useEffect(() => {
    if (mode !== "local") return; // Only auto-update URL in local mode
    const timer = setTimeout(() => {
      updateURL(query);
    }, 300); // 300ms delay for better UX
    return () => clearTimeout(timer);
  }, [query, mode, updateURL]);

  // Tag autocomplete functionality
  const tagAutocomplete = useTagAutocomplete(
    query,
    availableTags,
    (newQuery) => {
      setQuery(newQuery);
      if (mode === "local") {
        updateURL(newQuery);
      }
    }
  );

  // Note: Initial URL query handling is done by parent component reading URL params

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
    } else if (mode === "local") {
      // Update URL for local search - parent component handles filtering
      updateURL(query.trim());
    }
  };

  const clearSearch = () => {
    setQuery("");
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
    <Card variant="subtle" className="mb-6">
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
              id="search"
              type="text"
              value={query}
              onChange={handleInputChange}
              onClick={handleInputClick}
              onKeyUp={handleInputClick}
              onKeyDown={handleKeyDown}
              onFocus={tagAutocomplete.handleFocus}
              onBlur={tagAutocomplete.handleBlur}
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
          <Button type="submit" disabled={!query.trim()} size="lg">
            <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
            Search
          </Button>
        )}
      </form>
    </Card>
  );
}
