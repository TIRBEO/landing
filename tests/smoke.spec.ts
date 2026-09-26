import { expect, test } from "@playwright/test"

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

    await expect(page.getByText(/you're on the list/i)).toBeVisible({ timeout: 5_000 })
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
