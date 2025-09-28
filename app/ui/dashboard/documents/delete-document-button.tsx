"use client";

import { useState, useActionState } from "react";
import { deleteDocument } from "@/app/lib/document-actions";
import { TrashIcon } from "@heroicons/react/24/outline";

interface DeleteDocumentButtonProps {
  documentId: string;
  documentTitle: string;
}

export function DeleteDocumentButton({
  documentId,
  documentTitle,
}: DeleteDocumentButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorMessage, formAction, isPending] = useActionState(
    deleteDocument.bind(null, documentId),
    undefined
  );

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <div className="flex items-center mb-4">
            <TrashIcon className="h-6 w-6 text-red-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              Delete Document
            </h3>
          </div>

          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{documentTitle}"? This action
            cannot be undone.
          </p>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-800 text-sm">{errorMessage}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowConfirmation(false)}
              disabled={isPending}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <form action={formAction} className="inline">
              <button
                type="submit"
                disabled={isPending}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  isPending
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 cursor-pointer"
                } focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirmation(true)}
      className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-red-700 text-sm font-medium hover:bg-red-50 transition-colors cursor-pointer"
    >
      <TrashIcon className="h-4 w-4 mr-2" />
      Delete
    </button>
  );
}
