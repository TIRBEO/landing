"use client"

import { useRef, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import type { TurnstileInstance } from "@marsidev/react-turnstile"
import { Check } from "lucide-react"

import { Captcha, captchaMessage, type CaptchaFailure } from "@/components/captcha"
import { Header } from "@/components/header"
import { SiteFooter } from "@/components/site-footer"
import { Spinner } from "@/components/spinner"
import type { TurnstileClientConfig } from "@/lib/turnstile"

/* ═══════════════════════════════════════════════════════════════════
   Landing — a single centred column: statement, signup form, socials.
   Apple grouped palette (see app/globals.css); blue marks what you
   can press, red marks what went wrong.
   ═══════════════════════════════════════════════════════════════════ */

const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com/tirbeo" },
  { label: "X", href: "https://x.com/tirbeo" },
  { label: "Instagram", href: "https://instagram.com/tirbeo" },
  { label: "TikTok", href: "https://tiktok.com/@tirbeo" },
  { label: "YouTube", href: "https://youtube.com/@tirbeo" },
]

export function LandingPage({ turnstile }: { turnstile: TurnstileClientConfig }) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle")
  const [error, setError] = useState<string | false>(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaFailure, setCaptchaFailure] = useState<CaptchaFailure>(null)
  const captchaRef = useRef<TurnstileInstance>(null)

  // Comes from the server so the widget and the API check can never disagree.
  const captchaRequired = turnstile.required

  async function handleSubmit(e: FormEvent) {
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
        let serverMsg = ""
        try {
          const data = (await res.json()) as { error?: string }
          serverMsg = data.error ?? ""
        } catch {
          /* non-JSON error response */
        }
        setError(serverMsg || "Something went wrong. Please try again.")
        setStatus("idle")
        setCaptchaToken(null)
        captchaRef.current?.reset()
        setTimeout(() => setError(false), 10_000)
        return
      }

      // Success is a page, not a flash of green text: it survives a refresh,
      // it can be bookmarked, and it means the button never ends up looking
      // like it did nothing.
      setStatus("success")
      setCaptchaToken(null)
      captchaRef.current?.reset()
      router.push("/thank-you")
    } catch {
      setStatus("idle")
      setError("Something went wrong. Please try again.")
      setCaptchaToken(null)
      captchaRef.current?.reset()
      setTimeout(() => setError(false), 10_000)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />

      <main id="main-content" className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-lg text-center">
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Coming soon
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            We&apos;re putting the finishing touches on Tirbeo. Leave your email address and
            we&apos;ll let you know the moment it&apos;s live.
          </p>

          {/* ── Signup ── `#join` is the target the login modal and the
              /join, /subscribe redirects point at. */}
          <form
            id="join"
            onSubmit={handleSubmit}
            aria-label="Mailing list signup"
            className="mt-9 scroll-mt-24 text-left"
          >
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
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
              className="h-12 w-full rounded-lg border border-border bg-input px-4 text-base text-foreground transition-colors placeholder:text-placeholder hover:border-border-strong focus:border-accent focus:outline-none disabled:opacity-60"
            />

            <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm leading-snug text-muted-foreground">
              <input
                type="checkbox"
                checked={subscribed}
                onChange={(e) => setSubscribed(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 cursor-pointer appearance-none rounded border border-border-strong bg-input transition-colors checked:border-accent checked:bg-accent"
                required
              />
              <span>Yes, subscribe me to your newsletter.</span>
            </label>

            {/* Cloudflare Turnstile — rendered only when the server reports a
                site key, so it can never silently disappear. */}
            <Captcha
              ref={captchaRef}
              siteKey={turnstile.siteKey}
              onToken={(token) => {
                setCaptchaToken(token)
                if (token) setCaptchaFailure(null)
              }}
              onFailure={setCaptchaFailure}
              className="mt-5"
            />

            {/* A failed widget must never trap the visitor: the form stays
                usable and the server is told the check couldn't run. Cases
                the visitor cannot act on (blocked/timeout) show NO message —
                the submission just rides the server's fallback gate. */}
            {captchaRequired && captchaFailure && captchaMessage(captchaFailure) ? (
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground" role="status">
                {captchaMessage(captchaFailure)}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={
                status !== "idle" ||
                !email ||
                !subscribed ||
                // Require a token only while the widget can still produce one.
                // `captchaFailure` lifts the requirement.
                (captchaRequired && !captchaToken && !captchaFailure)
              }
              className="btn btn-primary btn-block mt-6 h-14"
              aria-busy={status === "submitting" || undefined}
            >
              {status === "submitting" ? (
                <Spinner size={17} />
              ) : status === "success" ? (
                <Check className="size-4" aria-hidden="true" />
              ) : null}
              {status === "success"
                ? "You’re in"
                : status === "submitting"
                  ? "Adding you…"
                  : "Subscribe"}
            </button>

            <p aria-live="polite" className="mt-3 min-h-5 text-sm">
              {error ? <span className="text-sm font-medium text-danger-text">{error}</span> : null}
            </p>
          </form>

          {/* ── Socials ── */}
          <div className="mt-10 border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              <span className="mr-3">Follow us</span>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mx-1 inline-flex min-h-6 min-w-6 items-center justify-center px-1 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  {s.label}
                </a>
              ))}
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
