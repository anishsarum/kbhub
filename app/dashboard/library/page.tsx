import { LibraryPageSkeleton } from "@/app/ui/skeletons";
import { DocumentsList } from "@/app/ui/dashboard/documents-list";
import { Suspense } from "react";

export default function LibraryPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Library</h1>
        <p className="text-gray-600 mt-2">
          Browse and organize your document collection
        </p>
      </div>

      <Suspense fallback={<LibraryPageSkeleton />}>
        <DocumentsList />
      </Suspense>
    </div>
  );
}
