"use client";

import { useState } from "react";
import Link from "next/link";
import { semanticSearch } from "@/app/lib/search-actions";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { SearchResultsSkeleton } from "@/app/ui/skeletons";
import { ErrorIcon, SearchIcon } from "@/app/ui/shared/icons";
import { Button } from "@/app/ui/shared/button";
import { Card } from "@/app/ui/shared/card";
import type { SearchResult } from "@/app/lib/definitions";

type SearchState = "idle" | "loading" | "success" | "error" | "no-results";

export function SemanticSearchInterface() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearchState("loading");
    setError(null);

    try {
      const searchResults = await semanticSearch(query);
      setResults(searchResults);
      setSearchState(searchResults.length > 0 ? "success" : "no-results");
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to search documents. Please try again.");
      setSearchState("error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card variant="subtle">
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
                disabled={searchState === "loading"}
              />
            </div>
          </div>
          <Button
            type="submit"
            loading={searchState === "loading"}
            disabled={!query.trim()}
            size="lg"
          >
            {searchState === "loading" ? (
              "Searching..."
            ) : (
              <>
                <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Error Message */}
      {searchState === "error" && error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ErrorIcon className="h-5 w-5 text-red-400" />
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
      {searchState === "loading" && <SearchResultsSkeleton />}

      {/* Results */}
      {searchState === "success" && (
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
      {searchState === "no-results" && (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-lg">
          <SearchIcon className="mx-auto h-12 w-12 text-slate-400" />
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
