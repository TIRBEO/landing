"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import type { TurnstileInstance } from "@marsidev/react-turnstile"

import { Captcha, captchaMessage, type CaptchaFailure } from "@/components/captcha"
import { Header } from "@/components/header"
import type { TurnstileClientConfig } from "@/lib/turnstile"

/* ═══════════════════════════════════════════════════════════════════
   Landing — monochrome editorial split.

   Left column carries the statement (eyebrow / colossal headline /
   launch meta), right column carries the signup card. A hairline
   divides them on desktop; everything stacks below 1024px. Emphasis
   comes from inversion — white blocks on black — because the palette
   carries no hue at all.
   ═══════════════════════════════════════════════════════════════════ */

const SOCIALS_1 = [
  { label: "Facebook", href: "https://facebook.com/tirbeo" },
  { label: "X", href: "https://x.com/tirbeo" },
  { label: "TikTok", href: "https://tiktok.com/@tirbeo" },
]
const SOCIALS_2 = [
  { label: "Instagram", href: "https://instagram.com/tirbeo" },
  { label: "YouTube", href: "https://youtube.com/@tirbeo" },
]

export function LandingPage({ turnstile }: { turnstile: TurnstileClientConfig }) {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle")
  const [error, setError] = useState<string | false>(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaFailure, setCaptchaFailure] = useState<CaptchaFailure>(null)
  const captchaRef = useRef<TurnstileInstance>(null)
  // Comes from the server so the widget and the API check can never disagree.
  const captchaRequired = turnstile.required
  const buttonRef = useRef<HTMLButtonElement>(null)
  const successRef = useRef<HTMLParagraphElement>(null)

  /* Success burst: button pops, ring ripples out, message rises in */
  useEffect(() => {
    if (status !== "success" || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return

    let ctx: { revert: () => void } | undefined
    let cancelled = false

    import("gsap").then(({ gsap }) => {
      if (cancelled) return
      ctx = gsap.context(() => {
        const btn = buttonRef.current
        const msg = successRef.current
        if (!btn) return

        gsap
          .timeline()
          .to(btn, { scale: 0.96, duration: 0.09, ease: "power2.in" })
          .to(btn, { scale: 1.03, duration: 0.22, ease: "power2.out" })
          .to(btn, { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.5)" })

        // Ripple ring — React renders it when status flips to success.
        const ring = btn.querySelector("[data-ring]")
        if (ring) {
          gsap.to(ring, { scale: 1.4, opacity: 0, duration: 0.9, ease: "power2.out" })
        }

        if (msg) {
          gsap.fromTo(
            msg,
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.25 },
          )
        }
      })
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [status])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || status !== "idle") return
    setStatus("submitting")

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          turnstileToken: captchaToken,
          // Tells the server the widget errored, so it can tell "no challenge
          // was possible" apart from "a token was stripped".
          captchaUnavailable: !captchaToken && !!captchaFailure,
        }),
      })
      if (!res.ok) {
        // Show the server's own message (e.g. "Too many attempts…") when
        // available, falling back to the generic error text otherwise.
        let serverMsg = ""
        try {
          const data = (await res.json()) as { error?: string }
          serverMsg = data.error ?? ""
        } catch {
          /* non-JSON error response */
        }
        setError(serverMsg || "Something went wrong — please try again.")
        setStatus("idle")
        setCaptchaToken(null)
        captchaRef.current?.reset()
        setTimeout(() => setError(false), 10_000)
        return
      }
      setStatus("success")
      setSubscribed(true)
      setEmail("")
      setCaptchaToken(null)
      captchaRef.current?.reset()
      setTimeout(() => setStatus("idle"), 10_000)
    } catch {
      setStatus("idle")
      setError("Something went wrong — please try again.")
      setCaptchaToken(null)
      captchaRef.current?.reset()
      setTimeout(() => setError(false), 10_000)
    }
  }

  return (
    <div className="veil grain relative isolate flex min-h-dvh flex-col">
      {/* Blueprint grid overlay, purely decorative */}
      <div className="grid-lines pointer-events-none absolute inset-0 -z-10" aria-hidden />

      <Header />

      <main
        id="main-content"
        className="mx-auto flex w-full max-w-[100rem] flex-1 flex-col px-5 pt-24 sm:px-8 sm:pt-28 lg:px-12"
      >
        <div className="grid flex-1 grid-cols-1 gap-y-14 lg:grid-cols-[1.05fr_1fr] lg:gap-x-0">
          {/* ── Left: statement ── */}
          <section className="flex flex-col justify-between pb-2 lg:border-r lg:border-white/15 lg:pr-12 xl:pr-16">
            <div>
              {/* Eyebrow row */}
              <div className="rule-b flex items-center justify-between pb-4">
                <span className="eyebrow text-white/55">Private beta</span>
                <span className="eyebrow text-white/55">Est. 2026</span>
              </div>

              <h1 className="mt-8 text-[clamp(3.5rem,15vw,12.5rem)] leading-[0.82] font-black tracking-[-0.045em] text-white uppercase sm:mt-12">
                Coming
                <br />
                Soon
              </h1>
            </div>

            {/* Launch note — pinned to the bottom of the left column on desktop */}
            <div className="mt-12 lg:mt-16">
              <div className="rule-t pt-5">
                <p className="eyebrow text-white/55">Launch note</p>
                <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/80 sm:text-base">
                  We are building something new. Leave your address and we&apos;ll tell you
                  the moment it&apos;s ready.
                </p>
                <p className="mt-6 text-[13px] tracking-wide text-white/55 uppercase">
                  Kathmandu, Nepal
                </p>
              </div>
            </div>
          </section>

          {/* ── Right: signup ── */}
          <section
            id="join"
            className="flex scroll-mt-24 flex-col justify-center pt-4 lg:pl-12 xl:pl-16"
          >
            <form onSubmit={handleSubmit} aria-label="Mailing list signup" className="w-full">
              <p className="eyebrow rule-b pb-4 text-white/55">Join the mailing list</p>

              <label htmlFor="email" className="mt-8 block text-[15px] font-medium text-white">
                Email address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                inputMode="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status !== "idle"}
                className="mt-3 h-14 w-full border border-white/25 bg-transparent px-4 text-[16px] text-white transition-colors placeholder:text-white/45 hover:border-white/40 focus:border-white focus:outline-none"
              />

              <label className="group mt-6 flex cursor-pointer items-start gap-3 text-[14px] leading-snug text-white/70 transition-colors hover:text-white">
                <span className="relative -m-2 mt-[-2px] flex size-7 shrink-0 items-center justify-center">
                  <input
                    type="checkbox"
                    checked={subscribed}
                    onChange={(e) => setSubscribed(e.target.checked)}
                    className="peer size-[18px] cursor-pointer appearance-none border border-white/40 bg-transparent transition-colors checked:border-white checked:bg-white"
                    required
                  />
                  <svg
                    viewBox="0 0 24 24"
                    className="pointer-events-none absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 transition-opacity peer-checked:opacity-100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 12.5 9.5 18 20 6.5" />
                  </svg>
                </span>
                <span>
                  Yes, subscribe me to your newsletter.{" "}
                  <span className="text-white" aria-hidden="true">
                    *
                  </span>
                </span>
              </label>

              {/* Cloudflare Turnstile — only rendered when the server says a
                  site key is configured, so it can never silently disappear. */}
              <Captcha
                ref={captchaRef}
                siteKey={turnstile.siteKey}
                onToken={(token) => {
                  setCaptchaToken(token)
                  if (token) setCaptchaFailure(null)
                }}
                onFailure={setCaptchaFailure}
                className="mt-6 [&>div]:border [&>div]:border-white/15 [&>div]:p-2"
              />

              {/* A failed widget must never trap the visitor: the form stays
                  usable and the server is told the check couldn't run, so a
                  hostname/site-key mismatch can't lock out every signup. */}
              {captchaRequired && captchaFailure ? (
                <p className="mt-4 text-[13px] leading-relaxed text-white/55" role="status">
                  {captchaMessage(captchaFailure)}
                </p>
              ) : null}

              <button
                ref={buttonRef}
                type="submit"
                disabled={
                  status !== "idle" ||
                  !email ||
                  !subscribed ||
                  // Require a token only while the widget is still able to
                  // produce one. `captchaFailure` lifts the requirement.
                  (captchaRequired && !captchaToken && !captchaFailure)
                }
                className="relative mt-7 inline-flex h-14 w-full items-center justify-center gap-2 border border-white bg-white px-6 text-[15px] font-bold tracking-[0.14em] whitespace-nowrap text-black uppercase transition-colors duration-200 hover:bg-transparent hover:text-white active:scale-[0.995] disabled:cursor-not-allowed disabled:border-white/25 disabled:bg-transparent disabled:text-white/45"
              >
                {status === "success" ? (
                  <span
                    data-ring
                    aria-hidden
                    className="pointer-events-none absolute inset-0 border-2 border-white"
                  />
                ) : null}
                {status === "submitting" && (
                  <span
                    className="inline-block size-3.5 animate-spin rounded-full border-2 border-black/25 border-t-black"
                    role="status"
                    aria-label="Subscribing"
                  />
                )}
                {status === "success" ? (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M4 12.5 9.5 18 20 6.5" />
                    </svg>
                    You&apos;re in!
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>

              <p ref={successRef} aria-live="polite" className="mt-3 min-h-4">
                {status === "success" ? (
                  <span className="text-[13px] text-white/70">
                    You&apos;re on the list — see you at launch.
                  </span>
                ) : error ? (
                  // Errors invert to a white block on black instead of turning
                  // red, which would break the hue-free palette.
                  <span className="inline-block bg-white px-2.5 py-1 text-[12.5px] font-medium text-black">
                    {error}
                  </span>
                ) : null}
              </p>
            </form>

            {/* Socials */}
            <nav aria-label="Social media" className="mt-10 text-[13px] leading-6">
              <p className="eyebrow rule-b pb-3 text-white/55">Elsewhere</p>
              <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
                {[...SOCIALS_1, ...SOCIALS_2].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="-my-1.5 inline-flex min-w-6 items-center justify-center py-2 text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    {s.label}
                  </a>
                ))}
              </p>
            </nav>
          </section>
        </div>

        {/* ── Bottom bar: legal + meta ── */}
        <footer className="rule-t mt-16 flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-white/50">
            <a
              href="/privacy"
              className="-my-1.5 inline-flex items-center py-2 transition-colors hover:text-white hover:underline underline-offset-4"
            >
              Privacy Policy
            </a>
            <a
              href="/accessibility"
              className="-my-1.5 inline-flex items-center py-2 transition-colors hover:text-white hover:underline underline-offset-4"
            >
              Accessibility Statement
            </a>
          </div>
          <p className="eyebrow text-white/55">Tirbeo — All rights reserved</p>
        </footer>
      </main>
    </div>
  )
}