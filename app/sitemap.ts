import type { MetadataRoute } from "next"

const SITE = "https://tirbeo.com"

/**
 * Every indexable page, in nav order.
 *
 * Kept by hand rather than crawled: `/thank-you` and `/waitlist/details` must
 * never appear here (the first is a one-shot confirmation, the second is an
 * admin screen), and a route added without a line below is a route no search
 * engine will find. `updated` is the date the page's own copy last changed —
 * it should match the "Updated" line rendered on that page.
 */
const PAGES: { path: string; updated: string; change: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", updated: "2026-10-19", change: "monthly", priority: 1 },
  { path: "/teams", updated: "2026-10-19", change: "monthly", priority: 0.7 },
  { path: "/contact", updated: "2026-10-19", change: "yearly", priority: 0.6 },
  { path: "/privacy", updated: "2026-10-19", change: "yearly", priority: 0.4 },
  { path: "/terms", updated: "2026-10-19", change: "yearly", priority: 0.4 },
  { path: "/accessibility", updated: "2026-10-19", change: "yearly", priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({
    url: `${SITE}${p.path}`,
    lastModified: new Date(`${p.updated}T00:00:00.000Z`),
    changeFrequency: p.change,
    priority: p.priority,
  }))
}
