import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DocumentIcon,
  CalendarIcon,
  TagIcon,
  PencilIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { getDocumentById } from "@/app/lib/actions";
import { DeleteDocumentButton } from "@/app/ui/dashboard/documents/delete-document-button";
import Breadcrumbs from "@/app/ui/shared/breadcrumbs";
import { formatDateTime } from "@/app/lib/utils";

interface DocumentDetailProps {
  id: string;
}

export async function DocumentDetail({ id }: DocumentDetailProps) {
  let document;

  try {
    document = await getDocumentById(id);
  } catch (error) {
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

      {/* Document Header */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center mb-2">
              <DocumentIcon className="h-6 w-6 text-emerald-600 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium text-emerald-700 uppercase tracking-wide">
                {document.type}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {document.title}
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Link
              href={`/dashboard/library/${document.id}/edit`}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </Link>

            <DeleteDocumentButton
              documentId={document.id}
              documentTitle={document.title}
            />
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            Created: {formatDateTime(document.createdAt)}
          </div>
          {document.updatedAt &&
            document.updatedAt.getTime() !== document.createdAt.getTime() && (
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Updated: {formatDateTime(document.updatedAt)}
              </div>
            )}
        </div>

        {/* Tags */}
        {document.tags && document.tags.length > 0 && (
          <div className="flex items-center flex-wrap gap-2 mb-6">
            <TagIcon className="h-4 w-4 text-gray-400" />
            {document.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-block bg-emerald-100 text-emerald-800 text-sm px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Document Content */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content</h3>
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {document.content || "No content available"}
          </div>
        </div>
      </div>
    </div>
  );
}
