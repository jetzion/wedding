/**
 * Create a test household invited to every event.
 * Development only: uses DATABASE_URL from .env.local.
 * Usage: npm run invite:test -- "Household name" "First Last" "First Last" [--plus-one]
 * Example: npm run invite:test -- "The Rivera Household" "Alex Rivera" "Sam Rivera" --plus-one
 */
import { loadEnvConfig } from "@next/env";

async function main() {
  loadEnvConfig(process.cwd());
  const { db } = await import("@/db");
  const { events, guestEvents, guests, households } = await import("@/db/schema");

  const args = process.argv.slice(2);
  const plusOne = args.includes("--plus-one");
  const [householdName, ...people] = args.filter((a) => a !== "--plus-one");
  if (!householdName || !people.length) throw new Error("Usage: invite:test -- \"Household\" \"First Last\" [--plus-one]");

  const [household] = await db.insert(households).values({ name: householdName }).returning();
  const guestRows = await db
    .insert(guests)
    .values([
      ...people.map((person, i) => {
        const [firstName, ...rest] = person.split(" ");
        return { householdId: household.id, firstName, lastName: rest.join(" "), sortOrder: i + 1 };
      }),
      ...(plusOne ? [{ householdId: household.id, isPlusOne: true, sortOrder: people.length + 1 }] : []),
    ])
    .returning();

  const eventRows = await db.select().from(events);
  await db
    .insert(guestEvents)
    .values(guestRows.flatMap((g) => eventRows.map((e) => ({ guestId: g.id, eventId: e.id }))));

  console.log(`Created "${household.name}" with ${guestRows.length} guests and ${eventRows.length} events.`);
}

main();
