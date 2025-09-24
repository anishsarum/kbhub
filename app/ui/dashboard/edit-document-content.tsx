import { getDocumentById } from "@/app/lib/actions";
import { notFound } from "next/navigation";
import { EditDocumentForm } from "./edit-document-form";

interface EditDocumentContentProps {
  id: string;
}

export async function EditDocumentContent({ id }: EditDocumentContentProps) {
  let document;

  try {
    document = await getDocumentById(id);
  } catch (error) {
    notFound();
  }

  return (
    <>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Edit Document</h1>
        <p className="text-slate-600 mt-2">
          Update your document content and metadata
        </p>
      </div>

      {/* Content */}
      <EditDocumentForm document={document} />
    </>
  );
}
