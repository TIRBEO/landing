"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import Link from "next/link"

import { accountsHost, signInUrl } from "@/lib/accounts"

/**
 * The login hand-off dialog.
 *
 * Sign-in is owned by the accounts app (`accounts.tirbeo.com`), so this dialog
 * does one real job: send the visitor there and bring them back to the page
 * they were on.
 *
 * On a phone it is a bottom sheet — the header button is at the top of a
 * thumb's reach and a centred box floats over nothing. On ≥640px it is the
 * same dialog centred, which is where a mouse pointer expects it.
 *
 * The secondary CTA is the mailing-list form on the home page — the signup
 * `<form id="join">` in components/landing-page.tsx is what `/#join` scrolls
 * to, so the two must stay in step.
 */
const CLOSE_MS = 260

export function LoginModal({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [closing, setClosing] = useState(false)

  // Every close path runs through here so the sheet gets to animate out
  // before it is unmounted.
  const close = () => setClosing(true)

  useEffect(() => {
    if (!closing) return
    const timer = setTimeout(onClose, CLOSE_MS)
    return () => clearTimeout(timer)
  }, [closing, onClose])

  // The visitor's exact page is only knowable in the browser, so the
  // `redirect_to` parameter is attached on click rather than stored in state
  // set from an effect — server and client HTML stay byte-identical, and a
  // no-JS or middle-click still lands on the plain sign-in URL.

  // Close on Escape, lock scroll, and move focus into the dialog so the
  // keyboard isn't stranded behind the backdrop.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setClosing(true)
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div className={`sheet-scrim absolute inset-0 bg-scrim${closing ? " is-closing" : ""}`} />

      <div
        className={`sheet-panel relative w-full rounded-t-[20px] border border-border bg-card px-6 pt-3 pb-[max(24px,env(safe-area-inset-bottom))] sm:w-[24rem] sm:rounded-xl sm:px-6 sm:pt-6 sm:pb-6${
          closing ? " is-closing" : ""
        }`}
      >
        {/* iOS grabber — marks the sheet as dismissible without pretending it
            can be dragged. */}
        <div
          aria-hidden="true"
          className="mx-auto mb-3 h-1 w-9 rounded-full bg-border-strong sm:hidden"
        />

        <button
          ref={closeRef}
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 rounded-md p-2 text-muted-foreground transition-colors hover:bg-fill hover:text-foreground"
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
          href={signInUrl()}
          onClick={(e) => {
            e.preventDefault()
            window.location.href = signInUrl(window.location.href)
            close()
          }}
          className="btn btn-primary btn-block mt-6"
        >
          Sign in at {accountsHost()}
        </a>

        <Link
          href="/#join"
          onClick={close}
          className="btn btn-secondary btn-block mt-3"
        >
          Not joined yet — add my email to the list
        </Link>

        <button
          onClick={close}
          className="btn btn-quiet btn-block mt-1"
        >
          Cancel
        </button>
      </div>
    </div>,
    // The header carries a backdrop-filter, and a filter makes its element the
    // containing block for `position: fixed` descendants — a dialog rendered in
    // place is trapped inside the 64px bar. On <body>, "fixed" means the
    // viewport again.
    document.body,
  )
}
