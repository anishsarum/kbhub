import { DocumentArrowUpIcon } from "@heroicons/react/24/outline";

export function UploadPDFPlaceholder() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-4">
        Upload PDF Document
      </h2>

      <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-lg">
        <DocumentArrowUpIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          PDF Upload Coming Soon
        </h3>
        <p className="text-slate-600">
          Drag and drop PDF files or click to browse your computer
        </p>

        <div className="mt-6 p-4 bg-emerald-50 rounded-lg max-w-md mx-auto">
          <p className="text-emerald-800 text-sm">
            <strong>Next:</strong> We'll build PDF upload with automatic text
            extraction and embedding generation
          </p>
        </div>
      </div>
    </div>
  );
}
