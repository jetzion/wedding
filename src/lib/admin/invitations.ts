import "server-only";
import { and, asc, count, eq } from "drizzle-orm";
import { db } from "@/db";
import { events, guestEvents, guests, households, rsvpResponses } from "@/db/schema";
import { auditEntry } from "@/lib/admin/audit";
import { createdSummary, deletedSummary, updatedSummary } from "@/lib/admin/audit-summary";
import { requireAdmin } from "@/lib/admin/session";
import { type GuestStatus, guestStatus } from "@/lib/admin/status";
import type { InvitationInput } from "@/lib/admin/invitation-input";
import { newLinkName } from "@/lib/invitation-link";
import type { RsvpStatus } from "@/lib/rsvp/types";

export type AdminGuest = {
  id: string;
  name: string;
  firstName: string | null;
  lastName: string | null;
  isPlusOne: boolean;
  status: GuestStatus;
  dietaryRestrictions: string | null;
  accessibilityNeeds: string | null;
};

export type AdminInvitation = {
  id: string;
  name: string;
  linkName: string;
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
    linkName: h.linkName,
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
          firstName: g.firstName,
          lastName: g.lastName,
          isPlusOne: g.isPlusOne,
          status: guestStatus(invited, responses),
          dietaryRestrictions: g.dietaryRestrictions,
          accessibilityNeeds: g.accessibilityNeeds,
        };
      }),
  }));
}

type Person = { firstName: string | null; lastName: string | null; isPlusOne: boolean };

/** Insert queries for new guests, each invited to every event. Empty when there are no people. */
function insertGuests(householdId: string, people: Person[], firstSortOrder: number, eventIds: string[]) {
  if (!people.length) return [];
  const rows = people.map((p, i) => ({
    id: crypto.randomUUID(),
    householdId,
    sortOrder: firstSortOrder + i,
    firstName: p.firstName,
    lastName: p.lastName,
    isPlusOne: p.isPlusOne,
  }));
  const links = rows.flatMap((g) => eventIds.map((eventId) => ({ guestId: g.id, eventId })));
  return [db.insert(guests).values(rows), ...(links.length ? [db.insert(guestEvents).values(links)] : [])];
}

const named = (g: { firstName: string; lastName: string }): Person => ({ ...g, isPlusOne: false });
const PLUS_ONE: Person = { firstName: null, lastName: null, isPlusOne: true };

async function eventIds() {
  return (await db.select({ id: events.id }).from(events)).map((e) => e.id);
}

/** Create a household and its guests, each invited to every event. Admins only. */
export async function createInvitation(input: InvitationInput) {
  const { user } = await requireAdmin();
  const householdId = crypto.randomUUID();
  const people = [...input.guests.map(named), ...(input.plusOne ? [PLUS_ONE] : [])];

  await db.batch([
    db.insert(households).values({
      id: householdId,
      name: input.name,
      linkName: newLinkName(input.name),
      contactEmail: input.contactEmail || null,
    }),
    ...insertGuests(householdId, people, 1, await eventIds()),
    auditEntry(
      user.email,
      "invitation.create",
      householdId,
      createdSummary(input.name, input.guests.length, input.plusOne),
    ),
  ]);
}

const STALE = "This invitation changed since you opened it. Reload the page and try again.";

/**
 * Update a household's name, email, and people. Existing guests keep their id
 * and RSVP answers; removed guests are deleted with their answers. The form
 * must account for every named guest in this household, so a stale or
 * tampered form changes nothing. Returns an error message, or undefined on
 * success. Admins only.
 */
export async function updateInvitation(id: string, input: InvitationInput) {
  const { user } = await requireAdmin();
  const [household] = await db.select({ name: households.name }).from(households).where(eq(households.id, id));
  if (!household) return STALE;
  const existing = await db.select().from(guests).where(eq(guests.householdId, id));
  const namedIds = existing.filter((g) => !g.isPlusOne).map((g) => g.id);
  const plusOne = existing.find((g) => g.isPlusOne);

  const kept = input.guests.filter((g) => g.id);
  const added = input.guests.filter((g) => !g.id);
  const accounted = [...kept.map((g) => g.id!), ...input.removeIds];
  if (accounted.sort().join() !== [...namedIds].sort().join()) return STALE;

  const plusOneSortOrder = input.guests.length + 1;
  const allEvents = await eventIds();
  const inHousehold = (guestId: string) => and(eq(guests.id, guestId), eq(guests.householdId, id));

  await db.batch([
    db
      .update(households)
      .set({ name: input.name, contactEmail: input.contactEmail || null })
      .where(eq(households.id, id)),
    ...kept.map((g, i) =>
      db
        .update(guests)
        .set({ firstName: g.firstName, lastName: g.lastName, sortOrder: i + 1 })
        .where(inHousehold(g.id!)),
    ),
    ...input.removeIds.map((guestId) => db.delete(guests).where(inHousehold(guestId))),
    ...insertGuests(id, added.map(named), kept.length + 1, allEvents),
    ...(input.plusOne && !plusOne ? insertGuests(id, [PLUS_ONE], plusOneSortOrder, allEvents) : []),
    ...(input.plusOne && plusOne
      ? [db.update(guests).set({ sortOrder: plusOneSortOrder }).where(inHousehold(plusOne.id))]
      : []),
    ...(!input.plusOne && plusOne ? [db.delete(guests).where(inHousehold(plusOne.id))] : []),
    auditEntry(
      user.email,
      "invitation.update",
      id,
      updatedSummary({
        oldName: household.name,
        newName: input.name,
        added: added.length,
        removed: input.removeIds.length,
        plusOneBefore: Boolean(plusOne),
        plusOneAfter: input.plusOne,
      }),
    ),
  ]);
}

/** One invitation by id, or undefined. Admins only. */
export async function getInvitation(id: string) {
  return (await listInvitations()).find((i) => i.id === id);
}

/** Give an invitation a new link code, so its old link stops working. Admins only. */
export async function replaceInvitationLink(id: string) {
  const { user } = await requireAdmin();
  const [household] = await db.select({ name: households.name }).from(households).where(eq(households.id, id));
  if (!household) return;
  await db.batch([
    db.update(households).set({ linkName: newLinkName(household.name) }).where(eq(households.id, id)),
    auditEntry(user.email, "invitation.new_link", id, `${household.name}: new link; the old link stopped working`),
  ]);
}

/** Delete a household. Its guests, event links, and RSVP answers are removed by cascade. Admins only. */
export async function deleteInvitation(id: string) {
  const { user } = await requireAdmin();
  const [household] = await db.select({ name: households.name }).from(households).where(eq(households.id, id));
  if (!household) return;
  const [{ people }] = await db.select({ people: count() }).from(guests).where(eq(guests.householdId, id));
  await db.batch([
    db.delete(households).where(eq(households.id, id)),
    auditEntry(user.email, "invitation.delete", id, deletedSummary(household.name, people)),
  ]);
}
