import { getUserDocuments } from "@/app/lib/document-actions";
import { DocumentGrid } from "@/app/ui/dashboard/library/document-grid";

type LibraryResultsProps = {
  searchQuery: string;
};

export async function LibraryResults({ searchQuery }: LibraryResultsProps) {
  // This is a server component that uses await - Suspense will work properly
  const documents = await getUserDocuments();

  return (
    <DocumentGrid
      documents={documents}
      searchQuery={searchQuery}
      showEmptyState={true}
      showSearchResults={true}
    />
  );
}
