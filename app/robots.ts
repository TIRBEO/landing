import type { MetadataRoute } from "next"

/**
 * Crawl the public site; keep off the admin screen, the API, and the one-shot
 * signup confirmation (which is also `noindex` in its own metadata).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/thank-you", "/waitlist"],
      },
    ],
    sitemap: "https://tirbeo.com/sitemap.xml",
  }
}
