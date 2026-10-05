"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { LoginDevModal } from "@/components/login-dev-modal"

export function Header() {
  // Login isn't open yet — show the development-phase modal instead.
  const [showDevModal, setShowDevModal] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "rule-b bg-black/80 backdrop-blur-xl" : "rule-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[100rem] items-center justify-between px-5 sm:h-20 sm:px-8 lg:px-12">
        {/* Wordmark — white mark, hollow period that fills on hover */}
        <Link href="/" className="group flex items-baseline" aria-label="Tirbeo home">
          <span className="text-[26px] leading-none font-black tracking-[-0.05em] text-white transition-opacity duration-300 group-hover:opacity-70 sm:text-[30px]">
            Tirbeo
          </span>
          <span
            aria-hidden="true"
            className="ml-0.5 size-[7px] self-center border border-white transition-all duration-300 group-hover:bg-white"
          />
        </Link>

        <nav className="flex items-center gap-5 sm:gap-8" aria-label="Main">
          {/* Underline-grow link */}
          <Link
            href="/teams"
            className="group relative -my-2 flex items-center py-3 text-[11px] leading-none font-semibold tracking-[0.22em] text-white/55 uppercase transition-colors duration-300 hover:text-white"
          >
            Teams
            <span
              aria-hidden="true"
              className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100"
            />
          </Link>

          {/* Login — sharp outlined button that inverts on hover */}
          <button
            onClick={() => setShowDevModal(true)}
            className="eyebrow border border-white/30 px-4 py-2.5 text-white/80 transition-colors duration-200 hover:border-white hover:bg-white hover:text-black"
          >
            Login
          </button>
        </nav>
      </div>

      {showDevModal ? <LoginDevModal onClose={() => setShowDevModal(false)} /> : null}
    </header>
  )
}