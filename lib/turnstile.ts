/**
 * Single source of truth for Cloudflare Turnstile configuration.
 *
 * ── Why this module exists ────────────────────────────────────────────────
 * Next.js INLINES every `NEXT_PUBLIC_*` variable at BUILD time. A key that is
 * only ever added to the host after the first deploy therefore reads as an
 * empty string in the running app — the widget renders nothing, the submit
 * button stays enabled (`captchaRequired` is false), and the server still
 * demands a token, so every submission comes back 403. That is the
 * "captcha isn't showing and nothing works" failure mode.
 *
 * Reading the non-public `TURNSTILE_SITE_KEY` FIRST makes the value correct at
 * request time; `NEXT_PUBLIC_TURNSTILE_SITE_KEY` stays as a fallback so
 * deployments that only set the public name keep working.
 *
 * The site key is handed to the browser as a prop from a server component
 * rather than read from `process.env` in client code, so the client and the
 * server can never disagree about whether a challenge is required.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

export type TurnstileConfig = {
  /** Public site key, safe to hand to the browser. Empty when not configured. */
  siteKey: string
  /**
   * Whether the SERVER is enforcing a challenge. When true every protected
   * request must carry a valid token; the client must render the widget.
   */
  required: boolean
  /**
   * Set when captcha is configured halfway — one key present, the other
   * missing. Enforcement is skipped (fail-open) so a broken captcha
   * deployment can never lock every visitor out of the site, but the reason
   * is logged loudly on every request so it is not silently ignored.
   */
  misconfigured: string | null
}

function readConfig(): TurnstileConfig {
  const siteKey =
    process.env.TURNSTILE_SITE_KEY || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""
  const secret = process.env.TURNSTILE_SECRET_KEY || ""
  const disabled =
    process.env.TURNSTILE_DISABLED === "1" || process.env.NEXT_PUBLIC_DISABLE_TURNSTILE === "1"

  if (disabled) return { siteKey, required: false, misconfigured: null }
  // Nothing configured at all — a normal local-dev / test setup.
  if (!secret && !siteKey) return { siteKey: "", required: false, misconfigured: null }
  // Half-configured: skip enforcement rather than 403-locking every visitor.
  if (!secret) {
    return {
      siteKey,
      required: false,
      misconfigured: "TURNSTILE_SECRET_KEY is missing — captcha enforcement is OFF",
    }
  }
  if (!siteKey) {
    return {
      siteKey: "",
      required: false,
      misconfigured:
        "TURNSTILE_SITE_KEY is missing — captcha enforcement is OFF (set it so the widget can render)",
    }
  }
  return { siteKey, required: true, misconfigured: null }
}

/** Server-side, request-time Turnstile configuration. */
export function getTurnstileConfig(): TurnstileConfig {
  return readConfig()
}

/** Public shape passed from server components down to client components. */
export type TurnstileClientConfig = { siteKey: string; required: boolean }

/** Narrow the server config down to what is safe to serialise to the browser. */
export function toClientConfig(cfg: TurnstileConfig): TurnstileClientConfig {
  return { siteKey: cfg.required ? cfg.siteKey : "", required: cfg.required }
}

const loggedMisconfig = new Set<string>()

/** Log a half-configured captcha once per process, not once per request. */
export function warnMisconfigured(cfg: TurnstileConfig): void {
  if (!cfg.misconfigured || loggedMisconfig.has(cfg.misconfigured)) return
  loggedMisconfig.add(cfg.misconfigured)
  console.error(`[turnstile] ${cfg.misconfigured}`)
}

type SiteverifyResponse = {
  success?: boolean
  "error-codes"?: string[]
  hostname?: string
  action?: string
  cdata?: string
}

/**
 * Verify a Turnstile token against Cloudflare.
 *
 * Returns `true` only when Cloudflare confirms the token. A missing secret, an
 * explicit disable flag, or a half-configured deployment skips verification so
 * a misconfigured captcha degrades to "no captcha" instead of locking every
 * visitor out — see `readConfig`.
 */
export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
  const cfg = readConfig()
  if (!cfg.required) {
    warnMisconfigured(cfg)
    return true
  }
  if (!token) return false

  try {
    const body = new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY as string,
      response: token,
      ...(ip && ip !== "unknown" ? { remoteip: ip } : {}),
    })
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      // Never let a slow/hung Cloudflare endpoint stall a signup request.
      signal: AbortSignal.timeout(5_000),
    })
    const data = (await res.json()) as SiteverifyResponse
    if (data.success !== true) {
      console.error(
        `[turnstile] rejected token (${data["error-codes"]?.join(", ") || "no reason given"})`,
      )
      return false
    }
    return true
  } catch (err) {
    console.error("[turnstile] verification failed", err)
    return false
  }
}
