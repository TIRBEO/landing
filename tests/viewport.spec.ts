import { expect, test } from "@playwright/test"

const viewports = [
  { name: "mobile-320", width: 320, height: 667 },
  { name: "mobile-360", width: 360, height: 800 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1440", width: 1440, height: 900 },
]

const paths = ["/", "/teams", "/contact", "/privacy", "/accessibility", "/waitlist/details"]

/**
 * Measuring `scrollWidth - clientWidth` on the root answers "is the page
 * clamped?", not "does the content fit?" — while `body { overflow-x: hidden }`
 * was in the stylesheet every one of these runs came back green with content
 * sitting out of reach behind the clip. So measure the elements themselves:
 * anything whose right edge passes the viewport, unless an ancestor clips it
 * away on purpose (a decorative gradient, a horizontal scroller).
 */
function audit(): { offenders: string[]; scroll: number } {
  const clientWidth = document.documentElement.clientWidth;
  const offenders: string[] = [];
  for (const el of Array.from(document.querySelectorAll("*"))) {
    const box = el.getBoundingClientRect();
    if (box.width === 0 || box.height === 0 || box.right <= clientWidth + 1) continue;
    let node: HTMLElement | null = el as HTMLElement;
    let clipped = false;
    while (node) {
      const ox = getComputedStyle(node).overflowX;
      if (ox === "hidden" || ox === "clip" || ox === "auto" || ox === "scroll") {
        clipped = true;
        break;
      }
      node = node.parentElement;
    }
    if (clipped) continue;
    const cls = typeof el.className === "string" && el.className.trim() ? `.${el.className.trim().split(/\s+/).slice(0, 3).join(".")}` : "";
    offenders.push(`${el.tagName.toLowerCase()}${cls} right=${Math.round(box.right)}`);
    if (offenders.length > 12) break;
  }
  return { offenders, scroll: document.documentElement.scrollWidth - clientWidth };
}

for (const vp of viewports) {
  test(`no element overflows the viewport on ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    for (const path of paths) {
      await page.goto(path);
      const { offenders, scroll } = await page.evaluate(audit);
      expect(offenders, `${path} at ${vp.width}px: ${offenders.join(", ")}`).toEqual([]);
      expect(scroll, `${path} at ${vp.width}px scrolls ${scroll}px wide`).toBeLessThanOrEqual(1);
    }
  });
}
