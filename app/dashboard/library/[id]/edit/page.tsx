import type { Metadata } from "next";
import { Suspense } from "react";
import { EditDocumentSkeleton } from "@/app/ui/skeletons";
import { EditDocumentContent } from "@/app/ui/dashboard/documents/edit-document-content";
import { getDocumentById } from "@/app/lib/document-actions";

type EditDocumentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: EditDocumentPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const document = await getDocumentById(id);
    return {
      title: `Edit ${document.title}`,
    };
  } catch {
    return {
      title: "Edit Document",
    };
  }
}

export default async function EditDocumentPage({
  params,
}: EditDocumentPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<EditDocumentSkeleton />}>
      <EditDocumentContent id={id} />
    </Suspense>
  );
}
