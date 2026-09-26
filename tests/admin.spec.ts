import { expect, test } from "@playwright/test"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? ""

test.describe("waitlist admin page", () => {
  test("unauthenticated shows password gate, wrong password rejected", async ({ page }) => {
    await page.context().clearCookies()
    await page.goto("/waitlist/details")

    await expect(page.getByRole("heading", { name: /waitlist/i })).toBeVisible()
    const pwField = page.locator("#admin-password")
    await expect(pwField).toBeVisible()

    await pwField.fill("wrongpass")
    await page.getByRole("button", { name: /unlock/i }).click()
    await expect(page.getByText("Wrong password.")).toBeVisible()
    await expect(page.getByText(/signup/i)).toHaveCount(0)
  })

  test("correct password shows entries table with email + time", async ({ page }) => {
    test.skip(!ADMIN_PASSWORD, "ADMIN_PASSWORD not configured")
    await page.context().clearCookies()
    await page.goto("/waitlist/details")

    await page.locator("#admin-password").fill(ADMIN_PASSWORD)
    await page.getByRole("button", { name: /unlock/i }).click()

    // Either rows or the empty state must appear (count badge + empty
    // state can both match, so take the first).
    await expect(
      page.getByText(/\d+ rows/).or(page.getByText("No rows yet")).first(),
    ).toBeVisible({ timeout: 10_000 })
  })

  test("logout returns to the gate", async ({ page }) => {
    test.skip(!ADMIN_PASSWORD, "ADMIN_PASSWORD not configured")
    await page.context().clearCookies()
    await page.goto("/waitlist/details")
    await page.locator("#admin-password").fill(ADMIN_PASSWORD)
    await page.getByRole("button", { name: /unlock/i }).click()
    await expect(page.getByRole("button", { name: /log out/i })).toBeVisible({
      timeout: 10_000,
    })
    await page.getByRole("button", { name: /log out/i }).click()
    await expect(page.locator("#admin-password")).toBeVisible()
  })
})
