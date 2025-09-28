import type { Metadata } from "next";
import { Suspense } from "react";
import { DocumentCreationTabs } from "@/app/ui/dashboard/documents/document-creation-tabs";
import { DocumentCreationSkeleton } from "@/app/ui/skeletons";
import Breadcrumbs from "@/app/ui/shared/breadcrumbs";
import { getUserTags } from "@/app/lib/document-actions";

export const metadata: Metadata = {
  title: "Create Documents",
};

export default async function DocumentsPage() {
  const availableTags = await getUserTags();

  return (
    <div className="space-y-6">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Documents", href: "/dashboard/documents", active: true },
        ]}
      />
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Create Documents</h1>
        <p className="text-slate-600 mt-2">
          Add new content to your knowledge base
        </p>
      </div>

      <Suspense fallback={<DocumentCreationSkeleton />}>
        <DocumentCreationTabs availableTags={availableTags} />
      </Suspense>
    </div>
  );
}
