import { expect, test } from "@playwright/test";

const SOME_ID = "00000000-0000-4000-8000-000000000000";
const ADMIN_PAGES = [
  "/admin",
  "/admin?q=rivera&status=awaiting",
  "/admin/invitations",
  "/admin/invitations/new",
  "/admin/activity",
  "/admin/password",
  `/admin/invitations/${SOME_ID}/edit`,
  `/admin/invitations/${SOME_ID}/delete`,
  `/admin/invitations/${SOME_ID}/rsvp`,
];

test.describe("signed out", () => {
  for (const path of ADMIN_PAGES) {
    test(`${path} sends you to sign-in without showing guests`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/admin\/sign-in$/);
      await expect(page.getByRole("heading", { name: "Admin sign-in" })).toBeVisible();
      await expect(page.getByText("Rivera")).toHaveCount(0);
    });
  }

  test("CSV export redirects to sign-in with no data", async ({ request }) => {
    const response = await request.get("/admin/export", { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers().location).toBe("/admin/sign-in");
    expect(await response.text()).toBe("");
  });
});
