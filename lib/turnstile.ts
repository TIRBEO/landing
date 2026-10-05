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
 * Outcome of a verification attempt, distinguishing "the visitor failed the
 * challenge" from "there was no challenge to run".
 */
export type VerifyOutcome = {
  ok: boolean
  /** True when the check was skipped because no token could exist. */
  skipped?: boolean
  reason?: string
}

const skipCounters = new Map<string, number>()

/**
 * Verify a Turnstile token against Cloudflare.
 *
 * Three cases, and the difference matters:
 *
 * 1. No captcha configured, or explicitly disabled → `ok`.
 * 2. Client supplied a token → it MUST verify. A bad token is rejected.
 * 3. No token AND the client reported the widget was unavailable
 *    (`captchaUnavailable`, e.g. the site key isn't allowed for this hostname,
 *    error 110200) → accepted without verification, counted, and logged.
 *
 * Case 3 is what keeps a misconfigured captcha from making the waitlist
 * permanently unusable: when the site key's hostname allowlist doesn't match,
 * *no* visitor can ever produce a token, so a hard requirement would 403 every
 * signup forever. Rate limits, the disposable-domain blocklist and the spam
 * patterns in the route still apply on this path.
 */
export async function verifyTurnstile(
  token: string | undefined,
  ip?: string,
  opts?: { captchaUnavailable?: boolean },
): Promise<boolean> {
  const outcome = await verifyTurnstileDetailed(token, ip, opts)
  return outcome.ok
}

/** `verifyTurnstile` with the skip reason attached, for logging/telemetry. */
export async function verifyTurnstileDetailed(
  token: string | undefined,
  ip?: string,
  opts?: { captchaUnavailable?: boolean },
): Promise<VerifyOutcome> {
  const cfg = readConfig()
  if (!cfg.required) {
    warnMisconfigured(cfg)
    return { ok: true, skipped: true, reason: cfg.misconfigured ?? "not configured" }
  }

  if (!token) {
    // Case 3: the widget told us it could not run.
    if (opts?.captchaUnavailable) {
      const key = `unavailable:${cfg.siteKey}`
      skipCounters.set(key, (skipCounters.get(key) ?? 0) + 1)
      console.warn(
        `[turnstile] accepted without a challenge (${skipCounters.get(key)} total) — ` +
          "the widget could not run. If this keeps happening the site key's allowed " +
          "hostnames probably do not include this domain.",
      )
      return { ok: true, skipped: true, reason: "client reported captcha unavailable" }
    }
    // No token and no explanation: a bot stripped the widget entirely.
    return { ok: false, reason: "missing token" }
  }

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
      return { ok: false, reason: data["error-codes"]?.join(", ") || "rejected" }
    }
    return { ok: true }
  } catch (err) {
    console.error("[turnstile] verification failed", err)
    return { ok: false, reason: "verification error" }
  }
}
