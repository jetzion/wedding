"use client";

import { type FormEvent, useState } from "react";
import { cardClass, primaryButton, TextField } from "@/components/rsvp/fields";

/** Invitation code form. */
export function CodeEntry({
  initialCode,
  busy,
  error,
  onSubmit,
}: {
  initialCode: string;
  busy: boolean;
  error: string | null;
  onSubmit: (code: string) => void;
}) {
  const [code, setCode] = useState(initialCode);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (code.trim()) onSubmit(code.trim());
  }

  return (
    <form onSubmit={submit} className={`${cardClass} mx-auto max-w-md space-y-5 text-center`}>
      <p className="text-ink-muted">
        Enter the invitation code from your invitation to find your RSVP.
      </p>
      <TextField
        label="Invitation code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="ABCD-2345"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        maxLength={20}
        required
      />
      {error && (
        <p role="alert" className="text-coral">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className={primaryButton}>
        {busy ? "Looking up…" : "Find my invitation"}
      </button>
    </form>
  );
}
