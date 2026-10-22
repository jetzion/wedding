import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { guests, households } from "@/db/schema";
import { invitationGreeting } from "@/lib/invitation-greeting";
import { isLinkName, normalizeLinkName } from "@/lib/invitation-link";

/**
 * Who an invitation link is addressed to, for the public invitation page: the
 * greeting from invitationGreeting(), never RSVP answers or contact details.
 * Null when the link is malformed, replaced, or deleted. Not cached, so a
 * replaced link stops working at once.
 */
export async function getInvitationByLinkName(linkName: string): Promise<{ greeting: string } | null> {
  const normalized = normalizeLinkName(linkName);
  if (!isLinkName(normalized)) return null;
  const [household] = await db
    .select({ id: households.id, name: households.name })
    .from(households)
    .where(eq(households.linkName, normalized));
  if (!household) return null;
  const people = await db
    .select({ firstName: guests.firstName, lastName: guests.lastName, isPlusOne: guests.isPlusOne })
    .from(guests)
    .where(eq(guests.householdId, household.id))
    .orderBy(asc(guests.sortOrder));
  return { greeting: invitationGreeting(household.name, people) };
}
