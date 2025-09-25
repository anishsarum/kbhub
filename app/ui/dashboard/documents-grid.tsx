"use client";

import {
  DocumentIcon,
  CalendarIcon,
  TagIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

type Document = {
  id: string;
  title: string;
  content: string | null;
  type: string;
  createdAt: Date;
  tags: string[];
};

type DocumentsGridProps = {
  documents: Document[];
  searchQuery: string;
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

const truncateContent = (content: string, maxLength = 150) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + "...";
};

const filterDocuments = (documents: Document[], query: string): Document[] => {
  if (!query.trim()) return documents;

  const searchTerm = query.toLowerCase().trim();

  // Check if this is a tag-specific search (starts with @)
  if (searchTerm.startsWith("@")) {
    const tagQuery = searchTerm.slice(1); // Remove the @ symbol
    if (!tagQuery) return documents; // If just "@", show all documents

    return documents.filter((doc) => {
      // Search only in tags when using @
      return doc.tags.some((tag) => tag.toLowerCase().includes(tagQuery));
    });
  }

  // General search across all fields
  return documents.filter((doc) => {
    // Search in title
    const titleMatch = doc.title.toLowerCase().includes(searchTerm);

    // Search in content
    const contentMatch =
      doc.content?.toLowerCase().includes(searchTerm) ?? false;

    // Search in tags
    const tagMatch = doc.tags.some((tag) =>
      tag.toLowerCase().includes(searchTerm)
    );

    // Search in type
    const typeMatch = doc.type.toLowerCase().includes(searchTerm);

    return titleMatch || contentMatch || tagMatch || typeMatch;
  });
};

export function DocumentsGrid({ documents, searchQuery }: DocumentsGridProps) {
  const filteredDocuments = filterDocuments(documents, searchQuery);

  if (documents.length === 0) {
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

  if (filteredDocuments.length === 0 && searchQuery) {
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
      {searchQuery && (
        <div className="mb-4">
          <p className="text-sm text-slate-600">
            Found {filteredDocuments.length} document
            {filteredDocuments.length !== 1 ? "s" : ""}
            {searchQuery.startsWith("@")
              ? ` with tag matching "${searchQuery.slice(1)}"`
              : ` matching "${searchQuery}"`}
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDocuments.map((document: Document) => (
          <Link
            key={document.id}
            href={`/dashboard/library/${document.id}`}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg hover:border-emerald-300 transition-all duration-200 cursor-pointer group flex flex-col h-full"
          >
            <div className="flex items-start justify-start gap-4 mb-3">
              <div className="flex items-center">
                <DocumentIcon className="h-5 w-5 text-emerald-600 mr-2 flex-shrink-0" />
                <span className="text-xs font-medium text-emerald-700 uppercase tracking-wide">
                  {document.type}
                </span>
              </div>
              <div className="flex items-center text-gray-400 text-sm ml-auto">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {formatDate(document.createdAt)}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-900 transition-colors">
              {document.title}
            </h3>

            <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">
              {document.content
                ? truncateContent(document.content)
                : "No content available"}
            </p>

            {document.tags && document.tags.length > 0 ? (
              <div className="flex items-center flex-wrap gap-2 mt-auto">
                <TagIcon className="h-4 w-4 text-gray-400" />
                {document.tags.slice(0, 3).map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {document.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{document.tags.length - 3} more
                  </span>
                )}
              </div>
            ) : (
              <div className="mt-auto"></div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
