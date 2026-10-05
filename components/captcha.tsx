"use client"

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"
import { forwardRef } from "react"

/**
 * Reusable Cloudflare Turnstile widget.
 *
 * The site key arrives as a PROP from a server component (`getTurnstileConfig`)
 * rather than being read from `process.env` here. Next.js inlines
 * `NEXT_PUBLIC_*` at build time, so reading it in client code meant a key
 * added after the first deploy rendered nothing at all — no widget, no
 * error, and a submit button the server then rejected 100% of the time.
 *
 * Renders nothing when `siteKey` is empty (captcha is not enforced).
 * `onToken(null)` fires on error/expire so the parent knows the widget failed
 * (e.g. domain not whitelisted) instead of silently never producing a token.
 */
type Props = {
  /** Public site key from the server. Empty string = captcha not enforced. */
  siteKey: string
  onToken: (token: string | null) => void
  /** Fired when the widget itself errors — surface it to the visitor. */
  onError?: () => void
  className?: string
}

export const Captcha = forwardRef<TurnstileInstance, Props>(function Captcha(
  { siteKey, onToken, onError, className },
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
        onError={() => {
          onToken(null)
          onError?.()
        }}
        options={{
          theme: "dark",
          size: "flexible",
          // Keep retrying instead of leaving a dead grey box when the script is
          // blocked, the network flaps, or the domain isn't whitelisted yet.
          retry: "auto",
          appearance: "always",
        }}
      />
    </div>
  )
})
