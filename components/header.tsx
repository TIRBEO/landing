"use client"

import { useEffect, useState } from "react"
import { useSyncExternalStore } from "react"
import Link from "next/link"

import { LoginDevModal } from "@/components/login-dev-modal"

const subscribe = () => () => {}

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
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/10 bg-[#060403]/75 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="flex h-20 items-center justify-between px-6 sm:h-24 sm:px-10 lg:px-14">
        {/* Wordmark — lowercase serif-contrast mark with gradient period */}
        <Link href="/" className="group flex items-baseline" aria-label="Tirbeo home">
          <span className="text-[30px] font-black leading-none tracking-[-0.045em] text-white transition-colors duration-300 group-hover:text-white/85 sm:text-[34px]">
            Tirbeo
          </span>
          <span className="ig-dot text-[30px] font-black leading-none transition-transform duration-300 group-hover:rotate-90 sm:text-[34px]">
            .
          </span>
        </Link>

        <nav className="flex items-center gap-9 sm:gap-11" aria-label="Main">
          {/* Underline-grow link */}
          <Link
            href="/teams"
            className="group relative text-[13.5px] font-medium tracking-[0.06em] text-white/60 uppercase transition-colors duration-300 hover:text-white"
          >
            Teams
            <span
              aria-hidden="true"
              className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
            />
          </Link>

          {/* Login pill — opens the development-phase modal */}
          <button
            onClick={() => setShowDevModal(true)}
            className="rounded-full border border-white/20 px-5 py-2 text-[13px] font-medium tracking-[0.02em] text-white/85 transition-all duration-300 hover:border-accent hover:bg-accent hover:text-black"
          >
            Login
          </button>
        </nav>
      </div>

      {showDevModal ? <LoginDevModal onClose={() => setShowDevModal(false)} /> : null}
    </header>
  )
}
