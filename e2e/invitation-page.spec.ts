import "./load-env";
import { expect, type Page, test } from "@playwright/test";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { guests, households } from "@/db/schema";
import { newLinkName } from "@/lib/invitation-link";

/**
 * Personal invitation page and its greeting. Creates a fictional household in the development
 * database (.env.local) and deletes it afterwards. Serial, so parallel workers
 * do not create and delete each other's household.
 */
test.describe.configure({ mode: "serial" });

const NAME = "The Playwright Household";
const GUESTS = [
  ["Pat", "Playwright"],
  ["Robin", "Playwright"],
];

const COUPLE = "Pat Playwright and Robin Playwright";

let householdId = "";
let link = "";

test.beforeAll(async () => {
  await db.delete(households).where(eq(households.name, NAME));
  link = newLinkName(NAME);
  [{ id: householdId }] = await db
    .insert(households)
    .values({ name: NAME, linkName: link })
    .returning({ id: households.id });
  await db
    .insert(guests)
    .values(GUESTS.map(([firstName, lastName], i) => ({ householdId, firstName, lastName, sortOrder: i + 1 })));
});

test.afterAll(async () => {
  await db.delete(households).where(eq(households.name, NAME));
});

async function expectNotFound(page: Page, path: string) {
  await page.goto(path);
  await expect(page.getByRole("heading", { name: "We couldn't find this invitation" })).toBeVisible();
  await expect(page.getByText(NAME)).toHaveCount(0);
  await expect(page.getByText("Playwright")).toHaveCount(0);
}

test("addresses a couple by both full names", async ({ page }) => {
  await page.goto(`/invitation/${link}`);
  await expect(page.getByText(`Dear ${COUPLE},`)).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Daniella Etzion");
  await expect(page.getByRole("link", { name: "RSVP", exact: true }).last()).toHaveAttribute("href", "/rsvp");
  await expect(page).toHaveTitle("You're invited | Our Wedding");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("ignores capital letters in the link", async ({ page }) => {
  await page.goto(`/invitation/${link.toUpperCase()}`);
  await expect(page.getByText(`Dear ${COUPLE},`)).toBeVisible();
});

test("addresses three or more guests by the invitation name", async ({ page }) => {
  await db.insert(guests).values({ householdId, firstName: "Sam", lastName: "Playwright", sortOrder: 3 });
  await page.goto(`/invitation/${link}`);
  await expect(page.getByText(`Dear ${NAME},`)).toBeVisible();
  await expect(page.getByText("Sam Playwright")).toHaveCount(0);
});

test("shows the same message for a missing or wrong code", async ({ page }) => {
  await expectNotFound(page, "/invitation/the-playwright-household");
  await expectNotFound(page, `/invitation/${link.slice(0, -1)}${link.endsWith("a") ? "b" : "a"}`);
});

test("a replaced link stops working", async ({ page }) => {
  const replaced = newLinkName(NAME);
  await db.update(households).set({ linkName: replaced }).where(eq(households.id, householdId));
  await expectNotFound(page, `/invitation/${link}`);
  await page.goto(`/invitation/${replaced}`);
  await expect(page.getByText(/^Dear /)).toBeVisible();
});
