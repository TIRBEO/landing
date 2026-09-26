"use client"

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"
import { forwardRef } from "react"

/**
 * Reusable Cloudflare Turnstile widget. Renders nothing when
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY isn't set, or when
 * NEXT_PUBLIC_DISABLE_TURNSTILE=1 (tests / local dev).
 *
 * Calls onToken(null) on error/expire so the parent knows the widget
 * failed (e.g. domain not whitelisted) instead of silently never
 * producing a token.
 */
type Props = {
  onToken: (token: string | null) => void
  onError?: () => void
  className?: string
}

export const Captcha = forwardRef<TurnstileInstance, Props>(function Captcha(
  { onToken, onError, className },
  ref,
) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const disabled = process.env.NEXT_PUBLIC_DISABLE_TURNSTILE === "1"
  if (!siteKey || disabled) return null

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
        options={{ theme: "dark", size: "flexible" }}
      />
    </div>
  )
})
