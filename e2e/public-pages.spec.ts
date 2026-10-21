import { expect, test } from "@playwright/test";

const PAGES = ["/", "/story", "/details", "/travel", "/faq", "/game", "/rsvp"];

for (const path of PAGES) {
  test(`${path} loads with the site header`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  });
}
