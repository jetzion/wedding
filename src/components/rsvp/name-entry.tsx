"use client";

import { type FormEvent, useState } from "react";
import type { GuestName } from "@/app/rsvp/actions";
import { cardClass, primaryButton, secondaryButton, TextField } from "@/components/rsvp/fields";

/** Guest-name lookup, with a household picker when several households match. */
export function NameEntry({
  initialName,
  choices,
  busy,
  error,
  onSubmit,
  onChoose,
}: {
  initialName: GuestName;
  choices: { id: string; name: string }[];
  busy: boolean;
  error: string | null;
  onSubmit: (name: GuestName) => void;
  onChoose: (householdId: string) => void;
}) {
  const [firstName, setFirstName] = useState(initialName.firstName);
  const [lastName, setLastName] = useState(initialName.lastName);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (firstName.trim() && lastName.trim()) {
      onSubmit({ firstName: firstName.trim(), lastName: lastName.trim() });
    }
  }

  return (
    <div className={`${cardClass} mx-auto max-w-md space-y-5 text-center`}>
      <form onSubmit={submit} className="space-y-5">
        <p className="text-ink-muted">Enter your name as it appears on your invitation.</p>
        <div className="grid gap-4 text-left sm:grid-cols-2">
          <TextField
            label="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
            maxLength={80}
            required
          />
          <TextField
            label="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
            maxLength={80}
            required
          />
        </div>
        {error && (
          <p role="alert" className="text-coral">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className={primaryButton}>
          {busy ? "Looking up…" : "Find my invitation"}
        </button>
      </form>

      {choices.length > 0 && (
        <fieldset className="space-y-3 border-t border-sand-edge pt-5">
          <legend className="sr-only">Choose your household</legend>
          <p role="status" className="text-ink-muted">
            We found more than one invitation. Which one is yours?
          </p>
          {choices.map((household) => (
            <button
              key={household.id}
              type="button"
              disabled={busy}
              onClick={() => onChoose(household.id)}
              className={`${secondaryButton} block w-full`}
            >
              {household.name}
            </button>
          ))}
        </fieldset>
      )}
    </div>
  );
}
