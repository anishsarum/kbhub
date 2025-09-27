"use client";

import { useActionState } from "react";
import { updateTextDocument } from "@/app/lib/actions";
import { DocumentForm } from "./document-form";

type Document = {
  id: string;
  title: string;
  content: string | null;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
};

interface EditDocumentFormProps {
  document: Document;
}

export function EditDocumentForm({ document }: EditDocumentFormProps) {
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
    />
  );
}
