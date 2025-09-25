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
    <Suspense fallback={<EditDocumentSkeleton />}>
      <EditDocumentContent id={id} />
    </Suspense>
  );
}
