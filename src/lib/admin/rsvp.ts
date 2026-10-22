import "server-only";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { guests, rsvpResponses } from "@/db/schema";
import type { RsvpCorrection } from "@/lib/admin/rsvp-correction";
import { auditEntry } from "@/lib/admin/audit";
import { correctionSummary } from "@/lib/admin/audit-summary";
import { requireAdmin } from "@/lib/admin/session";
import { loadInvitation } from "@/lib/rsvp/invitation";

/** One household's invitation with its RSVP answers, or null. Admins only. */
export async function loadHouseholdRsvp(householdId: string) {
  await requireAdmin();
  if (!z.uuid().safeParse(householdId).success) return null;
  return loadInvitation(householdId);
}

/**
 * Save an admin's RSVP correction atomically: set or clear each answer and
 * update plus-one names. Ignores the RSVP deadline and leaves the household's
 * confirmation code and response date alone, and records the correction in
 * the audit log. Admins only.
 */
export async function saveRsvpCorrection(
  household: { id: string; name: string },
  { answers, plusOneNames }: RsvpCorrection,
) {
  const { user } = await requireAdmin();
  const set = answers.flatMap((a) => (a.status ? [{ guestId: a.guestId, eventId: a.eventId, status: a.status }] : []));
  const queries = [
    ...(set.length
      ? [
          db
            .insert(rsvpResponses)
            .values(set)
            .onConflictDoUpdate({
              target: [rsvpResponses.guestId, rsvpResponses.eventId],
              set: { status: sql`excluded.status`, updatedAt: new Date() },
            }),
        ]
      : []),
    ...answers
      .filter((a) => !a.status)
      .map((a) =>
        db
          .delete(rsvpResponses)
          .where(and(eq(rsvpResponses.guestId, a.guestId), eq(rsvpResponses.eventId, a.eventId))),
      ),
    ...plusOneNames.map((p) =>
      db
        .update(guests)
        .set({ firstName: p.firstName, lastName: p.lastName })
        .where(and(eq(guests.id, p.guestId), eq(guests.isPlusOne, true))),
    ),
  ];
  const summary = correctionSummary(
    household.name,
    answers.map((a) => a.status),
  );
  const audit = auditEntry(user.email, "rsvp.correct", household.id, summary);
  await db.batch([audit, ...queries]);
}
