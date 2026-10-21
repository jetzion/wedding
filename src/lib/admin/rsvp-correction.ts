import type { InvitationGuest, RsvpStatus } from "@/lib/rsvp/types";

export type Answer = { guestId: string; eventId: string; status: RsvpStatus | null };
export type PlusOneName = { guestId: string; firstName: string | null; lastName: string | null };
export type RsvpCorrection = { answers: Answer[]; plusOneNames: PlusOneName[] };

type Result = { ok: true; data: RsvpCorrection } | { ok: false; error: string };

const STATUSES = { attending: "attending", declined: "declined", awaiting: null } as const;

/** Form field name for one guest's answer to one event. */
export const answerField = (guestId: string, eventId: string) => `status:${guestId}:${eventId}`;

/**
 * Read an admin's RSVP correction for one household. Every invited guest and
 * event must have an answer; "awaiting" clears it. Fields for guests or events
 * outside the household are ignored, because only the household's own pairs
 * are read. An attending plus-one needs a first name, as on the guest form.
 */
export function parseRsvpCorrection(guests: InvitationGuest[], form: FormData): Result {
  const answers: Answer[] = [];
  for (const guest of guests) {
    for (const eventId of guest.eventIds) {
      const value = String(form.get(answerField(guest.id, eventId)) ?? "");
      if (!Object.hasOwn(STATUSES, value)) return { ok: false, error: "Choose an answer for every guest and event." };
      answers.push({ guestId: guest.id, eventId, status: STATUSES[value as keyof typeof STATUSES] });
    }
  }

  const plusOneNames: PlusOneName[] = [];
  for (const guest of guests.filter((g) => g.isPlusOne)) {
    const text = (key: string) => String(form.get(`${key}:${guest.id}`) ?? "").trim().slice(0, 80) || null;
    const name = { guestId: guest.id, firstName: text("firstName"), lastName: text("lastName") };
    const attending = answers.some((a) => a.guestId === guest.id && a.status === "attending");
    if (attending && !name.firstName) return { ok: false, error: "Enter a first name for an attending plus-one." };
    plusOneNames.push(name);
  }

  return { ok: true, data: { answers, plusOneNames } };
}
