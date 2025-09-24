import { DocumentCreationTabs } from "@/app/ui/dashboard/document-creation-tabs";

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Create Documents</h1>
        <p className="text-slate-600 mt-2">
          Add new content to your knowledge base
        </p>
      </div>

      <DocumentCreationTabs />
    </div>
  );
}
