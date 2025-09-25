import { LibraryContent } from "@/app/ui/dashboard/library/library-content";
import Breadcrumbs from "@/app/ui/shared/breadcrumbs";
import { Suspense } from "react";

type LibraryPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const resolvedSearchParams = await searchParams;
  const query =
    typeof resolvedSearchParams?.q === "string" ? resolvedSearchParams.q : "";

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

      <LibraryContent initialQuery={query} />
    </div>
  );
}
