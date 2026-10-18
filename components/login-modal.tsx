"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"

import { accountsHost, signInUrl } from "@/lib/accounts"

/**
 * The login hand-off dialog.
 *
 * Sign-in is owned by the accounts app (`accounts.tirbeo.com`), so this dialog
 * does one real job: send the visitor there and bring them back to the page
 * they were on.
 *
 * It replaced a version that offered "Join the mailing list" through
 * `href="/#join"` — an anchor that did not exist on the page, so the click was
 * a no-op. The mailing-list link is still here, but it now points at the form's
 * own `#join` anchor on the home page, and the primary CTA is the real login.
 */
export function LoginModal({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  // Resolved after mount: the visitor's exact page is only knowable in the
  // browser, and reading it during render would desync server and client HTML.
  const [returnTo, setReturnTo] = useState<string | undefined>(undefined)

  useEffect(() => {
    setReturnTo(window.location.href)
  }, [])

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
      aria-labelledby="login-modal-title"
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

        <h2 id="login-modal-title" className="text-lg font-semibold">
          Sign in to Tirbeo
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Sign-in lives on our accounts site, which keeps your password and
          session in one place. You&apos;ll come straight back here after signing
          in.
        </p>

        <a
          href={signInUrl(returnTo)}
          onClick={onClose}
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-white/90"
        >
          Sign in at {accountsHost()}
        </a>

        <a
          href="/#join"
          onClick={onClose}
          className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:border-white/30 hover:bg-white/5"
        >
          Not joined yet — add my email to the list
        </a>

        <button
          onClick={onClose}
          className="mt-1 h-11 w-full rounded-lg text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
