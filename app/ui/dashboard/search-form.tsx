"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type SearchFormProps = {
  initialQuery?: string;
};

export function SearchForm({ initialQuery = "" }: SearchFormProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Update URL with search params
    router.push(`/dashboard/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Search Query
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your search query..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Use natural language to search through your documents using
            AI-powered semantic search.
          </p>
        </div>

        <button
          type="submit"
          disabled={!query.trim()}
          className="flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
          Search
        </button>
      </form>
    </div>
  );
}
