/**
 * Create a test household invited to every event, and print its code.
 * Development only: uses DATABASE_URL from .env.local.
 * Usage: npm run invite:test
 */
import { loadEnvConfig } from "@next/env";

async function main() {
  loadEnvConfig(process.cwd());
  const { db } = await import("@/db");
  const { events, guestEvents, guests, households } = await import("@/db/schema");
  const { generateInvitationCode, hashCode } = await import("@/lib/rsvp/code");

  const code = generateInvitationCode();
  const [household] = await db
    .insert(households)
    .values({ name: "The Rivera Household", codeHash: hashCode(code) })
    .returning();

  const guestRows = await db
    .insert(guests)
    .values([
      { householdId: household.id, firstName: "Alex", lastName: "Rivera", sortOrder: 1 },
      { householdId: household.id, firstName: "Sam", lastName: "Rivera", sortOrder: 2 },
      { householdId: household.id, isPlusOne: true, sortOrder: 3 },
    ])
    .returning();

  const eventRows = await db.select().from(events);
  await db
    .insert(guestEvents)
    .values(guestRows.flatMap((g) => eventRows.map((e) => ({ guestId: g.id, eventId: e.id }))));

  console.log(`Created "${household.name}" with ${guestRows.length} guests and ${eventRows.length} events.`);
  console.log(`Invitation code: ${code}`);
  console.log(`Link: http://localhost:3000/rsvp?code=${code}`);
}

main();
