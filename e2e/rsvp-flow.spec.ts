import "./load-env";
import { expect, type Page, test } from "@playwright/test";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { events, guestEvents, guests, households, rsvpResponses } from "@/db/schema";
import { newLinkName } from "@/lib/invitation-link";

/**
 * Guest RSVP flow, from name lookup to a saved answer. Creates a fictional
 * household in the development database (.env.local), invited to every event
 * like `npm run invite:test`, and deletes it afterwards. Serial, because the
 * tests build on each other's saved answers.
 */
test.describe.configure({ mode: "serial" });

const HOUSEHOLD = "The Rsvptest Household";
const EMAIL = "rsvptest@example.com";

let householdId = "";

test.beforeAll(async () => {
  await db.delete(households).where(eq(households.name, HOUSEHOLD));
  [{ id: householdId }] = await db
    .insert(households)
    .values({ name: HOUSEHOLD, linkName: newLinkName(HOUSEHOLD) })
    .returning({ id: households.id });
  const guestRows = await db
    .insert(guests)
    .values([
      { householdId, firstName: "Riley", lastName: "Rsvptest", sortOrder: 1 },
      { householdId, firstName: "Casey", lastName: "Rsvptest", sortOrder: 2 },
      { householdId, isPlusOne: true, sortOrder: 3 },
    ])
    .returning({ id: guests.id });
  const eventRows = await db.select({ id: events.id }).from(events);
  await db
    .insert(guestEvents)
    .values(guestRows.flatMap((g) => eventRows.map((e) => ({ guestId: g.id, eventId: e.id }))));
});

test.afterAll(async () => {
  await db.delete(households).where(eq(households.name, HOUSEHOLD));
});

/** Saved answers by guest first name ("plus-one" for the plus-one), plus the household row. */
async function saved() {
  const guestRows = await db.select().from(guests).where(eq(guests.householdId, householdId));
  const responses = await db
    .select()
    .from(rsvpResponses)
    .where(
      inArray(
        rsvpResponses.guestId,
        guestRows.map((g) => g.id),
      ),
    );
  type SavedGuest = (typeof guestRows)[number] & { statuses: string[] };
  const byGuest: Record<string, SavedGuest> = Object.fromEntries(
    guestRows.map((g) => [
      g.isPlusOne ? "plus-one" : g.firstName,
      { ...g, statuses: responses.filter((r) => r.guestId === g.id).map((r) => r.status) },
    ]),
  );
  const [household] = await db.select().from(households).where(eq(households.id, householdId));
  return { byGuest, household };
}

async function lookUp(page: Page, firstName: string, lastName: string) {
  await page.goto("/rsvp");
  await page.getByLabel("First name").fill(firstName);
  await page.getByLabel("Last name").fill(lastName);
  await page.getByRole("button", { name: "Find my invitation" }).click();
}

const guestCard = (page: Page, name: string) => page.getByRole("region", { name });
/** The plus-one's card is labeled by the name typed into it, so find it by its caption. */
const plusOneCard = (page: Page) => page.getByRole("region").filter({ hasText: "Your plus-one" });
const NOT_FOUND = "We couldn't find an invitation under that name";

test("an unknown name, or a plus-one's name, gets the generic message", async ({ page }) => {
  await lookUp(page, "Nobody", "Rsvptest");
  await expect(page.getByText(NOT_FOUND)).toBeVisible();
  await lookUp(page, "Jamie", "Plusone");
  await expect(page.getByText(NOT_FOUND)).toBeVisible();
});

test("missing answers are caught before review and nothing is saved", async ({ page }) => {
  await lookUp(page, "  riley ", "RSVPTEST");
  await expect(page.getByRole("heading", { name: HOUSEHOLD })).toBeVisible();
  await page.getByRole("button", { name: "Review my RSVP" }).click();
  await expect(page.getByText("Please answer every event for Riley Rsvptest.")).toBeVisible();
  await expect(page.getByText("Please enter a valid email address.")).toBeVisible();

  const { byGuest, household } = await saved();
  expect(Object.values(byGuest).every((g) => g.statuses.length === 0)).toBe(true);
  expect(household.confirmationCode).toBeNull();
});

test("a household RSVPs and the answers are saved", async ({ page }) => {
  await lookUp(page, "Riley", "Rsvptest");
  const riley = guestCard(page, "Riley Rsvptest");
  await riley.getByText("Joyfully attending").click();
  await riley.getByLabel("Dietary restrictions").fill("Vegetarian");
  await guestCard(page, "Casey Rsvptest").getByText("Regretfully declining").click();
  const plusOne = plusOneCard(page);
  await plusOne.getByLabel("First name").fill("Jamie");
  await plusOne.getByLabel("Last name").fill("Plusone");
  await plusOne.getByText("Joyfully attending").click();
  await page.getByLabel("Email for your confirmation").fill(EMAIL);
  await page.getByRole("button", { name: "Review my RSVP" }).click();

  await expect(page.getByRole("heading", { name: "Does this look right?" })).toBeVisible();
  await page.getByRole("button", { name: "Send my RSVP" }).click();
  await expect(page.getByRole("heading", { name: "Your RSVP is in" })).toBeVisible();
  await expect(page.getByText("come back and enter your name again")).toBeVisible();
  const code = (await page.locator("strong").filter({ hasText: /^GD-/ }).textContent())!;
  expect(code).toMatch(/^GD-[A-HJKMNP-Z2-9]{6}$/);

  const { byGuest, household } = await saved();
  expect(byGuest.Riley.statuses).toEqual(["attending"]);
  expect(byGuest.Riley.dietaryRestrictions).toBe("Vegetarian");
  expect(byGuest.Casey.statuses).toEqual(["declined"]);
  expect(byGuest["plus-one"]).toMatchObject({ firstName: "Jamie", lastName: "Plusone", statuses: ["attending"] });
  expect(household).toMatchObject({ confirmationCode: code, contactEmail: EMAIL });
  expect(household.respondedAt).not.toBeNull();
});

test("a guest can come back and change the answers, keeping the code", async ({ page }) => {
  const before = (await saved()).household.confirmationCode;
  await lookUp(page, "Casey", "Rsvptest");
  await expect(page.getByText(`We have your RSVP (${before}).`)).toBeVisible();
  await expect(page.getByLabel("Email for your confirmation")).toHaveValue(EMAIL);
  await guestCard(page, "Casey Rsvptest").getByText("Joyfully attending").click();
  await page.getByRole("button", { name: "Review my RSVP" }).click();
  await page.getByRole("button", { name: "Send my RSVP" }).click();
  await expect(page.getByRole("heading", { name: "Your RSVP is in" })).toBeVisible();

  const { byGuest, household } = await saved();
  expect(byGuest.Casey.statuses).toEqual(["attending"]);
  expect(byGuest.Riley.statuses).toEqual(["attending"]);
  expect(household.confirmationCode).toBe(before);
});
