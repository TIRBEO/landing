/**
 * `accountsOrigin` duplicates `lib/accounts.ts`, which the app itself uses.
 * It has to: `next.config.mjs` is executed by Node before TypeScript (and the
 * `@/` alias) exists, so it cannot import it.
 * KEEP IN SYNC.
 */
const CANONICAL_ACCOUNTS_ORIGIN = "https://accounts.tirbeo.com"

function accountsOrigin() {
  const raw = process.env.NEXT_PUBLIC_ACCOUNTS_URL?.trim().replace(/\/+$/, "")
  if (!raw) return CANONICAL_ACCOUNTS_ORIGIN
  const loopback = /localhost|127\.0\.0\.1/.test(raw)
  if (loopback && process.env.NODE_ENV === "production") return CANONICAL_ACCOUNTS_ORIGIN
  return raw
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },

  /**
   * Every URL a visitor, a search engine, or another Tirbeo app is likely to
   * ask for that is not a page of its own.
   *
   * Permanent (308/301) for renames that are settled; temporary (307) for the
   * hand-offs to the accounts app, whose origin can move per environment, and
   * for the same-page anchors, which browsers handle differently on a
   * permanent redirect.
   */
  async redirects() {
    const accounts = accountsOrigin()
    return [
      // ── The homepage, by any other name ──
      { source: "/home", destination: "/", permanent: true },
      { source: "/index", destination: "/", permanent: true },
      { source: "/coming-soon", destination: "/", permanent: true },

      // ── Same page, straight to the signup form ──
      { source: "/join", destination: "/#join", permanent: false },
      { source: "/subscribe", destination: "/#join", permanent: false },
      { source: "/waitlist", destination: "/#join", permanent: false },

      // ── Signup confirmation, however it gets remembered ──
      { source: "/thanks", destination: "/thank-you", permanent: true },
      { source: "/thankyou", destination: "/thank-you", permanent: true },
      { source: "/success", destination: "/thank-you", permanent: true },

      // ── Legal pages, with the names people guess ──
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms-of-service", destination: "/terms", permanent: true },
      { source: "/tos", destination: "/terms", permanent: true },
      { source: "/accessibility-statement", destination: "/accessibility", permanent: true },

      // ── About and help, which this site does not have as separate pages ──
      { source: "/about", destination: "/teams", permanent: true },
      { source: "/team", destination: "/teams", permanent: true },
      { source: "/help", destination: "/contact", permanent: true },
      { source: "/support", destination: "/contact", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/feedback", destination: "/contact", permanent: true },

      // ── Auth belongs to the accounts app ──
      { source: "/login", destination: `${accounts}/login`, permanent: false },
      { source: "/signin", destination: `${accounts}/login`, permanent: false },
      { source: "/sign-in", destination: `${accounts}/login`, permanent: false },
      { source: "/signup", destination: accounts, permanent: false },
      { source: "/sign-up", destination: accounts, permanent: false },
      { source: "/register", destination: accounts, permanent: false },
    ]
  },
}

export default nextConfig
