"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import type { TurnstileInstance } from "@marsidev/react-turnstile"
import { Download, LogOut, Mail } from "lucide-react"

import { Captcha, captchaMessage, type CaptchaFailure } from "@/components/captcha"
import type { TurnstileClientConfig } from "@/lib/turnstile"

type Entry = { email: string; createdAt: string; source: string }

export function WaitlistDetails({ turnstile }: { turnstile: TurnstileClientConfig }) {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaFailure, setCaptchaFailure] = useState<CaptchaFailure>(null)

  const captchaRef = useRef<TurnstileInstance>(null)
  const captchaRequired = turnstile.required

  // Check existing session
  useEffect(() => {
    fetch("/api/waitlist/admin")
      .then((r) => r.json())
      .then((d) => setAuthed(Boolean(d.authed)))
      .catch(() => setAuthed(false))
  }, [])

  // Load entries once authed. A failed load must NOT log the user out —
  // show a retryable error instead.
  useEffect(() => {
    if (!authed) return
    let cancelled = false
    // Resetting the load state when `authed` flips is the point of this effect:
    // it re-runs per auth transition and must clear the previous attempt's
    // spinner/error before retrying. Derived-state-during-render would lose
    // that reset, so the synchronous setState is intentional here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setLoadError(null)
    const load = async (attempt: number): Promise<void> => {
      try {
        const res = await fetch("/api/waitlist/list")
        if (cancelled) return
        if (!res.ok) throw new Error(`status ${res.status}`)
        const d = await res.json()
        setEntries(d.entries ?? [])
        setLoading(false)
        setLoadError(null)
      } catch {
        if (cancelled) return
        // Retry up to 3 times with a short backoff — cold-start Mongo
        // blips recover within a second or two.
        if (attempt < 3) {
          setTimeout(() => !cancelled && load(attempt + 1), 1200 * (attempt + 1))
          return
        }
        setLoading(false)
        setLoadError("Couldn't load rows from the database. Check your connection and try again.")
      }
    }
    load(0)
    return () => {
      cancelled = true
    }
  }, [authed])

  /* Which edges are hiding rows. The right-hand fade and the held column's
     shadow are the table admitting that it scrolls, and neither is true on a
     wide screen — so they answer to the live geometry, not to a media query. */
  const scroller = useRef<HTMLDivElement>(null)
  const [scroll, setScroll] = useState({ more: false, scrolled: false })

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const measure = () => {
      const room = el.scrollWidth - el.clientWidth
      setScroll({ more: room - el.scrollLeft > 1, scrolled: el.scrollLeft > 1 })
    }
    measure()
    el.addEventListener("scroll", measure, { passive: true })
    const onResize = new ResizeObserver(measure)
    onResize.observe(el)
    return () => {
      el.removeEventListener("scroll", measure)
      onResize.disconnect()
    }
    // The scroller is in the branch that renders once rows arrive, so the
    // listener has to be re-attached when this effect last ran against a
    // different element — a spinner unmounting it counts as one.
  }, [loading, entries.length])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await fetch("/api/waitlist/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password,
        turnstileToken: captchaToken,
        // Lets the server distinguish "widget could not run" from a bad token.
        captchaUnavailable: !captchaToken && !!captchaFailure,
      }),
    })
    if (res.ok) {
      setAuthed(true)
      setPassword("")
      setCaptchaToken(null)
      captchaRef.current?.reset()
    } else if (res.status === 403) {
      // Captcha failed — most likely the widget couldn't load/verify
      // (e.g. domain not whitelisted for the Turnstile site key).
      setError(
        "Verification failed — the security check couldn't complete. If this keeps happening, the captcha may not be configured for this domain.",
      )
      setCaptchaToken(null)
      captchaRef.current?.reset()
    } else if (res.status === 429) {
      setError("Too many attempts. Wait a few minutes and try again.")
    } else {
      setError("Wrong password.")
      setCaptchaToken(null)
      captchaRef.current?.reset()
    }
  }

  function exportCsv() {
    // Triggers a direct download from the admin-only CSV endpoint. This has to
    // be a real navigation (not router.push) so the browser honours the
    // Content-Disposition attachment response.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/api/waitlist/export"
  }

  async function logout() {
    await fetch("/api/waitlist/admin", { method: "DELETE" })
    setAuthed(false)
    setEntries([])
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-12 sm:px-6">
        <div>
          <Link
            href="/"
            className="inline-flex min-h-6 items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to site
          </Link>

          {/* ── Toolbar row: title, count, actions ── */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold tracking-tight">Waitlist</h1>
              {authed ? (
                <span className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground tabular">
                  <Mail className="size-4" aria-hidden="true" />
                  {loading ? "…" : `${entries.length} rows`}
                </span>
              ) : null}
            </div>
            {authed ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={exportCsv}
                  disabled={loading || entries.length === 0}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="size-4" aria-hidden="true" />
                  Export CSV
                </button>
                <button
                  onClick={logout}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Log out
                </button>
              </div>
            ) : null}
          </div>

          {/* ── Password gate ── */}
          {authed === null ? (
            <p className="mt-10 text-sm text-muted-foreground">Checking session…</p>
          ) : !authed ? (
            <form
              onSubmit={login}
              className="mx-auto mt-16 w-full max-w-sm"
              aria-label="Admin login"
            >
              <h2 className="text-center text-lg font-semibold">Admin login</h2>
              <p className="mt-1.5 text-center text-sm text-muted-foreground">
                Enter the admin password to continue.
              </p>

              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="mt-6 h-11 w-full rounded-lg border border-border bg-input px-3 text-base text-foreground transition-colors placeholder:text-placeholder hover:border-border-strong focus:border-accent focus:outline-none"
                placeholder="Password"
              />

              <Captcha
                ref={captchaRef}
                siteKey={turnstile.siteKey}
                onToken={(token) => {
                  setCaptchaToken(token)
                  if (token) setCaptchaFailure(null)
                }}
                onFailure={setCaptchaFailure}
                className="mt-6"
              />

              {/* A broken widget must not lock the operator out of their own
                  waitlist — explain it and stay usable. */}
              {captchaRequired && captchaFailure ? (
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground" role="status">
                  {captchaMessage(captchaFailure)}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={captchaRequired && !captchaToken && !captchaFailure}
                className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg bg-accent-solid text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-solid-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                Unlock
              </button>

              {error ? (
                <p className="mt-4 text-center text-sm text-danger-text" role="alert">
                  {error}
                </p>
              ) : null}
            </form>
          ) : (
            <>
              {/* ── Spreadsheet-style table ── */}
              {loading ? (
                <p className="mt-10 text-sm text-muted-foreground">Loading rows…</p>
              ) : loadError ? (
                <div className="mt-8 rounded-xl border border-border bg-card p-10 text-center">
                  <p className="font-medium">Couldn&apos;t load rows</p>
                  <p className="mt-1 text-sm text-muted-foreground">{loadError}</p>
                  <button
                    onClick={() => setAuthed(false)}
                    className="mt-5 inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                  >
                    Retry
                  </button>
                </div>
              ) : entries.length === 0 ? (
                <div className="mt-8 border border-border bg-faint p-10 text-center">
                  <p className="text-[15px] font-semibold text-foreground">No rows yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    New subscribers appear here instantly.
                  </p>
                </div>
              ) : (
                <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
                  <div ref={scroller} className="tb-scroll" data-more={scroll.more} data-scrolled={scroll.scrolled}>
                    <table className="tb-table w-full min-w-[560px] border-collapse text-left text-sm">
                      <thead>
                        <tr className="bg-muted text-xs font-medium text-muted-foreground">
                          <th className="w-14 px-4 py-3 font-semibold">#</th>
                          <th className="border-r border-divider px-4 py-3 font-semibold">
                            Email
                          </th>
                          <th className="w-56 border-r border-divider px-4 py-3 font-semibold">
                            Date
                          </th>
                          <th className="w-40 border-r border-divider px-4 py-3 font-semibold">
                            Time
                          </th>
                          <th className="w-24 px-4 py-3 font-semibold">Source</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map((entry, i) => {
                          const d = new Date(entry.createdAt)
                          const date = d.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                          const time = d.toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })
                          return (
                            <tr key={`${entry.email}-${i}`} className="tb-row border-t border-divider">
                              <td className="px-4 py-3 text-xs text-placeholder tabular">
                                {i + 1}
                              </td>
                              <td className="border-r border-divider px-4 py-3 font-medium text-foreground">
                                {entry.email}
                              </td>
                              <td className="border-r border-divider px-4 py-3 text-muted-foreground tabular">
                                {date}
                              </td>
                              <td className="mono border-r border-divider px-4 py-3 text-muted-foreground tabular">
                                {time}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">{entry.source}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
