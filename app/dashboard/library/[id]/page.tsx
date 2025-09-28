import type { Metadata } from "next";
import { Suspense } from "react";
import { DocumentDetailSkeleton } from "@/app/ui/skeletons";
import { DocumentDetail } from "@/app/ui/dashboard/library/document-detail";
import { getDocumentById } from "@/app/lib/document-actions";

type DocumentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: DocumentDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const document = await getDocumentById(id);
    return {
      title: document.title,
    };
  } catch {
    return {
      title: "Document Not Found",
    };
  }
}

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
