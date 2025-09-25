import { SearchForm } from "@/app/ui/dashboard/search-form";
import { SearchResults } from "@/app/ui/dashboard/search-results";
import { SearchResultsSkeleton } from "@/app/ui/skeletons";
import Breadcrumbs from "@/app/ui/shared/breadcrumbs";
import { Suspense } from "react";

type SearchPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = typeof searchParams?.q === "string" ? searchParams.q : "";

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
