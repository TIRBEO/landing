import { LandingPage } from "@/components/landing-page"
import { getTurnstileConfig, toClientConfig } from "@/lib/turnstile"

/**
 * Server component wrapper: resolves the Turnstile site key at REQUEST time.
 *
 * Passing it down as a prop (instead of letting the client component read
 * `process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY`) is what guarantees the widget
 * and the server-side check always agree — a build-inlined key could vanish
 * from the bundle while the server still demanded a token, 403-ing every
 * signup.
 *
 * `force-dynamic` is required, not cosmetic: with static prerendering this
 * page would read the env during `next build` and bake the value into HTML,
 * reintroducing the "key added after the first deploy → no captcha" failure.
 * A landing page is not cache-sensitive, so per-request rendering is free.
 */
export const dynamic = "force-dynamic"

export default function HomePage() {
  return <LandingPage turnstile={toClientConfig(getTurnstileConfig())} />
}
