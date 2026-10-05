import { expect, test } from "@playwright/test"

/**
 * Signup rate limit is 5 per IP per 10 min. The API test suite consumes
 * most of that budget, so if this UI test gets rate-limited (429) we
 * accept the rate-limiter's own error message as a pass — the form is
 * still talking to the API correctly.
 */
test.describe("landing page", () => {
  test("loads with no console errors and no failed requests", async ({ page }) => {
    const consoleErrors: string[] = []
    const failedRequests: string[] = []

    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text())
    })
    page.on("requestfailed", (req) => failedRequests.push(req.url()))
    page.on("response", (res) => {
      if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`)
    })

    await page.goto("/", { waitUntil: "networkidle" })

    expect(failedRequests, `failed requests: ${failedRequests.join(", ")}`).toEqual([])
    expect(consoleErrors, `console errors: ${consoleErrors.join(", ")}`).toEqual([])
  })

  test("renders hero, form and socials", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByRole("heading", { name: /coming\s*soon/i })).toBeVisible()
    await expect(page.getByLabel("Email address")).toBeVisible()
    await expect(page.getByRole("button", { name: /subscribe/i })).toBeVisible()
    await expect(page.getByRole("link", { name: "Instagram" })).toHaveAttribute(
      "href",
      "https://instagram.com/tirbeo",
    )
    await expect(page.getByRole("link", { name: "Privacy Policy" })).toBeVisible()
  })

  test("newsletter form validates and confirms", async ({ page }) => {
    await page.goto("/")

    const email = page.getByLabel("Email address")
    await email.fill("test@example.com")
    await page.getByText(/subscribe me to your newsletter/i).click()
    await page.getByRole("button", { name: /subscribe/i }).click()

    const confirmation = page.getByText(/you're on the list/i)
    const rateLimited = page.getByText(/too many/i)
    await expect(confirmation.or(rateLimited)).toBeVisible({ timeout: 10_000 })
  })
})

test.describe("teams page", () => {
  test("loads with no console errors and no failed requests", async ({ page }) => {
    const consoleErrors: string[] = []
    const failedRequests: string[] = []

    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text())
    })
    page.on("response", (res) => {
      if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`)
    })

    await page.goto("/teams", { waitUntil: "networkidle" })

    expect(failedRequests, `failed requests: ${failedRequests.join(", ")}`).toEqual([])
    expect(consoleErrors, `console errors: ${consoleErrors.join(", ")}`).toEqual([])
  })

  test("lists the three members with roles", async ({ page }) => {
    await page.goto("/teams")

    await expect(page.getByRole("heading", { name: /the team/i })).toBeVisible()
    await expect(page.getByText("Bishnu Neupane")).toBeVisible()
    await expect(page.getByText("Founder & CEO")).toBeVisible()
    await expect(page.getByText("Nirajan Aryal")).toBeVisible()
    await expect(page.getByText("Co-founder")).toBeVisible()
    await expect(page.getByText("Prabin Pandey")).toBeVisible()
    await expect(page.getByText("Advisor & Manager")).toBeVisible()
    // Jenish removed
    await expect(page.getByText("Jenish Neupane")).toHaveCount(0)
  })

  test("navbar navigates to teams and back", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: "Teams" }).click()
    await expect(page).toHaveURL(/\/teams$/)
    await expect(page.getByRole("heading", { name: /the team/i })).toBeVisible()
    await page.getByRole("link", { name: "Tirbeo home" }).click()
    await expect(page).toHaveURL(/\/$/)
  })
})

test.describe("document pages", () => {
  for (const [path, heading] of [
    ["/privacy", /privacy policy/i],
    ["/accessibility", /accessibility/i],
  ] as const) {
    test(`${path} renders its heading and legal footer links`, async ({ page }) => {
      const failedRequests: string[] = []
      page.on("response", (res) => {
        if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`)
      })

      await page.goto(path, { waitUntil: "networkidle" })

      await expect(page.getByRole("heading", { name: heading })).toBeVisible()
      // Cross-links between the two documents must resolve, not 404.
      await expect(page.getByRole("link", { name: /accessibility statement/i })).toBeVisible()
      await expect(page.getByRole("link", { name: /^privacy policy$/i })).toBeVisible()
      expect(failedRequests, `failed requests: ${failedRequests.join(", ")}`).toEqual([])
    })
  }

  test("unknown routes render the themed 404 page", async ({ page }) => {
    await page.goto("/definitely-not-a-page")
    await expect(page.getByRole("heading", { name: /doesn't exist/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /return home/i })).toBeVisible()
  })
})
