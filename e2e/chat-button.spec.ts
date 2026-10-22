import { expect, test } from "@playwright/test";

const chatButton = (page: import("@playwright/test").Page) => page.getByRole("button", { name: "Chat with us" });

test("the chat button is on guest pages", async ({ page }) => {
  for (const path of ["/", "/rsvp", "/invitation/not-a-real-link-abcdef"]) {
    await page.goto(path);
    await expect(chatButton(page)).toBeVisible();
  }
});

test("the chat button is not on admin pages", async ({ page }) => {
  for (const path of ["/admin/sign-in", "/admin"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: "Admin sign-in" })).toBeVisible();
    await expect(chatButton(page)).toHaveCount(0);
  }
});

test("the chat button comes back after leaving the admin area", async ({ page }) => {
  await page.goto("/admin/sign-in");
  await expect(chatButton(page)).toHaveCount(0);
  await page.getByRole("banner").getByRole("link", { name: "Daniella Etzion & Greg Garfinkel" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(chatButton(page)).toBeVisible();
});
