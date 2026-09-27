"use client"

import { useEffect, useRef } from "react"

import { Header } from "@/components/header"

const members = [
  {
    name: "Bishnu Neupane",
    role: "Founder & CEO",
    email: "bishnuneupane@tirbeo.app",
    image: "/images/team/bishnu.jpg",
  },
  {
    name: "Nirajan Aryal",
    role: "Co-founder",
    email: "nirajanaryal@tirbeo.app",
    image: "/images/team/nirajan.jpg",
  },
  {
    name: "Prabin Pandey",
    role: "Advisor & Manager",
    email: "prabinpandey@tirbeo.app",
    image: "/images/team/prabin.jpg",
  },
] as const

export function TeamList() {
  const photoRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const photo = photoRef.current
    const img = imgRef.current
    if (!photo || !img) return

    // ── Preload every team photo so the FIRST hover is instant ──
    const preloaded = members.map((m) => {
      const i = new Image()
      i.src = m.image
      return i
    })

    let destroyed = false
    let raf = 0
    let removeListeners: (() => void) | undefined

    const init = () => {
      if (destroyed) return

      if (reduced) {
        // No motion: simply show the right image near the cursor with no animation
        const onMoveStatic = (e: MouseEvent) => {
          photo.style.transform = `translate(${e.clientX + 24}px, ${e.clientY - 120}px)`
        }
        const rowsStatic = document.querySelectorAll<HTMLElement>("[data-member]")
        const cleanupsStatic: Array<() => void> = []
        rowsStatic.forEach((row) => {
          const enter = () => {
            const src = row.dataset.memberImage
            if (src && img.getAttribute("src") !== src) img.src = src
            photo.style.opacity = "1"
          }
          const leave = () => {
            photo.style.opacity = "0"
          }
          row.addEventListener("mouseenter", enter)
          row.addEventListener("mouseleave", leave)
          window.addEventListener("mousemove", onMoveStatic, { passive: true })
          cleanupsStatic.push(() => {
            row.removeEventListener("mouseenter", enter)
            row.removeEventListener("mouseleave", leave)
          })
        })
        removeListeners = () => {
          window.removeEventListener("mousemove", onMoveStatic)
          cleanupsStatic.forEach((fn) => fn())
        }
        return
      }

      // ── Smooth cursor follow via a single rAF lerp loop (no GSAP tween
      //    fighting, no overwrite glitches) ──
      let tx = 0
      let ty = 0 // target position
      let x = 0
      let y = 0 // current position
      let visible = false
      let opacity = 0
      let scale = 0.85

      const onMove = (e: MouseEvent) => {
        tx = e.clientX + 24
        ty = e.clientY - 140
      }
      window.addEventListener("mousemove", onMove, { passive: true })

      const tick = () => {
        if (destroyed) return
        // ease toward the target — imperceptible lag, no jitter
        x += (tx - x) * 0.16
        y += (ty - y) * 0.16
        const targetOpacity = visible ? 1 : 0
        const targetScale = visible ? 1 : 0.85
        opacity += (targetOpacity - opacity) * (visible ? 0.18 : 0.24)
        scale += (targetScale - scale) * 0.16
        photo.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        photo.style.opacity = opacity < 0.01 ? "0" : String(opacity)
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)

      const rows = document.querySelectorAll<HTMLElement>("[data-member]")
      const cleanups: Array<() => void> = []
      rows.forEach((row) => {
        const enter = () => {
          const src = row.dataset.memberImage
          if (src) {
            // preloaded images decode instantly — no stale image flash
            if (img.getAttribute("src") !== src) img.src = src
            img
              .decode?.()
              .catch(() => {})
              .then(() => {
                if (!destroyed) visible = true
              })
            return
          }
          visible = true
        }
        const leave = () => {
          visible = false
        }
        row.addEventListener("mouseenter", enter)
        row.addEventListener("mouseleave", leave)
        cleanups.push(() => {
          row.removeEventListener("mouseenter", enter)
          row.removeEventListener("mouseleave", leave)
        })
      })

      removeListeners = () => {
        window.removeEventListener("mousemove", onMove)
        cleanups.forEach((fn) => fn())
      }
    }

    // init immediately — GSAP import is no longer needed
    init()

    return () => {
      destroyed = true
      if (raf) cancelAnimationFrame(raf)
      removeListeners?.()
    }
  }, [])

  return (
    <div className="grain nebula relative isolate flex min-h-dvh flex-col">
      <Header />

      {/* Cursor-following photo tooltip */}
      <div
        ref={photoRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-40 hidden h-60 w-48 overflow-hidden rounded-lg shadow-[0_30px_80px_rgba(0,0,0,0.7)] opacity-0 will-change-transform md:block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          alt=""
          className="size-full object-cover"
          decoding="async"
        />
      </div>

      <main
        id="main-content"
        className="relative flex flex-1 flex-col px-6 pt-32 sm:px-10 lg:px-14 lg:pt-44"
      >
        <div className="mx-auto w-full max-w-4xl">
          {/* ── Header ── */}
          <h1 className="text-[clamp(3.5rem,12vw,8.5rem)] leading-[0.88] font-bold tracking-[-0.04em] text-white">
            The team<span className="text-accent">.</span>
          </h1>

          {/* ── Names + roles ── */}
          <ul className="mt-16">
            {members.map((member) => (
              <li
                key={member.name}
                data-member
                data-member-image={member.image}
                className="group relative border-b border-white/10 first:border-t"
              >
                <a
                  href={`mailto:${member.email}`}
                  className="relative flex items-center justify-between gap-8 py-8"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[clamp(1.7rem,4.5vw,2.6rem)] leading-none font-medium tracking-[-0.02em] text-white/45 transition-all duration-500 ease-out group-hover:tracking-normal group-hover:text-white">
                      {member.name}
                    </span>
                  </span>

                  <span className="shrink-0 text-right text-[13px] font-medium tracking-wide text-white/35 transition-colors duration-500 group-hover:text-white/70">
                    {member.role}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {/* ── Contact ── */}
          <div className="flex flex-col gap-6 py-20 sm:flex-row sm:items-center sm:justify-between">
            <a
              href="mailto:hello@tirbeo.app?subject=Contact"
              className="text-[clamp(1.3rem,3vw,1.9rem)] font-medium tracking-[-0.01em] text-white/60 transition-colors duration-500 hover:text-accent"
            >
              hello@tirbeo.app
            </a>

            <p className="text-[13px] text-white/50">Kathmandu, NP</p>
          </div>
        </div>
      </main>
    </div>
  )
}
