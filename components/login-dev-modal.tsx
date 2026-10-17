"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { X } from "lucide-react"

/**
 * "Still in development" dialog shown when a visitor clicks Log in.
 *
 * It deliberately does NOT carry its own signup form. That duplicate form
 * posted to /api/waitlist without a Turnstile token, so once the captcha
 * was enforced it could only ever fail — a dead end behind a dialog.
 * Instead it points at the one form that does carry the challenge (#join).
 */
export function LoginDevModal({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  // Close on Escape, lock scroll, and move focus into the dialog so the
  // keyboard isn't stranded behind the backdrop.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-dev-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative w-full max-w-sm rounded-xl border border-border bg-card p-6">
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 rounded-md p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="size-4" />
        </button>

        <h2 id="login-dev-title" className="text-lg font-semibold">
          Not available yet
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Accounts are still being built. Leave your email on the mailing list and we&apos;ll
          write the day it goes live.
        </p>

        <Link
          href="/#join"
          onClick={onClose}
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-white/90"
        >
          Join the mailing list
        </Link>

        <button
          onClick={onClose}
          className="mt-3 h-11 w-full rounded-lg text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}