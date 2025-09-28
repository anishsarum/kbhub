"use client";

import { useState } from "react";
import Link from "next/link";
import { semanticSearch } from "@/app/lib/search-actions";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { SearchResultsSkeleton } from "@/app/ui/skeletons";

type SearchResult = {
  id: string;
  content: string;
  documentId: string;
  document_title: string;
  similarity_score: number;
};

export function SemanticSearchInterface() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const searchResults = await semanticSearch(query);
      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to search documents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <div className="flex items-center mb-2">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 mr-2" />
              <label
                htmlFor="search"
                className="block text-sm font-medium text-slate-700"
              >
                Search your knowledge base
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What would you like to find?"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder-slate-400"
                disabled={isLoading}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-600"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Searching...
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
                Search
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Search Error</h3>
              <div className="mt-1 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && <SearchResultsSkeleton />}

      {/* Results */}
      {!isLoading && results.length > 0 && (
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Search Results ({results.length})
            </h2>
          </div>
          <div className="space-y-3">
            {results.map((result) => (
              <Link
                key={result.id}
                href={`/dashboard/library/${result.documentId}`}
                className="block bg-white border border-slate-200 rounded-lg p-4 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-sm font-medium text-emerald-600 group-hover:text-emerald-700 truncate">
                        {result.document_title}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
                      {result.content}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                      {Math.round(result.similarity_score * 100)}% match
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && hasSearched && query && results.length === 0 && !error && (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-slate-900">
              No results found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              No results found for "{query}". Try adjusting your search terms.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
