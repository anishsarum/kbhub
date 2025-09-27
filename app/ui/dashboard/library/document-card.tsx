import Link from "next/link";
import {
  DocumentIcon,
  CalendarIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { Document } from "@/app/lib/definitions";
import { formatDate, truncateContent } from "@/app/lib/utils";

interface DocumentCardProps {
  document: Document;
}

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Link
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
  );
}
