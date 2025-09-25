"use client";

import { useState, useCallback, useEffect } from "react";
import { LibraryPageSkeleton } from "@/app/ui/skeletons";
import { getUserDocuments } from "@/app/lib/actions";
import { SearchForm } from "@/app/ui/dashboard/search-form";
import { DocumentsGrid } from "@/app/ui/dashboard/documents-grid";
import Breadcrumbs from "@/app/ui/shared/breadcrumbs";

type Document = {
  id: string;
  title: string;
  content: string | null;
  type: string;
  createdAt: Date;
  tags: string[];
};

export default function LibraryPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Extract all unique tags from documents
  const getAllTags = useCallback(() => {
    const tagSet = new Set<string>();
    documents.forEach((doc) => {
      doc.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [documents]);

  const availableTags = getAllTags();

  // Load documents
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        const docs = await getUserDocuments();
        setDocuments(docs);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load documents"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Library", href: "/dashboard/library", active: true },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Library</h1>
        <p className="text-gray-600 mt-2">
          Browse and organize your document collection
        </p>
      </div>

      {/* Search stays outside loading state so it's always available */}
      <SearchForm
        mode="local"
        onSearch={handleSearch}
        showButton={false}
        updateUrl={true}
        availableTags={availableTags}
      />

      {loading ? (
        <LibraryPageSkeleton />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      ) : (
        <DocumentsGrid documents={documents} searchQuery={searchQuery} />
      )}
    </div>
  );
}
