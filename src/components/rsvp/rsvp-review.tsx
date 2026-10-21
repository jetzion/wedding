"use client";

import { cardClass, primaryButton, secondaryButton } from "@/components/rsvp/fields";
import { displayName, type FormState } from "@/components/rsvp/form-state";
import type { Invitation } from "@/lib/rsvp/types";

const label = { attending: "Joyfully attending", declined: "Regretfully declining" };

/** Read-only summary of the household's answers. */
function Summary({ invitation, state }: { invitation: Invitation; state: FormState }) {
  return (
    <div className="space-y-5">
      {state.guests.map((guest, i) => {
        const invited = invitation.guests[i];
        return (
          <div key={guest.id} className="border-b border-sand-edge pb-4 last:border-0">
            <h3 className="font-serif text-xl">{displayName(invited, guest)}</h3>
            <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              {invitation.events
                .filter((e) => invited.eventIds.includes(e.id))
                .map((e) => (
                  <div key={e.id} className="contents">
                    <dt className="text-ink-muted">{e.name}</dt>
                    <dd>{label[guest.responses[e.id]!]}</dd>
                  </div>
                ))}
              {guest.dietaryRestrictions && (
                <>
                  <dt className="text-ink-muted">Dietary</dt>
                  <dd>{guest.dietaryRestrictions}</dd>
                </>
              )}
              {guest.accessibilityNeeds && (
                <>
                  <dt className="text-ink-muted">Accessibility</dt>
                  <dd>{guest.accessibilityNeeds}</dd>
                </>
              )}
            </dl>
          </div>
        );
      })}
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <dt className="text-ink-muted">Email</dt>
        <dd className="break-all">{state.contactEmail}</dd>
        {state.message && (
          <>
            <dt className="text-ink-muted">Note</dt>
            <dd>{state.message}</dd>
          </>
        )}
      </dl>
    </div>
  );
}

/** Review step: confirm before saving. */
export function RsvpReview({
  invitation,
  state,
  busy,
  error,
  onEdit,
  onSubmit,
}: {
  invitation: Invitation;
  state: FormState;
  busy: boolean;
  error: string | null;
  onEdit: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className={`${cardClass} space-y-6`}>
      <h2 className="text-center font-serif text-3xl">Does this look right?</h2>
      <Summary invitation={invitation} state={state} />
      {error && (
        <p role="alert" className="text-center text-coral">
          {error} Your answers are still here.
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onEdit} disabled={busy} className={secondaryButton}>
          Edit
        </button>
        <button type="button" onClick={onSubmit} disabled={busy} className={primaryButton}>
          {busy ? "Sending…" : "Send my RSVP"}
        </button>
      </div>
    </div>
  );
}

/** Shown only after the server confirms the RSVP was saved. */
export function RsvpConfirmation({
  invitation,
  state,
  confirmationCode,
  onEdit,
}: {
  invitation: Invitation;
  state: FormState;
  confirmationCode: string;
  onEdit: () => void;
}) {
  return (
    <div className={`${cardClass} space-y-6`}>
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">Thank you</p>
        <h2 className="font-serif text-3xl sm:text-4xl">Your RSVP is in</h2>
        <p className="mt-3 text-ink-muted">
          Confirmation number <strong className="tracking-wider text-ink">{confirmationCode}</strong>
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          You can come back with your code to make changes until the RSVP deadline.
        </p>
      </div>
      <Summary invitation={invitation} state={state} />
      <div className="text-center">
        <button type="button" onClick={onEdit} className={secondaryButton}>
          Change my answers
        </button>
      </div>
    </div>
  );
}
