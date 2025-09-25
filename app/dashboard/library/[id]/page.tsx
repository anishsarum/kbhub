import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { DocumentDetailSkeleton } from "@/app/ui/skeletons";
import { DocumentDetail } from "@/app/ui/dashboard/document-detail";
import Breadcrumbs from "@/app/ui/shared/breadcrumbs";
import { getDocumentById } from "@/app/lib/actions";
import { Suspense } from "react";
import { notFound } from "next/navigation";

type DocumentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function DocumentWithBreadcrumbs({ id }: { id: string }) {
  let document;

  try {
    document = await getDocumentById(id);
  } catch (error) {
    notFound();
  }

  if (!document) {
    notFound();
  }

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Library", href: "/dashboard/library" },
          {
            label: document.title,
            href: `/dashboard/library/${id}`,
            active: true,
          },
        ]}
      />

      {/* Back to Library */}
      <div className="mb-6">
        <Link
          href="/dashboard/library"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Library
        </Link>
      </div>

      <DocumentDetail id={id} />
    </div>
  );
}

export default async function DocumentDetailPage({
  params,
}: DocumentDetailPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<DocumentDetailSkeleton />}>
      <DocumentWithBreadcrumbs id={id} />
    </Suspense>
  );
}
