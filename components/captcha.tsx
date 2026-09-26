"use client"

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"
import { forwardRef } from "react"

/**
 * Reusable Cloudflare Turnstile widget. Renders nothing when
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY isn't set, or when
 * NEXT_PUBLIC_DISABLE_TURNSTILE=1 (tests / local dev),
 * so forms stay usable without a site key.
 */
type Props = {
  onToken: (token: string | null) => void
  className?: string
}

export const Captcha = forwardRef<TurnstileInstance, Props>(function Captcha(
  { onToken, className },
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
        onError={() => onToken(null)}
        options={{ theme: "dark", size: "flexible" }}
      />
    </div>
  )
})
