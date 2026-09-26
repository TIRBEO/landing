import { expect, test } from "@playwright/test"

// Mobile layout sanity: form full-width, no text clipping, hero readable
test.describe("mobile usability", () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test("landing form fills width and button is tappable", async ({ page }) => {
    await page.goto("/")
    const input = page.getByLabel("Email address")
    const box = await input.boundingBox()
    const viewport = page.viewportSize()
    expect(box?.width).toBeGreaterThan((viewport?.width ?? 375) * 0.7)
    const btn = page.getByRole("button", { name: /subscribe/i })
    const btnBox = await btn.boundingBox()
    expect(btnBox?.height).toBeGreaterThanOrEqual(48) // touch target
  })

  test("hero headline fits viewport", async ({ page }) => {
    await page.goto("/")
    const h1 = page.getByRole("heading", { name: /coming/i })
    const box = await h1.boundingBox()
    expect(box?.width).toBeLessThanOrEqual(375)
  })

  test("teams rows stack cleanly and role stays visible", async ({ page }) => {
    await page.goto("/teams")
    const name = page.getByText("Bishnu Neupane")
    const role = page.getByText("Founder & CEO")
    const nameBox = await name.boundingBox()
    const roleBox = await role.boundingBox()
    // Both on same row, neither clipped off-screen
    expect(nameBox).toBeTruthy()
    expect(roleBox).toBeTruthy()
    expect(roleBox!.x + roleBox!.width).toBeLessThanOrEqual(375)
  })
})
