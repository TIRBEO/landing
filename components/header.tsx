"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { LoginDevModal } from "@/components/login-dev-modal"

export function Header() {
  // Login isn't open yet — show the development-phase modal instead.
  const [showDevModal, setShowDevModal] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        scrolled ? "border-b border-border bg-black/80 backdrop-blur" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight" aria-label="Tirbeo home">
          Tirbeo
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
          <Link
            href="/teams"
            className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
          >
            Teams
          </Link>
          <button
            onClick={() => setShowDevModal(true)}
            className="rounded-lg border border-border px-3.5 py-2 text-sm font-medium transition-colors hover:border-white/30 hover:bg-white/5"
          >
            Log in
          </button>
        </nav>
      </div>

      {showDevModal ? <LoginDevModal onClose={() => setShowDevModal(false)} /> : null}
    </header>
  )
}