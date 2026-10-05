"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, X } from "lucide-react"

/**
 * "Still in development" dialog shown when a visitor clicks Login.
 *
 * It deliberately does NOT carry its own signup form. That duplicate form
 * posted to /api/waitlist without a Turnstile token, so once the captcha
 * was actually enforced it could only ever fail — a dead end behind a
 * dialog. Instead it points the visitor at the one form on the page that
 * does carry the challenge (#join).
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
      className="fixed inset-0 z-[100] flex items-center justify-center px-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Card */}
      <div className="grain relative w-full max-w-md border border-white/20 bg-[#080808]/95 px-7 py-9 sm:px-9">
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3.5 right-3.5 p-2 text-white/55 transition-colors hover:bg-white hover:text-black"
        >
          <X className="size-4" />
        </button>

        <p className="eyebrow rule-b pb-4 text-white/55">Not yet</p>

        <h2
          id="login-dev-title"
          className="mt-6 text-[26px] leading-tight font-bold tracking-[-0.03em] text-white sm:text-[30px]"
        >
          The doors aren&apos;t open.
        </h2>

        <p className="mt-4 text-[14px] leading-relaxed text-white/60">
          Accounts are still being built. Leave your address on the mailing list and
          we&apos;ll write the day it goes live.
        </p>

        <Link
          href="/#join"
          onClick={onClose}
          className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 border border-white bg-white px-6 text-[14px] font-bold tracking-[0.14em] whitespace-nowrap text-black uppercase transition-colors duration-200 hover:bg-transparent hover:text-white"
        >
          Join the list
          <ArrowRight className="size-4" />
        </Link>

        <button
          onClick={onClose}
          className="mt-4 w-full text-center text-[12.5px] text-white/55 transition-colors hover:text-white/70"
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}