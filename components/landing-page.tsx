"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import type { TurnstileInstance } from "@marsidev/react-turnstile"

import { Captcha } from "@/components/captcha"
import { Header } from "@/components/header"
import type { TurnstileClientConfig } from "@/lib/turnstile"

/* ═══════════════════════════════════════════════════════════════════
   Landing — "COMING SOON" poster.

   Full-bleed gold-nebula backdrop, colossal white headline pinned to
   the top-left, and a bottom band: launch note + mail-list form +
   social links, like the reference. No feature claims.
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
  const [captchaBroken, setCaptchaBroken] = useState(false)
  const captchaRef = useRef<TurnstileInstance>(null)
  // Comes from the server so the widget and the API check can never disagree.
  const captchaRequired = turnstile.required
  const formRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const successRef = useRef<HTMLParagraphElement>(null)

  /* Success burst: button pops, gold ring ripples out, message rises in */
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

        // Button pop
        gsap
          .timeline()
          .to(btn, { scale: 0.94, duration: 0.09, ease: "power2.in" })
          .to(btn, { scale: 1.05, duration: 0.22, ease: "power2.out" })
          .to(btn, { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.5)" })

        // Ripple ring — React renders it when status flips to success;
        // here we just animate it out.
        const ring = btn.querySelector("[data-ring]")
        if (ring) {
          gsap.to(ring, {
            scale: 1.5,
            opacity: 0,
            duration: 0.9,
            ease: "power2.out",
          })
        }

        // Success message rises
        if (msg) {
          gsap.fromTo(
            msg,
            { autoAlpha: 0, y: 10 },
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
        body: JSON.stringify({ email, turnstileToken: captchaToken }),
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
    <div className="grain nebula relative isolate flex min-h-dvh flex-col">
      <Header />

      <main id="main-content" className="relative flex flex-1 flex-col">
        {/* ── Headline ── */}
        <div className="flex flex-1 items-start px-6 pt-32 min-[420px]:pt-36 sm:px-10 sm:pt-44 lg:px-14">
          <h1 className="text-[clamp(3.25rem,16vw,13rem)] leading-[0.9] font-bold tracking-[-0.02em] text-white uppercase">
            Coming
            <br />
            Soon
          </h1>
        </div>

        {/* ── Bottom band ── */}
        <div className="px-6 pb-12 sm:px-10 lg:px-14">
          <div className="grid items-end gap-12 sm:grid-cols-[1fr_1.4fr_1fr] sm:gap-10">
            {/* Launch note — hidden on mobile, shown sm+ */}
            <div className="hidden sm:block">
              <p className="text-[13px] leading-relaxed font-semibold tracking-wide text-white uppercase">
                <span className="block">We are</span>{" "}
                <span className="block">launching our</span>{" "}
                <span className="block">website soon</span>
              </p>
              <p className="mt-5 text-[13px] font-semibold tracking-wide text-white uppercase">
                Come visit
              </p>
              <p className="mt-1.5 text-[12px] text-white/50">Kathmandu, Nepal</p>
            </div>

            {/* Mail list */}
            <div ref={formRef} id="join" className="w-full scroll-mt-24 sm:justify-self-center">
            <form
              onSubmit={handleSubmit}
              aria-label="Mailing list signup"
              className="w-full"
            >
              <p className="mb-4 text-[18px] font-bold tracking-wide text-white uppercase">
                Join our{" "}
                <span className="text-accent">Mailing List</span>
              </p>
              <label htmlFor="email" className="mb-2 block text-[14px] font-medium text-white/90">
                Email address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Email *"
                autoComplete="email"
                inputMode="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status !== "idle"}
                className="h-14 w-full rounded-lg border border-white/25 bg-black/40 px-4 text-[16px] text-white transition-colors placeholder:text-white/40 focus:border-accent focus:outline-none"
              />

              <label className="group mt-5 flex cursor-pointer items-start gap-3 text-[13.5px] leading-snug text-white/80 transition-colors hover:text-white">
                <span className="relative mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={subscribed}
                    onChange={(e) => setSubscribed(e.target.checked)}
                    className="peer size-[18px] cursor-pointer appearance-none rounded-[5px] border border-white/40 bg-black/40 transition-colors checked:border-accent checked:bg-accent"
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
                  Yes, subscribe me to your newsletter. <span className="text-accent" aria-hidden="true">*</span>
                </span>
              </label>

              {/* Cloudflare Turnstile — only rendered when the server says a
                  site key is configured, so it can never silently disappear. */}
              <Captcha
                ref={captchaRef}
                siteKey={turnstile.siteKey}
                // A token arriving means the widget recovered (retry: "auto"),
                // so clear the broken banner and re-enable submit.
                onToken={(token) => {
                  setCaptchaToken(token)
                  if (token) setCaptchaBroken(false)
                }}
                onError={() => setCaptchaBroken(true)}
                className="mt-5"
              />

              {/* The widget failing (blocked script, un-whitelisted domain)
                  used to be invisible: no box, no message, and a submit button
                  that silently never enabled. Say so instead. */}
              {captchaRequired && captchaBroken ? (
                <p
                  className="mt-3 text-[12px] leading-relaxed text-amber-400/90"
                  role="alert"
                >
                  The security check couldn&apos;t load. Please disable an ad-blocker for
                  this page and refresh to subscribe.
                </p>
              ) : null}

              <button
                ref={buttonRef}
                type="submit"
                disabled={
                  status !== "idle" ||
                  !email ||
                  !subscribed ||
                  // If Turnstile is configured, require a token before submit.
                  (captchaRequired && (!captchaToken || captchaBroken))
                }
                className="relative mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 text-[16px] font-semibold whitespace-nowrap text-accent-foreground transition-colors hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {status === "success" ? (
                  <span
                    data-ring
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-lg border-2 border-accent"
                  />
                ) : null}
                {status === "submitting" && (
                  <span
                    className="inline-block size-3.5 animate-spin rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground"
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

              <p
                ref={successRef}
                className={`mt-2.5 min-h-4 text-[12px] ${error ? "text-[#ff5a5f]" : "text-accent"}`}
                aria-live="polite"
              >
                {status === "success"
                  ? "You're on the list — see you at launch."
                  : error
                    ? error
                    : ""}
              </p>
            </form>
            </div>

            {/* Socials + legal */}
            <div className="sm:justify-self-end sm:text-right">
              <nav aria-label="Social media" className="text-[13px] leading-7">
                <p className="space-x-4">
                  {SOCIALS_1.map((s, i) => (
                    <span key={s.label}>
                      {i > 0 ? <span className="mr-4 text-white/40" aria-hidden>·</span> : null}
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white transition-opacity hover:opacity-60"
                      >
                        {s.label}
                      </a>
                    </span>
                  ))}
                </p>
                <p className="mt-1 space-x-4">
                  {SOCIALS_2.map((s, i) => (
                    <span key={s.label}>
                      {i > 0 ? <span className="mr-4 text-white/40" aria-hidden>·</span> : null}
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white transition-opacity hover:opacity-60"
                      >
                        {s.label}
                      </a>
                    </span>
                  ))}
                </p>
              </nav>

              <div className="mt-8 text-[12px] leading-5.5 text-white/50">
                <a href="/privacy" className="block transition-colors hover:text-white">
                  Privacy Policy
                </a>
                <a href="/accessibility" className="block transition-colors hover:text-white">
                  Accessibility Statement
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
