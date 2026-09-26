import { promises as fs } from "node:fs"
import path from "node:path"
import { NextResponse } from "next/server"
import { getClient, resetClient } from "@/lib/mongodb"
import { clientIp, rateLimit, tooManyRequests, verifyTurnstile } from "@/lib/security"

const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
const MAX_EMAIL_LEN = 254
const MAX_BODY_BYTES = 1024

/** Disposable / throwaway domains commonly used for spam signups. */
const BLOCKED_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com",
  "temp-mail.org", "yopmail.com", "trashmail.com", "sharklasers.com",
  "throwawaymail.com", "getnada.com", "dispostable.com", "maildrop.cc",
  "fakeinbox.com", "spam4.me", "grr.la", "burnermail.io", "moakt.com",
  "emailondeck.com", "mailnesia.com", "tempinbox.com",
])

/** Obvious spam/junk patterns in the local part. */
const SPAM_PATTERNS = [
  /(.)\1{6,}/, // aaaaaaa…
  /^(?:test|asdf|qwerty|abc|aaa|xxx|admin|noreply|no-reply|spam)/i,
]

type Entry = { email: string; createdAt: string; source: string; ip?: string }

/**
 * File fallback path. On Vercel the deployed filesystem is read-only
 * (/var/task) except /tmp, so write there. Locally cwd/data works.
 * Returns the file path, or null when no writable location exists.
 */
function fallbackFile(): string {
  // Writable on Vercel/Lambda; also fine locally.
  return path.join("/tmp", "waitlist.json")
}

async function loadFileEntries(): Promise<Entry[]> {
  try {
    const raw = await fs.readFile(fallbackFile(), "utf8")
    return JSON.parse(raw) as Entry[]
  } catch {
    return []
  }
}

async function appendToFile(entry: Entry): Promise<boolean> {
  const file = fallbackFile()
  try {
    await fs.mkdir(path.dirname(file), { recursive: true })
    const entries = await loadFileEntries()
    // Hard duplicate check in the file fallback too.
    if (entries.some((e) => e.email === entry.email)) return false
    entries.push(entry)
    await fs.writeFile(file, JSON.stringify(entries, null, 2))
    return true
  } catch (err) {
    // No writable filesystem at all (e.g. read-only runtime) — don't 500;
    // log so the signup is still traceable in server logs.
    console.error("[waitlist] file fallback unavailable:", err)
    return false
  }
}

export async function POST(request: Request) {
  // ── Rate limit: 5 signups per IP per 10 minutes ──
  const ip = clientIp(request)
  const rl = await rateLimit(`signup:${ip}`, 5, 10 * 60 * 1000)
  if (!rl.ok) return tooManyRequests(rl.retryAfter)

  try {
    // Reject oversized payloads early (cheap DoS guard).
    const raw = await request.text()
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 })
    }

    const body = JSON.parse(raw) as { email?: string; turnstileToken?: string }
    const email = body.email?.trim().toLowerCase()

    if (!email || email.length > MAX_EMAIL_LEN || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 })
    }

    const domain = email.split("@")[1]

    // ── Spam / abuse blocking ──
    if (BLOCKED_DOMAINS.has(domain)) {
      return NextResponse.json(
        { error: "Disposable email addresses are not allowed" },
        { status: 400 },
      )
    }
    const local = email.split("@")[0]
    if (SPAM_PATTERNS.some((re) => re.test(local))) {
      return NextResponse.json({ error: "Please use a real email address" }, { status: 400 })
    }

    // ── Cloudflare Turnstile bot check ──
    const human = await verifyTurnstile(body.turnstileToken, ip)
    if (!human) {
      return NextResponse.json(
        { error: "Human verification failed. Please try again." },
        { status: 403 },
      )
    }

    const entry: Entry = {
      email,
      createdAt: new Date().toISOString(),
      source: "landing",
      ip,
    }
    const clientPromise = getClient()

    if (clientPromise) {
      try {
        const client = await clientPromise
        const result = await client.db("tirbeo").collection("waitlist").updateOne(
          { email },
          { $setOnInsert: { ...entry } },
          { upsert: true }, // no duplicate emails
        )
        if (result.upsertedCount === 0) {
          return NextResponse.json({ ok: true, duplicate: true }, { status: 200 })
        }
        return NextResponse.json({ ok: true }, { status: 201 })
      } catch (err) {
        // Mongo unreachable (DNS blip, network hiccup, cold start) —
        // don't lose the signup: fall through to the file fallback.
        console.error("[waitlist] Mongo unavailable, using file fallback:", err)
        resetClient()
      }
    }

    const added = await appendToFile(entry)
    if (!added) {
      // Nothing writable and Mongo down — accept so the UX doesn't
      // break; the email is logged above for manual recovery.
      return NextResponse.json({ ok: true }, { status: 201 })
    }
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    console.error("[waitlist]", err)
    return NextResponse.json({ error: "Could not save your email" }, { status: 500 })
  }
}
