"use client";

import { useState, useActionState } from "react";
import { createTextDocument } from "@/app/lib/actions";
import {
  DocumentTextIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/24/outline";

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<"text" | "pdf">("text");
  const [errorMessage, formAction, isPending] = useActionState(
    createTextDocument,
    undefined
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Create Documents</h1>
        <p className="text-slate-600 mt-2">
          Add new content to your knowledge base
        </p>
      </div>

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
        {activeTab === "text" && (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Create Text Document
            </h2>

            <form action={formAction} className="space-y-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  maxLength={200}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter document title..."
                />
              </div>

              {/* Content */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  required
                  rows={12}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Write your content here... (Markdown supported)"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Supports Markdown formatting
                </p>
              </div>

              {/* Tags */}
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter tags separated by commas..."
                />
                <p className="text-xs text-slate-500 mt-1">
                  e.g., research, notes, important
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{errorMessage}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isPending}
                  className={`px-6 py-2 rounded-lg text-white font-medium ${
                    isPending
                      ? "bg-emerald-400 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  } focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2`}
                >
                  {isPending ? "Creating..." : "Create Document"}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "pdf" && (
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
                  <strong>Next:</strong> We'll build PDF upload with automatic
                  text extraction and embedding generation
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
