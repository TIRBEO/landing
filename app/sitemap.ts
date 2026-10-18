import type { MetadataRoute } from "next"

/**
 * Every indexable page, in nav order.
 *
 * Kept by hand rather than crawled: `/thank-you` and `/waitlist/details` must
 * never appear here (the first is a one-shot confirmation, the second is an
 * admin screen), and a route added without a line below is a route no search
 * engine will find.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://tirbeo.com",
      lastModified: new Date("2026-09-25"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://tirbeo.com/teams",
      lastModified: new Date("2026-09-26"),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: "https://tirbeo.com/contact",
      lastModified: new Date("2026-10-19"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: "https://tirbeo.com/privacy",
      lastModified: new Date("2026-10-05"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://tirbeo.com/terms",
      lastModified: new Date("2026-10-19"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://tirbeo.com/accessibility",
      lastModified: new Date("2026-10-05"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]
}
