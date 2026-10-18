"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { LoginModal } from "@/components/login-modal"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  // Sign-in lives on the accounts app; this dialog is the hand-off (see
  // components/login-modal.tsx).
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl backdrop-saturate-150 transition-colors ${
        scrolled ? "border-divider bg-glass" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight" aria-label="Tirbeo home">
          Tirbeo
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
          <Link
            href="/teams"
            className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-fill hover:text-foreground"
          >
            Teams
          </Link>
          <ThemeToggle />
          <button
            onClick={() => setShowLoginModal(true)}
            className="inline-flex h-9 items-center rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            Log in
          </button>
        </nav>
      </div>

      {showLoginModal ? <LoginModal onClose={() => setShowLoginModal(false)} /> : null}
    </header>
  )
}
