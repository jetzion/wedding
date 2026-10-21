import { expect, test } from "@playwright/test";

test("home page countdown shows days, hours, minutes, and seconds and ticks", async ({ page }) => {
  await page.goto("/");
  const timer = page.getByRole("timer", { name: "Countdown to the wedding" });
  for (const label of ["Days", "Hours", "Minutes", "Seconds"]) {
    await expect(timer.getByText(label)).toBeVisible();
  }
  await expect(timer).not.toContainText("--");
  const before = await timer.innerText();
  await expect(timer).not.toHaveText(before, { timeout: 3000 });
});
