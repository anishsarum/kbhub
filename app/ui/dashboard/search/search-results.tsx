import Link from "next/link";
import { semanticSearch } from "@/app/lib/search-actions";

type SearchResult = {
  id: string;
  content: string;
  documentId: string;
  document_title: string;
  similarity_score: number;
};

type SearchResultsProps = {
  query: string;
};

export async function SearchResults({ query }: SearchResultsProps) {
  if (!query.trim()) {
    return null;
  }

  try {
    const results = await semanticSearch(query);

    if (results.length === 0) {
      return (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-lg mt-6">
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
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            No results found
          </h3>
          <p className="mt-2 text-slate-600">
            We couldn&apos;t find any documents matching &ldquo;{query}&rdquo;.
            Try adjusting your search terms.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4 mt-6">
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
    );
  } catch (error) {
    console.error("Search error:", error);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
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
              <p>
                There was an error performing your search. Please try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
