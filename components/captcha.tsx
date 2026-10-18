"use client"

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"
import { forwardRef, useEffect, useRef, useState } from "react"

/**
 * Why a Turnstile widget could not produce a token.
 *
 * `config`  — the site key is not valid for this hostname (e.g. 110200
 *             "unknown domain"). A server-side Cloudflare setting. NO token can
 *             ever be produced here, so blocking the form would make the page
 *             permanently unusable for every visitor.
 * `blocked` — the script or its iframe could not load (ad-blocker, offline,
 *             CSP, or Cloudflare itself unreachable from this network).
 * `timeout` — the script never reported anything at all: no token and no
 *             error. A hung network request to challenges.cloudflare.com fires
 *             no callback, so without this timer the visitor would sit forever
 *             in front of a grey box and a disabled button.
 * `challenge` — the widget loaded and ran, but the interactive challenge
 *             itself failed (Cloudflare client-error 3xxxxx family). This is
 *             the ONE case where the visitor can plausibly act (retry, turn an
 *             ad-blocker off for this page), so only this case keeps a visible
 *             hint.
 *
 * Every failure lifts the token requirement: the submission rides the
 * server's tightened no-captcha fallback budget instead of trapping the user.
 */
export type CaptchaFailure = "config" | "blocked" | "timeout" | "challenge" | null

/** Cloudflare client error code families (see their troubleshooting docs). */
const CONFIG_ERROR_CODES = /^110[0-9]{3}$|^400\d{3}$|^110500$/
/** 3xxxxx: challenge execution failed — genuinely interactive. */
const CHALLENGE_ERROR_CODES = /^3\d{5}$/

/** How long to wait for the widget to produce a token before giving up on it. */
const WIDGET_TIMEOUT_MS = 6_000

function classifyError(err: unknown): Exclude<CaptchaFailure, null> {
  const raw =
    typeof err === "string"
      ? err
      : typeof err === "number"
        ? String(err)
        : ((err as { errorCode?: string })?.errorCode ?? "")
  const code = raw.match(/\d{6}/)?.[0] ?? ""
  if (!code) return "blocked"
  if (CONFIG_ERROR_CODES.test(code)) return "config"
  if (CHALLENGE_ERROR_CODES.test(code)) return "challenge"
  return "blocked"
}

/**
 * Visitor-facing copy. A widget that simply could not load shows NOTHING —
 * the form stays fully usable and the server decides, so the old "disable
 * your ad-blocker" dead-end text is reserved for genuine challenge failures
 * and config problems only.
 */
export function captchaMessage(failure: CaptchaFailure): string | null {
  if (failure === "config") {
    return "The security check isn't enabled for this site yet. You can still subscribe below."
  }
  if (failure === "challenge") {
    return "The security check couldn't complete. Try again — if this keeps happening, disable an ad-blocker for this page."
  }
  // blocked / timeout: silent. The submission rides the server's fallback.
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
 * a widget that errors or hangs is HIDDEN and reported through `onFailure`,
 * which lifts the token requirement in the parent — the request then rides
 * the server's stricter no-captcha fallback gate.
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
  // Hidden once the widget proves it cannot deliver: a broken grey box with a
  // warning is worse than no box at all.
  const [hidden, setHidden] = useState(false)
  const gotToken = useRef(false)
  const failureCb = useRef(onFailure)
  failureCb.current = onFailure

  useEffect(() => {
    if (!siteKey || hidden) return
    const timer = setTimeout(() => {
      if (!gotToken.current) {
        setHidden(true)
        failureCb.current?.("timeout")
      }
    }, WIDGET_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [siteKey, hidden])

  if (!siteKey || hidden) return null

  return (
    <div className={className}>
      <Turnstile
        ref={ref}
        siteKey={siteKey}
        onSuccess={(token) => {
          gotToken.current = true
          onToken(token)
        }}
        onExpire={() => {
          gotToken.current = false
          onToken(null)
        }}
        onError={(err) => {
          gotToken.current = false
          onToken(null)
          const failure = classifyError(err)
          if (failure === "config" || failure === "challenge") {
            // Honest, actionable copy — keep the message, drop the dead box.
            setHidden(true)
            onFailure?.(failure)
          } else {
            // Could not load at all: say nothing, let the server gate decide.
            setHidden(true)
            onFailure?.("blocked")
          }
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
