import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { EditDocumentSkeleton } from "@/app/ui/skeletons";
import { EditDocumentContent } from "@/app/ui/dashboard/edit-document-content";
import { Suspense } from "react";

type EditDocumentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditDocumentPage({
  params,
}: EditDocumentPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div>
        <Link
          href={`/dashboard/library/${id}`}
          className="inline-flex items-center text-emerald-600 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Document
        </Link>
      </div>

      <Suspense fallback={<EditDocumentSkeleton />}>
        <EditDocumentContent id={id} />
      </Suspense>
    </div>
  );
}
