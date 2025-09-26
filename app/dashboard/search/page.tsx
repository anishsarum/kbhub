import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchForm } from "@/app/ui/dashboard/shared/search-form";
import { SearchResults } from "@/app/ui/dashboard/search/search-results";
import { SearchResultsSkeleton } from "@/app/ui/skeletons";
import Breadcrumbs from "@/app/ui/shared/breadcrumbs";

export const metadata: Metadata = {
  title: "AI Search",
};

type SearchPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query =
    typeof resolvedSearchParams?.q === "string" ? resolvedSearchParams.q : "";

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Search", href: "/dashboard/search", active: true },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Search</h1>
        <p className="text-gray-600 mt-2">
          AI-powered semantic search through your knowledge base
        </p>
      </div>

      <SearchForm initialQuery={query} />

      {query && (
        <Suspense key={query} fallback={<SearchResultsSkeleton />}>
          <SearchResults query={query} />
        </Suspense>
      )}
    </div>
  );
}
