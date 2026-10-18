import type { Metadata } from "next"

import { getTurnstileConfig, toClientConfig } from "@/lib/turnstile"

import { WaitlistDetails } from "./waitlist-details"

/**
 * Server wrapper so the Turnstile site key is read at REQUEST time rather than
 * being inlined into the client bundle at build time.
 *
 * `force-dynamic` — without it this page is statically prerendered at build
 * time and the key gets baked into the HTML, which is the original bug.
 */
export const dynamic = "force-dynamic"

// robots.txt keeps crawlers out of /waitlist, but that only stops the crawl —
// a URL Google already knows about can still be listed from its URL alone.
export const metadata: Metadata = {
  title: "Waitlist details",
  robots: { index: false, follow: false },
}

export default function WaitlistDetailsPage() {
  return <WaitlistDetails turnstile={toClientConfig(getTurnstileConfig())} />
}
