"use client";

import { useState, useCallback, useEffect } from "react";
import { LibraryPageSkeleton } from "@/app/ui/skeletons";
import { getUserDocuments } from "@/app/lib/actions";
import { SearchForm } from "@/app/ui/dashboard/shared/search-form";
import { DocumentsGrid } from "@/app/ui/dashboard/library/documents-grid";

type Document = {
  id: string;
  title: string;
  content: string | null;
  type: string;
  createdAt: Date;
  tags: string[];
};

type LibraryContentProps = {
  initialQuery?: string;
};

export function LibraryContent({ initialQuery = "" }: LibraryContentProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

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

  if (loading) {
    return <LibraryPageSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SearchForm
        mode="local"
        onSearch={handleSearch}
        showButton={false}
        updateUrl={true}
        availableTags={availableTags}
        initialQuery={initialQuery}
      />

      <DocumentsGrid documents={documents} searchQuery={searchQuery} />
    </div>
  );
}
