"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { X } from "lucide-react"

/**
 * "Still in development" dialog shown when a visitor clicks Login.
 * Carries its own mailing-list signup so the visitor never has to
 * leave — posted to the same waitlist endpoint as the homepage form.
 */
export function LoginDevModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle")
  const [message, setMessage] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Close on Escape, lock scroll, and focus the input on open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    inputRef.current?.focus()
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (state === "sending" || state === "done") return
    setState("sending")
    setMessage("")
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = (await res.json()) as { ok?: boolean; duplicate?: boolean; error?: string }
      if (!res.ok) {
        setState("error")
        setMessage(data.error ?? "Something went wrong — please try again.")
        return
      }
      setState("done")
      setMessage(
        data.duplicate
          ? "You're already on the list — we'll be in touch."
          : "You're on the list. We'll write the moment it's live.",
      )
    } catch {
      setState("error")
      setMessage("Couldn't reach the server — check your connection.")
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Login unavailable"
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

      {/* Card */}
      <div className="grain relative w-full max-w-sm rounded-2xl border border-white/12 bg-[#0b0705]/95 px-7 py-9 shadow-[0_30px_100px_rgba(0,0,0,0.65)] sm:px-9">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3.5 right-3.5 rounded-full p-2 text-white/40 transition-colors hover:bg-white/8 hover:text-white"
        >
          <X className="size-4" />
        </button>

        <p className="text-[11px] font-medium tracking-[0.22em] text-accent uppercase">
          Not yet
        </p>

        <h2 className="mt-3 text-[24px] leading-tight font-bold tracking-[-0.02em] text-white">
          The doors aren&apos;t open<span className="text-accent">.</span>
        </h2>

        <p className="mt-2.5 text-[14px] leading-relaxed text-white/55">
          This part is still being built. Leave your email and you&apos;ll
          hear from us the day it is.
        </p>

        {state === "done" ? (
          <p className="mt-6 text-[14px] leading-relaxed text-accent" aria-live="polite">
            {message}
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6">
            <label htmlFor="modal-email" className="sr-only">
              Email address
            </label>
            <input
              ref={inputRef}
              id="modal-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
              className="h-12 w-full rounded-lg border border-white/15 bg-black/40 px-4 text-[15px] text-white transition-colors placeholder:text-white/30 focus:border-accent focus:outline-none"
            />

            <button
              type="submit"
              disabled={state === "sending"}
              className="mt-3 h-12 w-full rounded-lg bg-accent text-[15px] font-semibold text-accent-foreground transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
            >
              {state === "sending" ? "Sending…" : "Notify me"}
            </button>

            {state === "error" ? (
              <p className="mt-2.5 text-[12.5px] text-[#ff5a5f]" aria-live="polite">
                {message}
              </p>
            ) : null}
          </form>
        )}

        <button
          onClick={onClose}
          className="mt-5 w-full text-center text-[12.5px] text-white/35 transition-colors hover:text-white/60"
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
