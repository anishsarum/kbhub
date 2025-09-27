"use client";

import { useActionState } from "react";
import { createTextDocument } from "@/app/lib/actions";
import { DocumentForm } from "./document-form";

export function CreateTextDocumentForm() {
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
    />
  );
}
