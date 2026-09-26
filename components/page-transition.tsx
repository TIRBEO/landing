"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { usePathname } from "next/navigation"

/**
 * GSAP page transition — a soft fade+rise on every route change.
 * Short and smooth: old page swaps, new content fades up in ~0.35s.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const contentRef = useRef<HTMLDivElement>(null)
  const firstRun = useRef(true)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let ctx: { revert: () => void } | undefined
    let cancelled = false

    import("gsap").then(({ gsap }) => {
      if (cancelled) return
      ctx = gsap.context(() => {
        const content = contentRef.current
        if (!content) return

        // Skip any animation on the very first load.
        if (firstRun.current) {
          firstRun.current = false
          return
        }

        gsap.fromTo(
          content,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out", overwrite: "auto" },
        )
      })
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [pathname])

  return <div ref={contentRef}>{children}</div>
}
