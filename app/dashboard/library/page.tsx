import type { Metadata } from "next";
import { Suspense } from "react";
import { LibraryResults } from "@/app/ui/dashboard/library/library-results";
import { SearchForm } from "@/app/ui/dashboard/shared/search-form";
import { LibraryPageSkeleton } from "@/app/ui/skeletons";
import Breadcrumbs from "@/app/ui/shared/breadcrumbs";
import { getUserTags } from "@/app/lib/actions";

export const metadata: Metadata = {
  title: "Library",
};

type LibraryPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const resolvedSearchParams = await searchParams;
  const query =
    typeof resolvedSearchParams?.q === "string" ? resolvedSearchParams.q : "";

  // Get available tags for autocomplete
  const availableTags = await getUserTags();

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

      <SearchForm
        mode="local"
        showButton={false}
        updateUrl={true}
        availableTags={availableTags}
        initialQuery={query}
      />

      <Suspense fallback={<LibraryPageSkeleton />}>
        <LibraryResults searchQuery={query} />
      </Suspense>
    </div>
  );
}
