"use client"

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"
import { forwardRef } from "react"

/**
 * Why a Turnstile widget could not produce a token.
 *
 * `config`  — the site key is not valid for this hostname (e.g. 110200
 *             "unknown domain"). A server-side Cloudflare setting. NO token can
 *             ever be produced here, so blocking the form would make the page
 *             permanently unusable for every visitor.
 * `blocked` — the script or its iframe was blocked (ad-blocker, offline, CSP).
 *             Often transient; `retry: "auto"` may recover it.
 */
export type CaptchaFailure = "config" | "blocked" | null

/** Cloudflare client error code families (see their troubleshooting docs). */
const CONFIG_ERROR_CODES = /^110[0-9]{3}$|^400\d{3}$|^110500$/

function classifyError(err: unknown): CaptchaFailure {
  const raw =
    typeof err === "string"
      ? err
      : typeof err === "number"
        ? String(err)
        : ((err as { errorCode?: string })?.errorCode ?? "")
  const code = raw.match(/\d{6}/)?.[0] ?? raw
  if (!code) return "blocked"
  return CONFIG_ERROR_CODES.test(code) ? "config" : "blocked"
}

/** Visitor-facing copy. `config` must NOT blame the visitor's browser. */
export function captchaMessage(failure: CaptchaFailure): string | null {
  if (failure === "config") {
    return "The security check isn't enabled for this site yet. You can still subscribe below."
  }
  if (failure === "blocked") {
    return "The security check couldn't load. You can still subscribe below — if this keeps happening, disable an ad-blocker for this page."
  }
  return null
}

/**
 * Reusable Cloudflare Turnstile widget.
 *
 * The site key arrives as a PROP from a server component (`getTurnstileConfig`)
 * rather than being read from `process.env` here. Next.js inlines
 * `NEXT_PUBLIC_*` at build time, so reading it in client code meant a key
 * added after the first deploy rendered nothing at all — no widget, no error,
 * and a submit button the server then rejected 100% of the time.
 *
 * Renders nothing when `siteKey` is empty. Never throws, never traps the user:
 * failures are reported through `onFailure` and the parent degrades to
 * accepting the submission (rate limits still apply).
 */
type Props = {
  /** Public site key from the server. Empty string = captcha not enforced. */
  siteKey: string
  onToken: (token: string | null) => void
  /** Fired when the widget cannot produce a token, with the reason. */
  onFailure?: (failure: Exclude<CaptchaFailure, null>) => void
  className?: string
}

export const Captcha = forwardRef<TurnstileInstance, Props>(function Captcha(
  { siteKey, onToken, onFailure, className },
  ref,
) {
  if (!siteKey) return null

  return (
    <div className={className}>
      <Turnstile
        ref={ref}
        siteKey={siteKey}
        onSuccess={(token) => onToken(token)}
        onExpire={() => onToken(null)}
        onError={(err) => {
          onToken(null)
          const failure = classifyError(err)
          if (failure) onFailure?.(failure)
        }}
        options={{
          theme: "dark",
          size: "flexible",
          // Keep retrying instead of leaving a dead grey box when the script is
          // blocked or the network flaps.
          retry: "auto",
          appearance: "always",
        }}
      />
    </div>
  )
})
