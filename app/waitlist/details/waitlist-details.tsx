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
    <div className="veil grain relative isolate flex min-h-dvh flex-col">
      <div className="grid-lines pointer-events-none absolute inset-0 -z-10" aria-hidden />

      <main className="relative mx-auto flex w-full max-w-[100rem] flex-1 flex-col px-5 pt-20 pb-16 sm:px-8 sm:pt-24 lg:px-12">
        <div className="w-full">
          <Link
            href="/"
            className="-ml-1.5 inline-flex items-center py-2 pl-1.5 text-[13px] font-medium text-white/50 transition-colors hover:text-white"
          >
            ← Back to site
          </Link>

          {/* ── Toolbar row: title, count, actions ── */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-5">
            <div className="flex items-center gap-6">
              <h1 className="text-[clamp(1.6rem,4vw,2.4rem)] leading-none font-bold tracking-[-0.03em] text-white">
                Waitlist<span className="ml-1.5 inline-block size-[7px] self-center border border-white" />
              </h1>
              {authed ? (
                <span className="flex items-center gap-2 border border-white/20 px-3.5 py-1.5 text-[13px] font-semibold tabular">
                  <Mail className="size-3.5" />
                  {loading ? "…" : `${entries.length} rows`}
                </span>
              ) : null}
            </div>
            {authed ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={exportCsv}
                  disabled={loading || entries.length === 0}
                  className="flex items-center gap-1.5 border border-white/20 px-4 py-2 text-[13px] text-white/70 transition-colors hover:border-white hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Download className="size-3.5" />
                  Export CSV
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 border border-white/20 px-4 py-2 text-[13px] text-white/70 transition-colors hover:border-white hover:bg-white hover:text-black"
                >
                  <LogOut className="size-3.5" />
                  Log out
                </button>
              </div>
            ) : null}
          </div>

          {/* ── Password gate ── */}
          {authed === null ? (
            <p className="mt-10 text-white/50">Checking session…</p>
          ) : !authed ? (
            <form
              onSubmit={login}
              className="mx-auto mt-24 w-full max-w-xs"
              aria-label="Admin login"
            >
              <p className="eyebrow text-center text-white/55">Restricted</p>
              <h2 className="mt-3 text-center text-[22px] font-bold tracking-[-0.02em] text-white">
                Admin login
              </h2>
              <p className="mt-1.5 text-center text-[13px] text-white/50">
                Enter the admin password to continue.
              </p>

              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="mt-8 h-12 w-full border-0 border-b border-white/25 bg-transparent px-1 text-[16px] text-white transition-colors placeholder:text-white/45 focus:border-accent focus:outline-none"
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
                <p className="mt-4 text-[13px] leading-relaxed text-white/55" role="status">
                  {captchaMessage(captchaFailure)}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={captchaRequired && !captchaToken && !captchaFailure}
                className="mt-6 inline-flex h-12 w-full items-center justify-center border border-white bg-white text-[14px] font-bold tracking-[0.14em] whitespace-nowrap text-black uppercase transition-colors duration-200 hover:bg-transparent hover:text-white active:scale-[0.995] disabled:cursor-not-allowed disabled:border-white/25 disabled:bg-transparent disabled:text-white/45"
              >
                Unlock
              </button>

              {error ? (
                <p className="mt-4 text-center text-[13px] leading-relaxed text-white/70" role="alert">
                  {error}
                </p>
              ) : null}
            </form>
          ) : (
            <>
              {/* ── Spreadsheet-style table ── */}
              {loading ? (
                <p className="mt-10 text-white/50">Loading rows…</p>
              ) : loadError ? (
                <div className="mt-8 border border-white/15 p-10 text-center">
                  <p className="text-[15px] font-semibold text-white">Couldn&apos;t load rows</p>
                  <p className="mt-1 text-[13px] text-white/50">{loadError}</p>
                  <button
                    onClick={() => setAuthed(false)}
                    className="mt-5 border border-white/20 px-5 py-2 text-[13px] text-white/70 transition-colors hover:border-white hover:bg-white hover:text-black"
                  >
                    Retry
                  </button>
                </div>
              ) : entries.length === 0 ? (
                <div className="mt-8 border border-white/10 bg-white/[0.03] p-10 text-center">
                  <p className="text-[15px] font-semibold text-white">No rows yet</p>
                  <p className="mt-1 text-[13px] text-white/50">
                    New subscribers appear here instantly.
                  </p>
                </div>
              ) : (
                <div className="mt-8 overflow-x-auto border border-white/15">
                  <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
                    <thead>
                      <tr className="bg-white/[0.06] text-[11.5px] font-semibold tracking-[0.08em] text-white/60 uppercase">
                        <th className="w-14 border-r border-white/10 px-4 py-3 font-semibold">
                          #
                        </th>
                        <th className="border-r border-white/10 px-4 py-3 font-semibold">
                          Email
                        </th>
                        <th className="w-56 border-r border-white/10 px-4 py-3 font-semibold">
                          Date
                        </th>
                        <th className="w-40 border-r border-white/10 px-4 py-3 font-semibold">
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
                          <tr
                            key={`${entry.email}-${i}`}
                            className="border-t border-white/10 transition-colors hover:bg-white/[0.04]"
                          >
                            <td className="mono border-r border-white/10 px-4 py-3 text-[12px] text-white/55 tabular">
                              {i + 1}
                            </td>
                            <td className="border-r border-white/10 px-4 py-3 font-medium text-white">
                              {entry.email}
                            </td>
                            <td className="border-r border-white/10 px-4 py-3 text-white/60 tabular">
                              {date}
                            </td>
                            <td className="mono border-r border-white/10 px-4 py-3 text-white/60 tabular">
                              {time}
                            </td>
                            <td className="px-4 py-3 text-[13px] text-white/50">{entry.source}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
