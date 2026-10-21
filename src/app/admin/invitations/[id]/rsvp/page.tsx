import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { correctRsvp } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
import { TextField } from "@/components/rsvp/fields";
import { loadHouseholdRsvp } from "@/lib/admin/rsvp";
import { answerField } from "@/lib/admin/rsvp-correction";
import type { InvitationGuest } from "@/lib/rsvp/types";

const CHOICES = [
  { value: "attending", label: "Attending" },
  { value: "declined", label: "Declined" },
  { value: "awaiting", label: "Awaiting response" },
];

export default function Page({ params }: PageProps<"/admin/invitations/[id]/rsvp">) {
  return (
    <div className="space-y-6">
      <h1 className="text-center font-serif text-4xl">Correct RSVP</h1>
      <Suspense fallback={<p className="text-center text-ink-muted">Loading…</p>}>
        {params.then(({ id }) => (
          <CorrectRsvpForm id={id} />
        ))}
      </Suspense>
      <p className="text-center">
        <Link href="/admin" className="text-sea underline">
          Back to invitations
        </Link>
      </p>
    </div>
  );
}

const guestLabel = (g: InvitationGuest) => [g.firstName, g.lastName].filter(Boolean).join(" ") || "Plus-one";

/** Admin-only form. loadHouseholdRsvp checks the admin session. */
async function CorrectRsvpForm({ id }: { id: string }) {
  const loaded = await loadHouseholdRsvp(id);
  if (!loaded) notFound();
  const { invitation } = loaded;

  return (
    <AdminForm action={correctRsvp} submitLabel="Save answers">
      <input type="hidden" name="id" value={loaded.householdId} />
      <h2 className="font-serif text-2xl">{invitation.householdName}</h2>
      <p className="text-sm text-ink-muted">
        Changes here apply even after the RSVP deadline. &ldquo;Awaiting response&rdquo; clears the answer.
      </p>
      {invitation.guests.map((guest) => (
        <fieldset key={guest.id} className="space-y-3 border-t border-sand-edge pt-4">
          <legend className="font-serif text-xl">{guestLabel(guest)}</legend>
          {guest.isPlusOne && (
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="First name"
                name={`firstName:${guest.id}`}
                defaultValue={guest.firstName ?? ""}
                maxLength={80}
                autoComplete="off"
              />
              <TextField
                label="Last name"
                name={`lastName:${guest.id}`}
                defaultValue={guest.lastName ?? ""}
                maxLength={80}
                autoComplete="off"
              />
            </div>
          )}
          {invitation.events
            .filter((event) => guest.eventIds.includes(event.id))
            .map((event) => (
              <AnswerChoice
                key={event.id}
                name={answerField(guest.id, event.id)}
                legend={event.name}
                current={invitation.responses[guest.id]?.[event.id] ?? "awaiting"}
              />
            ))}
        </fieldset>
      ))}
    </AdminForm>
  );
}

/** Uncontrolled pill-style radio group; the selected option is filled and shows a dot. */
function AnswerChoice({ name, legend, current }: { name: string; legend: string; current: string }) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm uppercase tracking-[0.15em] text-ink-muted">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {CHOICES.map((choice) => (
          <label key={choice.value} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={choice.value}
              defaultChecked={current === choice.value}
              className="peer sr-only"
            />
            <span className="flex items-center gap-2 rounded-full border border-sand-edge px-4 py-2 text-sm transition-colors peer-checked:border-sea peer-checked:bg-sea peer-checked:text-shell peer-checked:*:bg-current peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sea">
              <span aria-hidden className="size-2.5 rounded-full border border-current" />
              {choice.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
