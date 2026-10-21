import { defineConfig, devices } from "@playwright/test";

/** Set E2E_PORT to reuse a dev server that is already running (Next allows one per project). */
const PORT = Number(process.env.E2E_PORT ?? 3100);

/** End-to-end tests against the dev server and the development database in .env.local. */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: `http://localhost:${PORT}`, trace: "on-first-retry" },
  projects: [{ name: "mobile", use: { ...devices["Pixel 7"] } }],
  webServer: {
    command: `npm run dev -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
