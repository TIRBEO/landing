"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import type { TurnstileInstance } from "@marsidev/react-turnstile"
import { Download, LogOut, Lock, Mail } from "lucide-react"

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
  const [error, setError] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
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

  // Load entries once authed
  useEffect(() => {
    if (!authed) return
    setLoading(true)
    fetch("/api/waitlist/list")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("unauthorized"))))
      .then((d) => {
        setEntries(d.entries ?? [])
        setLoading(false)
      })
      .catch(() => {
        setAuthed(false)
        setLoading(false)
      })
  }, [authed])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setError(false)
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
    } else {
      setError(true)
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
    <div className="nebula grain relative isolate flex min-h-dvh flex-col">
      <main className="relative flex flex-1 flex-col px-4 pt-14 pb-16 sm:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <Link
            href="/"
            className="text-[13px] font-medium text-white/50 transition-colors hover:text-white"
          >
            ← Back to site
          </Link>

          {/* ── Toolbar row: title, count, logout ── */}
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
              className="mx-auto mt-16 w-full max-w-sm rounded-2xl border border-white/15 bg-white/[0.03] p-8 sm:p-10"
              aria-label="Admin login"
            >
              <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-accent/40 bg-accent/10">
                <Lock className="size-5 text-accent" />
              </div>
              <h2 className="mt-4 text-center text-[20px] font-bold tracking-[-0.02em] text-white">
                Restricted access<span className="text-accent">.</span>
              </h2>
              <p className="mt-1.5 text-center text-[13px] text-white/50">
                Enter the admin password to view the waitlist.
              </p>
              <label htmlFor="admin-password" className="sr-only">
                Admin password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="mt-6 h-13 w-full rounded-lg border border-white/25 bg-black/40 px-4 py-3.5 text-[16px] text-white transition-colors placeholder:text-white/40 focus:border-accent focus:outline-none"
                placeholder="••••••••"
              />
              <Captcha ref={captchaRef} onToken={setCaptchaToken} className="mt-5" />
              <button
                type="submit"
                disabled={
                  // If Turnstile is configured, require a token before submit.
                  captchaRequired && !captchaToken
                }
                className="mt-4 inline-flex h-13 w-full items-center justify-center rounded-lg bg-accent py-3.5 text-[16px] font-semibold text-accent-foreground transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Unlock
              </button>
              {error ? (
                <p className="mt-3 text-center text-[13px] text-[#ff5a5f]" role="alert">
                  Wrong password.
                </p>
              ) : null}
            </form>
          ) : (
            <>
              {/* ── Spreadsheet-style table ── */}
              {loading ? (
                <p className="mt-10 text-white/50">Loading rows…</p>
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
