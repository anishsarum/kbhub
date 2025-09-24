import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { DocumentDetailSkeleton } from "@/app/ui/skeletons";
import { DocumentDetail } from "@/app/ui/dashboard/document-detail";
import { Suspense } from "react";

type DocumentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DocumentDetailPage({
  params,
}: DocumentDetailPageProps) {
  const { id } = await params;

  return (
    <div>
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

      <Suspense fallback={<DocumentDetailSkeleton />}>
        <DocumentDetail id={id} />
      </Suspense>
    </div>
  );
}
