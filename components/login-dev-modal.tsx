"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Hammer, X } from "lucide-react"

/**
 * "Still in development" modal shown when a visitor clicks Login.
 * Point them to the mailing list instead — themed to the site's
 * dark nebula + gold-accent look.
 */
export function LoginDevModal({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  // Close on Escape and lock scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Login unavailable"
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Card */}
      <div className="nebula grain relative w-full max-w-md rounded-2xl border border-white/15 bg-[#0b0705]/95 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.6)] sm:p-10">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 rounded-full p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="size-4.5" />
        </button>

        <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-accent/40 bg-accent/10">
          <Hammer className="size-6 text-accent" />
        </div>

        <h2 className="mt-5 text-center text-[22px] font-bold tracking-[-0.02em] text-white">
          Still in development phase<span className="text-accent">.</span>
        </h2>

        <p className="mt-3 text-center text-[14px] leading-relaxed text-white/60">
          This dashboard isn&apos;t open yet. Please join the mailing list on
          the homepage and we&apos;ll let you know the moment it&apos;s live.
        </p>

        <Link
          href="/#join"
          onClick={onClose}
          className="mt-7 inline-flex h-13 w-full items-center justify-center rounded-xl bg-accent py-3.5 text-[15px] font-semibold text-accent-foreground transition-all hover:brightness-110 active:scale-[0.99]"
        >
          Join the mailing list
        </Link>

        <button
          onClick={onClose}
          className="mt-3 w-full text-center text-[13px] font-medium text-white/40 transition-colors hover:text-white/70"
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
