import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3003",
    browserName: "chromium",
  },
  webServer: {
    // Tests run with Turnstile disabled on both client (widget hidden,
    // headless browsers can't pass a real challenge) and server
    // (verification skipped). Admin password comes from the env.
    //
    // MONGODB_URI is deliberately blanked: the specs POST to /api/waitlist, and
    // with the real URI loaded from .env.local they were inserting `test@…`
    // rows straight into the production waitlist on every run.
    command:
      "NEXT_PUBLIC_DISABLE_TURNSTILE=1 TURNSTILE_DISABLED=1 MONGODB_URI= pnpm dev --port 3003",
    url: "http://localhost:3003",
    reuseExistingServer: true,
    timeout: 60_000,
  },
})
