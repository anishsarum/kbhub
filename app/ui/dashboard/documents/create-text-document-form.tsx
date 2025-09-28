"use client";

import { useActionState } from "react";
import { createTextDocument } from "@/app/lib/document-actions";
import { DocumentForm } from "@/app/ui/dashboard/documents/document-form";

interface CreateTextDocumentFormProps {
  availableTags: string[];
}

export function CreateTextDocumentForm({
  availableTags,
}: CreateTextDocumentFormProps) {
  const [errorMessage, formAction, isPending] = useActionState(
    createTextDocument,
    undefined
  );

  return (
    <DocumentForm
      mode="create"
      formAction={formAction}
      isPending={isPending}
      errorMessage={errorMessage}
      availableTags={availableTags}
    />
  );
}
