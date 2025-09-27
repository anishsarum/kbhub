"use client";

import { useState } from "react";
import {
  DocumentTextIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/24/outline";
import { CreateTextDocumentForm } from "@/app/ui/dashboard/documents/create-text-document-form";
import { UploadPDFPlaceholder } from "@/app/ui/dashboard/documents/upload-pdf-placeholder";

type TabType = "text" | "pdf";

export function DocumentCreationTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("text");

  return (
    <>
      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("text")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "text"
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <DocumentTextIcon className="w-5 h-5 inline mr-2" />
            New Text Note
          </button>
          <button
            onClick={() => setActiveTab("pdf")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "pdf"
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <DocumentArrowUpIcon className="w-5 h-5 inline mr-2" />
            Upload PDF
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        {activeTab === "text" && <CreateTextDocumentForm />}
        {activeTab === "pdf" && <UploadPDFPlaceholder />}
      </div>
    </>
  );
}
