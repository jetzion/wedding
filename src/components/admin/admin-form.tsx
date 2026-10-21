"use client";

import { type ReactNode, useActionState } from "react";
import type { FormResult } from "@/app/admin/actions";
import { cardClass, primaryButton } from "@/components/rsvp/fields";

/** Card-style form wired to an admin server action, showing its error message. */
export function AdminForm({
  action,
  submitLabel,
  children,
}: {
  action: (state: FormResult, form: FormData) => Promise<FormResult>;
  submitLabel: string;
  children: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className={`${cardClass} mx-auto max-w-md space-y-5`}>
      {children}
      {state.error && (
        <p role="alert" className="text-coral">
          {state.error}
        </p>
      )}
      <div className="text-center">
        <button type="submit" disabled={pending} className={primaryButton}>
          {pending ? "Please wait…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
