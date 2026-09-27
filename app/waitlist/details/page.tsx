"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import type { TurnstileInstance } from "@marsidev/react-turnstile"
import { Download, LogOut, Mail } from "lucide-react"

import { Captcha } from "@/components/captcha"

type Entry = { email: string; createdAt: string; source: string }

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

export default function WaitlistDetailsPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaFailed, setCaptchaFailed] = useState(false)
  const captchaRef = useRef<TurnstileInstance>(null)
  const captchaRequired =
    Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) &&
    process.env.NEXT_PUBLIC_DISABLE_TURNSTILE !== "1"

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
      body: JSON.stringify({ password, turnstileToken: captchaToken }),
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
    // Triggers a direct download from the admin-only CSV endpoint.
    window.location.href = "/api/waitlist/export"
  }

  async function logout() {
    await fetch("/api/waitlist/admin", { method: "DELETE" })
    setAuthed(false)
    setEntries([])
  }

  return (
    <div className="grain relative isolate flex min-h-dvh flex-col">
      <main className="relative flex flex-1 flex-col px-4 pt-14 pb-16 sm:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <Link
            href="/"
            className="text-[13px] font-medium text-white/50 transition-colors hover:text-white"
          >
            ← Back to site
          </Link>

          {/* ── Toolbar row: title, count, actions ── */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-5">
            <div className="flex items-center gap-6">
              <h1 className="text-[clamp(1.6rem,4vw,2.4rem)] leading-none font-bold tracking-[-0.03em] text-white">
                Waitlist<span className="text-accent">.</span>
              </h1>
              {authed ? (
                <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-[13px] font-semibold tabular">
                  <Mail className="size-3.5 text-accent" />
                  {loading ? "…" : `${entries.length} rows`}
                </span>
              ) : null}
            </div>
            {authed ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={exportCsv}
                  disabled={loading || entries.length === 0}
                  className="flex items-center gap-1.5 rounded-lg border border-white/20 px-4 py-2 text-[13px] text-white/70 transition-all hover:border-white/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Download className="size-3.5" />
                  Export CSV
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 rounded-lg border border-white/20 px-4 py-2 text-[13px] text-white/70 transition-all hover:border-white/50 hover:text-white"
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
              <h2 className="text-center text-[20px] font-bold tracking-[-0.02em] text-white">
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
                className="mt-8 h-12 w-full border-0 border-b border-white/25 bg-transparent px-1 text-[16px] text-white transition-colors placeholder:text-white/30 focus:border-accent focus:outline-none"
                placeholder="Password"
              />

              <Captcha
                ref={captchaRef}
                onToken={setCaptchaToken}
                onError={() => setCaptchaFailed(true)}
                className="mt-6"
              />

              <button
                type="submit"
                disabled={captchaRequired && !captchaToken}
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-accent text-[15px] font-semibold text-accent-foreground transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Unlock
              </button>

              {error ? (
                <p
                  className={`mt-4 text-center text-[13px] leading-relaxed ${error.startsWith("Verification") || error.startsWith("Too many") ? "text-amber-400/90" : "text-[#ff5a5f]"}`}
                  role="alert"
                >
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
                <div className="mt-8 border border-white/10 bg-white/[0.03] p-10 text-center">
                  <p className="text-[15px] font-semibold text-white">Couldn't load rows</p>
                  <p className="mt-1 text-[13px] text-white/50">{loadError}</p>
                  <button
                    onClick={() => setAuthed(false)}
                    className="mt-5 rounded-lg border border-white/20 px-5 py-2 text-[13px] text-white/70 transition-all hover:border-white/50 hover:text-white"
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
                            <td className="mono border-r border-white/10 px-4 py-3 text-[12px] text-white/35 tabular">
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
