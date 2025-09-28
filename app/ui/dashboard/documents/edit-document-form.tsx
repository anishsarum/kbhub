"use client";

import { useActionState } from "react";
import { updateTextDocument } from "@/app/lib/document-actions";
import { DocumentForm } from "@/app/ui/dashboard/documents/document-form";
import { Document } from "@/app/lib/definitions";

interface EditDocumentFormProps {
  document: Document;
  availableTags: string[];
}

export function EditDocumentForm({
  document,
  availableTags,
}: EditDocumentFormProps) {
  // Create bound action with document ID
  const updateDocumentWithId = updateTextDocument.bind(null, document.id);
  const [errorMessage, formAction, isPending] = useActionState(
    updateDocumentWithId,
    undefined
  );

  return (
    <DocumentForm
      mode="edit"
      document={document}
      formAction={formAction}
      isPending={isPending}
      errorMessage={errorMessage}
      availableTags={availableTags}
    />
  );
}
