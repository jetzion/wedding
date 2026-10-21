import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { events, guestEvents, guests, households, rsvpResponses } from "@/db/schema";
import { requireAdmin } from "@/lib/admin/session";
import { type GuestStatus, guestStatus } from "@/lib/admin/status";
import type { InvitationInput } from "@/lib/admin/invitation-input";
import type { RsvpStatus } from "@/lib/rsvp/types";

export type AdminGuest = {
  id: string;
  name: string;
  isPlusOne: boolean;
  status: GuestStatus;
  dietaryRestrictions: string | null;
  accessibilityNeeds: string | null;
};

export type AdminInvitation = {
  id: string;
  name: string;
  contactEmail: string | null;
  message: string | null;
  confirmationCode: string | null;
  respondedAt: Date | null;
  guests: AdminGuest[];
};

function guestName(g: { firstName: string | null; lastName: string | null; isPlusOne: boolean }) {
  const name = [g.firstName, g.lastName].filter(Boolean).join(" ");
  return name || (g.isPlusOne ? "Plus-one (not named yet)" : "Unnamed guest");
}

/** Every invitation with its guests and their RSVP status. Admins only. */
export async function listInvitations(): Promise<AdminInvitation[]> {
  await requireAdmin();

  const [householdRows, guestRows, links, responseRows, eventRows] = await Promise.all([
    db.select().from(households).orderBy(asc(households.name)),
    db.select().from(guests).orderBy(asc(guests.sortOrder)),
    db.select().from(guestEvents),
    db.select().from(rsvpResponses),
    db.select({ id: events.id }).from(events),
  ]);
  const eventIds = new Set(eventRows.map((e) => e.id));

  return householdRows.map((h) => ({
    id: h.id,
    name: h.name,
    contactEmail: h.contactEmail,
    message: h.message,
    confirmationCode: h.confirmationCode,
    respondedAt: h.respondedAt,
    guests: guestRows
      .filter((g) => g.householdId === h.id)
      .map((g) => {
        const invited = links.filter((l) => l.guestId === g.id && eventIds.has(l.eventId)).map((l) => l.eventId);
        const responses: Record<string, RsvpStatus> = {};
        for (const r of responseRows) if (r.guestId === g.id) responses[r.eventId] = r.status;
        return {
          id: g.id,
          name: guestName(g),
          isPlusOne: g.isPlusOne,
          status: guestStatus(invited, responses),
          dietaryRestrictions: g.dietaryRestrictions,
          accessibilityNeeds: g.accessibilityNeeds,
        };
      }),
  }));
}

/** Create a household and its guests, each invited to every event. Admins only. */
export async function createInvitation(input: InvitationInput) {
  await requireAdmin();

  const eventRows = await db.select({ id: events.id }).from(events);
  const householdId = crypto.randomUUID();
  const people = [
    ...input.guests.map((g) => ({ ...g, isPlusOne: false })),
    ...(input.plusOne ? [{ firstName: null, lastName: null, isPlusOne: true }] : []),
  ];
  const guestRows = people.map((p, i) => ({ id: crypto.randomUUID(), householdId, sortOrder: i + 1, ...p }));

  await db.batch([
    db.insert(households).values({ id: householdId, name: input.name, contactEmail: input.contactEmail || null }),
    db.insert(guests).values(guestRows),
    db.insert(guestEvents).values(guestRows.flatMap((g) => eventRows.map((e) => ({ guestId: g.id, eventId: e.id })))),
  ]);
}

/** One invitation by id, or undefined. Admins only. */
export async function getInvitation(id: string) {
  return (await listInvitations()).find((i) => i.id === id);
}

/** Delete a household. Its guests, event links, and RSVP answers are removed by cascade. Admins only. */
export async function deleteInvitation(id: string) {
  await requireAdmin();
  await db.delete(households).where(eq(households.id, id));
}
