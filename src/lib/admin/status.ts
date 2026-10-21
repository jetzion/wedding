import type { RsvpStatus } from "@/lib/rsvp/types";

export type GuestStatus = RsvpStatus | "awaiting";

/**
 * One guest's overall answer: attending if they accepted any invited event,
 * declined only if they declined every invited event, otherwise awaiting.
 */
export function guestStatus(eventIds: string[], responses: Record<string, RsvpStatus>): GuestStatus {
  const answers = eventIds.map((id) => responses[id]);
  if (answers.includes("attending")) return "attending";
  if (answers.length > 0 && answers.every((a) => a === "declined")) return "declined";
  return "awaiting";
}

/** Counts of invitations and guests by status. */
export function summarize(invitations: { guests: { status: GuestStatus }[] }[]) {
  const guests = invitations.flatMap((i) => i.guests);
  const count = (status: GuestStatus) => guests.filter((g) => g.status === status).length;
  return {
    invitations: invitations.length,
    guests: guests.length,
    attending: count("attending"),
    declined: count("declined"),
    awaiting: count("awaiting"),
  };
}
