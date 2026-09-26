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

    let destroyed = false
    let removeListeners: (() => void) | undefined

    import("gsap").then(({ gsap }) => {
      if (destroyed) return

      if (reduced) return

      gsap.set(photo, { xPercent: -50, yPercent: -60, autoAlpha: 0, scale: 0.85 })

      const xTo = gsap.quickTo(photo, "x", { duration: 0.5, ease: "power3.out" })
      const yTo = gsap.quickTo(photo, "y", { duration: 0.5, ease: "power3.out" })

      const onMove = (e: MouseEvent) => {
        xTo(e.clientX)
        yTo(e.clientY)
      }

      const show = (src: string | null) => {
        if (src && img.getAttribute("src") !== src) {
          img.src = src
          gsap.fromTo(img, { scale: 1.2 }, { scale: 1, duration: 0.5, ease: "power2.out" })
        }
        gsap.to(photo, { autoAlpha: 1, scale: 1, duration: 0.35, overwrite: "auto" })
      }

      const hide = () => {
        gsap.to(photo, { autoAlpha: 0, scale: 0.85, duration: 0.3, overwrite: "auto" })
      }

      const rows = document.querySelectorAll<HTMLElement>("[data-member]")
      const listeners: Array<() => void> = []

      rows.forEach((row) => {
        const enter = () => show(row.dataset.memberImage ?? null)
        const leave = () => hide()
        row.addEventListener("mouseenter", enter)
        row.addEventListener("mouseleave", leave)
        listeners.push(() => {
          row.removeEventListener("mouseenter", enter)
          row.removeEventListener("mouseleave", leave)
        })
      })

      window.addEventListener("mousemove", onMove)

      removeListeners = () => {
        window.removeEventListener("mousemove", onMove)
        listeners.forEach((fn) => fn())
      }
    })

    return () => {
      destroyed = true
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
        className="pointer-events-none fixed top-0 left-0 z-40 hidden h-60 w-48 overflow-hidden rounded-lg shadow-[0_30px_80px_rgba(0,0,0,0.7)] md:block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imgRef} alt="" className="size-full object-cover" />
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
