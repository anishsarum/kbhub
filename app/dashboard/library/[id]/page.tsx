import { DocumentDetailSkeleton } from "@/app/ui/skeletons";
import { DocumentDetail } from "@/app/ui/dashboard/library/document-detail";
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
    <Suspense fallback={<DocumentDetailSkeleton />}>
      <DocumentDetail id={id} />
    </Suspense>
  );
}
