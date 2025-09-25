"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { useDebouncedCallback } from "use-debounce";

type SearchMode = "semantic" | "local";

type SearchFormProps = {
  initialQuery?: string;
  mode?: SearchMode;
  onSearch?: (query: string) => void;
  placeholder?: string;
  description?: string;
  showButton?: boolean;
  updateUrl?: boolean;
  availableTags?: string[];
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
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize query from URL if updateUrl is enabled, otherwise use initialQuery
  const [query, setQuery] = useState(() => {
    if (updateUrl && searchParams.get("q")) {
      return searchParams.get("q") || "";
    }
    return initialQuery;
  });

  // State for tag autocomplete
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [currentTagStart, setCurrentTagStart] = useState(-1);
  const [currentTagEnd, setCurrentTagEnd] = useState(-1);

  // Get current cursor position and find if we're typing a tag
  const getCurrentTagInfo = () => {
    const input = inputRef.current;
    if (!input) return { isTypingTag: false, tagQuery: "", start: -1, end: -1 };

    const cursorPos = input.selectionStart || 0;
    const text = query;

    // Find the last @ before or at cursor position
    let tagStart = -1;
    for (let i = cursorPos - 1; i >= 0; i--) {
      if (text[i] === "@") {
        tagStart = i;
        break;
      }
      if (text[i] === " ") {
        break; // Stop at space, no tag being typed
      }
    }

    if (tagStart === -1)
      return { isTypingTag: false, tagQuery: "", start: -1, end: -1 };

    // Find the end of the tag (space or end of string)
    let tagEnd = cursorPos;
    for (let i = tagStart + 1; i < text.length; i++) {
      if (text[i] === " ") {
        tagEnd = i;
        break;
      }
      if (i === text.length - 1) {
        tagEnd = text.length;
        break;
      }
    }

    const tagQuery = text.slice(tagStart + 1, tagEnd);
    return {
      isTypingTag: true,
      tagQuery,
      start: tagStart,
      end: tagEnd,
    };
  };

  // Get filtered tag suggestions based on current tag being typed
  const getTagSuggestions = () => {
    if (availableTags.length === 0) return [];

    const tagInfo = getCurrentTagInfo();
    if (!tagInfo.isTypingTag) return [];

    const tagQuery = tagInfo.tagQuery.toLowerCase();
    if (!tagQuery) return availableTags.slice(0, 10); // Show first 10 tags when just "@"

    return availableTags
      .filter((tag) => tag.toLowerCase().includes(tagQuery))
      .slice(0, 10);
  };

  const tagSuggestions = getTagSuggestions(); // Debounced URL update function
  const debouncedUrlUpdate = useDebouncedCallback((term: string) => {
    if (!updateUrl) return;

    const params = new URLSearchParams(searchParams);
    if (term.trim()) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  // For local search mode, use debounced effect
  useEffect(() => {
    if (mode === "local" && onSearch) {
      const timer = setTimeout(() => {
        onSearch(query);
        // Also update URL if enabled
        if (updateUrl) {
          debouncedUrlUpdate(query);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [query, onSearch, mode, updateUrl, debouncedUrlUpdate]);

  // Show/hide tag suggestions based on query and cursor position
  useEffect(() => {
    const tagInfo = getCurrentTagInfo();
    const shouldShow =
      mode === "local" && tagInfo.isTypingTag && tagSuggestions.length > 0;
    setShowTagSuggestions(shouldShow);
    setSelectedSuggestionIndex(-1);

    if (shouldShow) {
      setCurrentTagStart(tagInfo.start);
      setCurrentTagEnd(tagInfo.end);
    }
  }, [query, tagSuggestions.length, mode]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        // Don't close if clicking on dropdown buttons
        !(event.target as Element)?.closest('[role="option"]')
      ) {
        setShowTagSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize search on mount if there's a URL parameter
  useEffect(() => {
    if (updateUrl && mode === "local" && onSearch && searchParams.get("q")) {
      const urlQuery = searchParams.get("q") || "";
      onSearch(urlQuery);
    }
  }, [updateUrl, mode, onSearch, searchParams]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showTagSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < tagSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault();
          selectTag(tagSuggestions[selectedSuggestionIndex]);
        }
        break;
      case "Escape":
        setShowTagSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Handle input changes and cursor position changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleInputClick = () => {
    // Trigger re-evaluation of tag suggestions when cursor moves
    setTimeout(() => {
      const tagInfo = getCurrentTagInfo();
      const shouldShow =
        mode === "local" && tagInfo.isTypingTag && tagSuggestions.length > 0;
      setShowTagSuggestions(shouldShow);
      setSelectedSuggestionIndex(-1);

      if (shouldShow) {
        setCurrentTagStart(tagInfo.start);
        setCurrentTagEnd(tagInfo.end);
      }
    }, 0);
  };

  const selectTag = (tag: string) => {
    const tagInfo = getCurrentTagInfo();
    if (!tagInfo.isTypingTag) return;

    // Replace the current tag being typed with the selected tag
    const beforeTag = query.slice(0, tagInfo.start);
    const afterTag = query.slice(tagInfo.end);
    const newQuery = `${beforeTag}@${tag}${afterTag}`;

    setQuery(newQuery);
    setShowTagSuggestions(false);
    setSelectedSuggestionIndex(-1);

    // Set cursor position after the inserted tag
    setTimeout(() => {
      if (inputRef.current) {
        const newCursorPos = tagInfo.start + tag.length + 1; // +1 for the @
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        inputRef.current.focus();
      }
    }, 0);

    if (mode === "local" && onSearch) {
      onSearch(newQuery);
      if (updateUrl) {
        debouncedUrlUpdate(newQuery);
      }
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
      if (updateUrl) {
        debouncedUrlUpdate(query.trim());
      }
    }
  };

  const clearSearch = () => {
    setQuery("");
    if (mode === "local" && onSearch) {
      onSearch("");
    }
    if (updateUrl) {
      debouncedUrlUpdate("");
    }
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
            {showTagSuggestions && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {tagSuggestions.map((tag, index) => (
                  <button
                    key={tag}
                    type="button"
                    role="option"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      selectTag(tag);
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent input from losing focus
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 transition-colors ${
                      index === selectedSuggestionIndex
                        ? "bg-emerald-50 text-emerald-900"
                        : "text-slate-700"
                    }`}
                  >
                    <TagIcon className="w-4 h-4 text-slate-400" />
                    <span>{tag}</span>
                  </button>
                ))}
                {tagSuggestions.length === 0 && query.length > 1 && (
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
