import type { MetadataRoute } from "next"

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
  ]
}
