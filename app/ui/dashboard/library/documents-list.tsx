import { getUserDocuments } from "@/app/lib/actions";
import {
  DocumentIcon,
  CalendarIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

type Document = {
  id: string;
  title: string;
  content: string | null;
  type: string;
  createdAt: Date;
  tags: string[];
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

const truncateContent = (content: string, maxLength = 150) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + "...";
};

export async function DocumentsList() {
  try {
    const documents = await getUserDocuments();

    if (documents.length === 0) {
      return (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8 text-center">
          <DocumentIcon className="mx-auto h-12 w-12 text-emerald-400 mb-4" />
          <h3 className="text-lg font-medium text-emerald-900 mb-2">
            No documents yet
          </h3>
          <p className="text-emerald-700 mb-4">
            Get started by creating your first document or uploading a PDF.
          </p>
          <Link
            href="/dashboard/documents"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors"
          >
            Create Document
          </Link>
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((document: Document) => (
          <Link
            key={document.id}
            href={`/dashboard/library/${document.id}`}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg hover:border-emerald-300 transition-all duration-200 cursor-pointer group flex flex-col h-full"
          >
            <div className="flex items-start justify-start gap-4 mb-3">
              <div className="flex items-center">
                <DocumentIcon className="h-5 w-5 text-emerald-600 mr-2 flex-shrink-0" />
                <span className="text-xs font-medium text-emerald-700 uppercase tracking-wide">
                  {document.type}
                </span>
              </div>
              <div className="flex items-center text-gray-400 text-sm ml-auto">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {formatDate(document.createdAt)}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-900 transition-colors">
              {document.title}
            </h3>

            <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">
              {document.content
                ? truncateContent(document.content)
                : "No content available"}
            </p>

            {document.tags && document.tags.length > 0 ? (
              <div className="flex items-center flex-wrap gap-2 mt-auto">
                <TagIcon className="h-4 w-4 text-gray-400" />
                {document.tags.slice(0, 3).map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {document.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{document.tags.length - 3} more
                  </span>
                )}
              </div>
            ) : (
              <div className="mt-auto"></div>
            )}
          </Link>
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">
          {error instanceof Error ? error.message : "Failed to load documents"}
        </p>
      </div>
    );
  }
}
