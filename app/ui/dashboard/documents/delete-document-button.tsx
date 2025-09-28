"use client";

import { useState, useActionState } from "react";
import { deleteDocument } from "@/app/lib/document-actions";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/shared/button";

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
            <Button
              onClick={() => setShowConfirmation(false)}
              disabled={isPending}
              variant="outline"
            >
              Cancel
            </Button>
            <form action={formAction} className="inline">
              <Button type="submit" loading={isPending} variant="danger">
                {isPending ? "Deleting..." : "Delete"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button onClick={() => setShowConfirmation(true)} variant="danger-outline">
      <TrashIcon className="h-4 w-4 mr-2" />
      Delete
    </Button>
  );
}
