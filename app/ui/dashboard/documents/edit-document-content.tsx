import { getDocumentById } from "@/app/lib/actions";
import { notFound } from "next/navigation";
import { EditDocumentForm } from "./edit-document-form";
import Breadcrumbs from "@/app/ui/shared/breadcrumbs";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

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
    <div className="space-y-6">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Library", href: "/dashboard/library" },
          {
            label: document.title,
            href: `/dashboard/library/${id}`,
          },
          {
            label: "Edit",
            href: `/dashboard/library/${id}/edit`,
            active: true,
          },
        ]}
      />

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

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Edit Document</h1>
        <p className="text-slate-600 mt-2">
          Update your document content and metadata
        </p>
      </div>

      {/* Content */}
      <EditDocumentForm document={document} />
    </div>
  );
}
