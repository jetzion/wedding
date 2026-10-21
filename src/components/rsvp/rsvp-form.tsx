"use client";

import { type FormEvent, useState } from "react";
import { cardClass, ChoiceGroup, primaryButton, TextArea, TextField } from "@/components/rsvp/fields";
import {
  displayName,
  type FormState,
  formErrors,
  type GuestState,
  isAttending,
} from "@/components/rsvp/form-state";
import { frostedPanel } from "@/components/page-hero";
import type { Invitation, InvitationEvent } from "@/lib/rsvp/types";

const choices = [
  { value: "attending" as const, label: "Joyfully attending" },
  { value: "declined" as const, label: "Regretfully declining" },
];

export function eventTime(event: InvitationEvent, timezone: string) {
  if (!event.startsAt) return "Time to be announced";
  return new Date(event.startsAt).toLocaleString("en-US", {
    timeZone: timezone,
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** The RSVP form for one household. */
export function RsvpForm({
  invitation,
  state,
  onChange,
  onReview,
}: {
  invitation: Invitation;
  state: FormState;
  onChange: (state: FormState) => void;
  onReview: () => void;
}) {
  const [errors, setErrors] = useState<string[]>([]);

  const updateGuest = (index: number, patch: Partial<GuestState>) =>
    onChange({ ...state, guests: state.guests.map((g, i) => (i === index ? { ...g, ...patch } : g)) });

  function review(event: FormEvent) {
    event.preventDefault();
    const found = formErrors(invitation, state);
    setErrors(found);
    if (!found.length) onReview();
  }

  return (
    <form onSubmit={review} noValidate className="space-y-6">
      <div className={`${frostedPanel} px-6 py-6 text-center`}>
        <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">Welcome</p>
        <h2 className="font-serif text-3xl sm:text-4xl">{invitation.householdName}</h2>
        {invitation.confirmationCode && (
          <p className="mt-3 text-ink-muted">
            We have your RSVP ({invitation.confirmationCode}). You can update it below.
          </p>
        )}
      </div>

      {state.guests.map((guest, i) => (
        <GuestCard
          key={guest.id}
          invitation={invitation}
          index={i}
          guest={guest}
          onChange={(patch) => updateGuest(i, patch)}
        />
      ))}

      <section className={`${cardClass} space-y-5`} aria-labelledby="household-details">
        <h3 id="household-details" className="font-serif text-2xl">
          Your details
        </h3>
        <TextField
          label="Email for your confirmation"
          type="email"
          autoComplete="email"
          value={state.contactEmail}
          onChange={(e) => onChange({ ...state, contactEmail: e.target.value })}
          maxLength={200}
          required
        />
        <TextArea
          label="A note for Daniella & Greg (optional)"
          value={state.message}
          onChange={(message) => onChange({ ...state, message })}
          maxLength={1000}
        />
      </section>

      {errors.length > 0 && (
        <ul role="alert" className="space-y-1 rounded-2xl border border-coral/40 bg-shell p-4 text-coral">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <div className="text-center">
        <button type="submit" className={primaryButton}>
          Review my RSVP
        </button>
      </div>
    </form>
  );
}

function GuestCard({
  invitation,
  index,
  guest,
  onChange,
}: {
  invitation: Invitation;
  index: number;
  guest: GuestState;
  onChange: (patch: Partial<GuestState>) => void;
}) {
  const invited = invitation.guests[index];
  const events = invitation.events.filter((e) => invited.eventIds.includes(e.id));

  return (
    <section className={`${cardClass} space-y-6`} aria-label={displayName(invited, guest)}>
      <div>
        {invited.isPlusOne && (
          <p className="text-sm uppercase tracking-[0.2em] text-ink-muted">Your plus-one</p>
        )}
        <h3 className="font-serif text-2xl">{displayName(invited, guest)}</h3>
      </div>

      {invited.isPlusOne && (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="First name"
            value={guest.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            maxLength={80}
            autoComplete="off"
          />
          <TextField
            label="Last name"
            value={guest.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            maxLength={80}
            autoComplete="off"
          />
        </div>
      )}

      {events.map((event) => (
        <ChoiceGroup
          key={event.id}
          legend={event.name}
          name={`${guest.id}-${event.id}`}
          value={guest.responses[event.id]}
          options={choices}
          onChange={(status) => onChange({ responses: { ...guest.responses, [event.id]: status } })}
        >
          <p className="text-sm text-ink-muted">{eventTime(event, invitation.timezone)}</p>
        </ChoiceGroup>
      ))}

      {isAttending(guest) && (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Dietary restrictions"
            placeholder="Allergies, vegetarian, kosher…"
            value={guest.dietaryRestrictions}
            onChange={(e) => onChange({ dietaryRestrictions: e.target.value })}
            maxLength={500}
          />
          <TextField
            label="Accessibility needs"
            placeholder="Seating, mobility, anything that helps"
            value={guest.accessibilityNeeds}
            onChange={(e) => onChange({ accessibilityNeeds: e.target.value })}
            maxLength={500}
          />
        </div>
      )}
    </section>
  );
}
