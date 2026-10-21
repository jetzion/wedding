import { asc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { events, guestEvents, guests, households, rsvpResponses } from "@/db/schema";
import { generateConfirmationCode, normalizeName } from "@/lib/rsvp/code";
import type { Invitation, RsvpStatus } from "@/lib/rsvp/types";
import type { Submission } from "@/lib/rsvp/validate";
import { getWeddingSettings } from "@/lib/settings";

/** A name column normalized the same way as normalizeName. */
const normalized = (column: typeof guests.firstName | typeof guests.lastName) =>
  sql`lower(regexp_replace(trim(${column}), '\\s+', ' ', 'g'))`;

/** Households with an invited guest (not a plus-one) of this first and last name, at most 10. */
export async function findHouseholds(firstName: string, lastName: string) {
  return db
    .selectDistinct({ id: households.id, name: households.name })
    .from(households)
    .innerJoin(guests, eq(guests.householdId, households.id))
    .where(
      sql`not ${guests.isPlusOne}
        and ${normalized(guests.firstName)} = ${normalizeName(firstName)}
        and ${normalized(guests.lastName)} = ${normalizeName(lastName)}`,
    )
    .orderBy(asc(households.name))
    .limit(10);
}

/** Load one household's invitation, or null if it does not exist. */
export async function loadInvitation(householdId: string) {
  const [household] = await db.select().from(households).where(eq(households.id, householdId));
  if (!household) return null;

  const guestRows = await db
    .select()
    .from(guests)
    .where(eq(guests.householdId, household.id))
    .orderBy(asc(guests.sortOrder));
  const guestIds = guestRows.map((g) => g.id);

  const [links, responseRows, settings] = await Promise.all([
    db.select().from(guestEvents).where(inArray(guestEvents.guestId, guestIds)),
    db.select().from(rsvpResponses).where(inArray(rsvpResponses.guestId, guestIds)),
    getWeddingSettings(),
  ]);
  const eventIds = [...new Set(links.map((l) => l.eventId))];
  const eventRows = eventIds.length
    ? await db.select().from(events).where(inArray(events.id, eventIds)).orderBy(asc(events.sortOrder))
    : [];

  const responses: Invitation["responses"] = {};
  for (const r of responseRows) (responses[r.guestId] ??= {})[r.eventId] = r.status;

  const invitation: Invitation = {
    householdName: household.name,
    guests: guestRows.map((g) => ({
      id: g.id,
      firstName: g.firstName,
      lastName: g.lastName,
      isPlusOne: g.isPlusOne,
      eventIds: links.filter((l) => l.guestId === g.id).map((l) => l.eventId),
      dietaryRestrictions: g.dietaryRestrictions,
      accessibilityNeeds: g.accessibilityNeeds,
    })),
    events: eventRows.map((e) => ({
      id: e.id,
      name: e.name,
      startsAt: e.published ? e.startsAt.toISOString() : null,
    })),
    responses,
    contactEmail: household.contactEmail,
    message: household.message,
    confirmationCode: household.confirmationCode,
    deadlinePassed: Date.now() > new Date(settings.rsvpDeadline).getTime(),
    timezone: settings.timezone,
  };
  return { householdId: household.id, invitation };
}

/** Save a validated submission atomically. Returns the confirmation code. */
export async function saveSubmission(householdId: string, invitation: Invitation, data: Submission) {
  const confirmationCode = invitation.confirmationCode ?? generateConfirmationCode();
  const responseValues = data.guests.flatMap((g) =>
    Object.entries(g.responses).map(([eventId, status]) => ({
      guestId: g.id,
      eventId,
      status: status as RsvpStatus,
    })),
  );

  const guestUpdates = data.guests.map((g) => {
    const isPlusOne = invitation.guests.find((x) => x.id === g.id)!.isPlusOne;
    return db
      .update(guests)
      .set({
        dietaryRestrictions: g.dietaryRestrictions || null,
        accessibilityNeeds: g.accessibilityNeeds || null,
        ...(isPlusOne && { firstName: g.firstName || null, lastName: g.lastName || null }),
      })
      .where(eq(guests.id, g.id));
  });

  await db.batch([
    db
      .insert(rsvpResponses)
      .values(responseValues)
      .onConflictDoUpdate({
        target: [rsvpResponses.guestId, rsvpResponses.eventId],
        set: { status: sql`excluded.status`, updatedAt: new Date() },
      }),
    ...guestUpdates,
    db
      .update(households)
      .set({
        contactEmail: data.contactEmail,
        message: data.message || null,
        confirmationCode,
        respondedAt: new Date(),
      })
      .where(eq(households.id, householdId)),
  ]);

  return confirmationCode;
}
