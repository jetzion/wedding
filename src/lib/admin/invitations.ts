import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { events, guestEvents, guests, households, rsvpResponses } from "@/db/schema";
import { requireAdmin } from "@/lib/admin/session";
import { type GuestStatus, guestStatus } from "@/lib/admin/status";
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
