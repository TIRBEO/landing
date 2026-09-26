import { NextResponse } from "next/server"
import {
  ADMIN_COOKIE,
  clientIp,
  makeAdminToken,
  rateLimit,
  safeEqual,
  tooManyRequests,
  verifyTurnstile,
} from "@/lib/security"

/**
 * Tiny password gate for the waitlist admin page.
 * POST { password } -> sets an HttpOnly signed cookie (30 days).
 * The password comes only from the ADMIN_PASSWORD env var — if it is
 * not configured, login is refused entirely (fail closed), so the app
 * can never fall back to a known password in production.
 * Login is rate limited: 5 attempts per IP per 10 minutes.
 */
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const COOKIE = ADMIN_COOKIE

export async function GET() {
  const { isAdmin } = await import("@/lib/security")
  return NextResponse.json({ authed: await isAdmin() })
}

export async function POST(request: Request) {
  const ip = clientIp(request)
  const rl = await rateLimit(`admin-login:${ip}`, 5, 10 * 60 * 1000)
  if (!rl.ok) return tooManyRequests(rl.retryAfter)

  let password: string | undefined
  let turnstileToken: string | undefined
  try {
    const body = (await request.json()) as { password?: string; turnstileToken?: string }
    password = body.password
    turnstileToken = body.turnstileToken
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }

  // ── Cloudflare Turnstile bot check ──
  const human = await verifyTurnstile(turnstileToken, ip)
  if (!human) {
    return NextResponse.json(
      { error: "Human verification failed. Please try again." },
      { status: 403 },
    )
  }

  // Fail closed: no ADMIN_PASSWORD configured means no login at all.
  if (!ADMIN_PASSWORD || !password || !safeEqual(password, ADMIN_PASSWORD)) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, makeAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(COOKIE)
  return res
}
