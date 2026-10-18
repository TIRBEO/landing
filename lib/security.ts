import { cookies } from "next/headers"
import { createHmac, timingSafeEqual } from "node:crypto"
import { createClient, type RedisClientType } from "redis"

/* ── Redis-backed rate limiter (shared across instances) ──
   Uses INCR + EXPIRE when REDIS_URL is configured; falls back to an
   in-memory limiter (single-instance) when it isn't or Redis fails.

   Hardening rule: NOTHING in the Redis plumbing may ever throw into the
   request path. A bad REDIS_URL (createClient throws synchronously on a
   malformed URL) or an unreachable Redis used to 500 every POST — the
   limiter is infrastructure, and if it breaks the app must keep serving
   on the in-memory budget instead of locking everyone out. */

let redis: RedisClientType | null = null
let redisConnecting: Promise<RedisClientType | null> | null = null
// Once a connection attempt fails we stop retrying for the process
// lifetime: serverless instances are short-lived, and re-probing a dead
// Redis on every request would add its full timeout to each signup.
let redisGaveUp = false
const REDIS_CONNECT_TIMEOUT_MS = 3_000

function getRedis(): Promise<RedisClientType | null> {
  const url = process.env.REDIS_URL
  if (!url || redisGaveUp) return Promise.resolve(null)
  if (redis) return Promise.resolve(redis)
  if (!redisConnecting) {
    try {
      redisConnecting = createClient({ url, socket: { connectTimeout: REDIS_CONNECT_TIMEOUT_MS } })
        .connect()
        .then((client) => {
          redis = client as RedisClientType
          return redis
        })
        .catch((err) => {
          console.error("[redis] connection failed, using in-memory limiter:", String(err))
          redisGaveUp = true
          redisConnecting = null
          return null
        })
    } catch (err) {
      // Malformed URL etc. throws synchronously — never let it escape.
      console.error("[redis] invalid REDIS_URL, using in-memory limiter:", String(err))
      redisGaveUp = true
    }
  }
  return redisConnecting ?? Promise.resolve(null)
}

// In-memory fallback (per instance; fine for local dev).
type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

// Periodically sweep expired buckets so the map doesn't grow forever.
let lastSweep = Date.now()
function sweep() {
  const now = Date.now()
  if (now - lastSweep < 60_000) return
  lastSweep = now
  for (const [key, b] of buckets) {
    if (b.resetAt < now) buckets.delete(key)
  }
}

export type RateLimitResult = {
  ok: boolean
  remaining: number
  retryAfter: number // seconds until window resets
}

function memoryLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  sweep()
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1, retryAfter: 0 }
  }

  bucket.count++
  if (bucket.count > limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    }
  }
  return { ok: true, remaining: limit - bucket.count, retryAfter: 0 }
}

/**
 * Fixed-window rate limiter, shared across instances via Redis when
 * REDIS_URL is set. If Redis is configured but errors mid-command we
 * degrade to the in-memory bucket (still a working per-instance limit)
 * rather than deny every visitor — a flaky limiter must never become a
 * site-wide outage.
 * @param key    unique id, usually `purpose:ip`
 * @param limit  max requests per window
 * @param windowMs window length in ms
 */
export async function rateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  let client: RedisClientType | null = null
  try {
    client = await getRedis()
  } catch (err) {
    console.error("[redis] unexpected limiter error, using memory:", String(err))
  }
  if (!client) return memoryLimit(key, limit, windowMs)

  // Redis path: INCR then EXPIRE on first hit (atomic-enough fixed window).
  try {
    const redisKey = `rl:${key}`
    const count = await client.incr(redisKey)
    if (count === 1) {
      await client.pExpire(redisKey, windowMs)
    }
    const ttl = await client.pTTL(redisKey)
    if (count > limit) {
      return {
        ok: false,
        remaining: 0,
        retryAfter: Math.max(1, Math.ceil(ttl / 1000)),
      }
    }
    return { ok: true, remaining: limit - count, retryAfter: 0 }
  } catch (err) {
    console.error("[redis] rate limit command failed, using memory", err)
    return memoryLimit(key, limit, windowMs)
  }
}

/** Best-effort client IP from proxy headers. */
export function clientIp(request: Request): string {
  const h = request.headers
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "unknown"
  )
}

export function tooManyRequests(retryAfter: number) {
  const mins = Math.max(1, Math.ceil(retryAfter / 60))
  return new Response(
    JSON.stringify({
      error: `Too many attempts. Try again in about ${mins} minute${mins === 1 ? "" : "s"}.`,
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(Math.max(1, retryAfter)),
      },
    },
  )
}

/* ── Admin token (shared with /api/waitlist/admin) ── */

export const ADMIN_COOKIE = "wl_admin"
// No fallback: if ADMIN_SECRET is missing we fail loudly on first admin
// token instead of silently signing sessions with a public constant.
const SECRET = process.env.ADMIN_SECRET
function requireSecret(): string {
  if (!SECRET) {
    throw new Error("ADMIN_SECRET is not set — admin sessions cannot be issued or verified")
  }
  return SECRET
}

export function sign(value: string) {
  return createHmac("sha256", requireSecret()).update(value).digest("hex")
}

export function makeAdminToken() {
  const payload = `admin.${Date.now()}`
  return `${payload}.${sign(payload)}`
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false
  const parts = token.split(".")
  if (parts.length !== 3) return false
  const payload = `${parts[0]}.${parts[1]}`
  const expected = sign(payload)
  const a = Buffer.from(expected)
  const b = Buffer.from(parts[2])
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false
  const issued = Number(parts[1])
  return Number.isFinite(issued) && Date.now() - issued < 30 * 24 * 60 * 60 * 1000
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies()
  return verifyAdminToken(store.get(ADMIN_COOKIE)?.value)
}

/** Constant-time string comparison (equalizes length first to avoid leaks). */
export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) {
    // Still burn a comparison on dummy data to smooth timing.
    timingSafeEqual(ab, ab)
    return false
  }
  return timingSafeEqual(ab, bb)
}

/* ── Cloudflare Turnstile (bot/captcha verification) ── */

// Re-exported so existing `import { verifyTurnstile } from "@/lib/security"`
// call sites keep working. The implementation lives in lib/turnstile.ts so the
// site key, the secret and the disable flags are resolved in ONE place — the
// previous split between a build-inlined client check and a runtime server
// check is what let the widget vanish while the server kept rejecting tokens.
export {
  verifyTurnstile,
  verifyTurnstileDetailed,
  getTurnstileConfig,
  toClientConfig,
} from "./turnstile"
export type { TurnstileConfig, TurnstileClientConfig, VerifyOutcome } from "./turnstile"
