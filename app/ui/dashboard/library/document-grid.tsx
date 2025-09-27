"use client";

import Link from "next/link";
import { DocumentIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Document } from "@/app/lib/definitions";
import { filterDocuments } from "@/app/lib/document-utils";
import { DocumentCard } from "./document-card";

interface DocumentGridProps {
  documents: Document[];
  searchQuery?: string;
  showEmptyState?: boolean;
  showSearchResults?: boolean;
}

export function DocumentGrid({
  documents,
  searchQuery = "",
  showEmptyState = true,
  showSearchResults = false,
}: DocumentGridProps) {
  const filteredDocuments = filterDocuments(documents, searchQuery);

  // No documents at all
  if (documents.length === 0 && showEmptyState) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8 text-center">
        <DocumentIcon className="mx-auto h-12 w-12 text-emerald-400 mb-4" />
        <h3 className="text-lg font-medium text-emerald-900 mb-2">
          No documents yet
        </h3>
        <p className="text-emerald-700 mb-4">
          Get started by creating your first document or uploading a PDF.
        </p>
        <Link
          href="/dashboard/documents"
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors"
        >
          Create Document
        </Link>
      </div>
    );
  }

  // No search results
  if (filteredDocuments.length === 0 && searchQuery && showEmptyState) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
        <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          No results found
        </h3>
        <p className="text-slate-600 mb-4">
          No documents match your search for "{searchQuery}". Try a different
          search term or browse all documents.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Search results summary */}
      {showSearchResults && searchQuery && (
        <div className="mb-4">
          <p className="text-sm text-slate-600">
            Found {filteredDocuments.length} document
            {filteredDocuments.length !== 1 ? "s" : ""} matching "{searchQuery}"
          </p>
        </div>
      )}

      {/* Document grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDocuments.map((document) => (
          <DocumentCard key={document.id} document={document} />
        ))}
      </div>
    </div>
  );
}

// Legacy component wrapper for backward compatibility
interface DocumentsGridProps {
  documents: Document[];
  searchQuery: string;
}

export function DocumentsGrid({ documents, searchQuery }: DocumentsGridProps) {
  return (
    <DocumentGrid
      documents={documents}
      searchQuery={searchQuery}
      showEmptyState={true}
      showSearchResults={true}
    />
  );
}
