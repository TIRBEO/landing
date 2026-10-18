/**
 * Where signing in actually happens.
 *
 * The landing site owns no auth. Login lives in the accounts app, exactly as
 * it does for every other Tirbeo surface (see `apps/myprofile/app/login/
 * login-shell.tsx` and `apps/myprofile/proxy.ts`), so a "Log in" click here
 * must hand the visitor off to that app rather than pointing at something
 * that does not exist. (The previous CTA was `href="/#join"` — an anchor with
 * no target on the page, so the click did nothing at all.)
 *
 * Env convention copied from myprofile, including its two guards:
 *   • `NEXT_PUBLIC_ACCOUNTS_URL` is the explicit override;
 *   • a loopback value baked into a production build must never ship as a
 *     link — production always lands on the canonical host;
 *   • the canonical host is the last resort, never an empty href.
 */

const CANONICAL_ACCOUNTS_ORIGIN = "https://accounts.tirbeo.com"

/** Accounts origin, safe to use in a production bundle. */
export function accountsOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_ACCOUNTS_URL?.trim().replace(/\/+$/, "")
  if (!raw) return CANONICAL_ACCOUNTS_ORIGIN
  const loopback = /localhost|127\.0\.0\.1/.test(raw)
  if (loopback && process.env.NODE_ENV === "production") return CANONICAL_ACCOUNTS_ORIGIN
  return raw
}

/**
 * The accounts host as a visitor-facing label, so the button never names
 * `accounts.tirbeo.com` while pointing somewhere else (a dev override, a
 * preview alias). Falls back to the canonical host if the URL is malformed.
 */
export function accountsHost(): string {
  try {
    return new URL(accountsOrigin()).host
  } catch {
    return new URL(CANONICAL_ACCOUNTS_ORIGIN).host
  }
}

/**
 * The accounts login URL.
 * @param returnTo absolute URL the visitor should land back on after signing
 *                 in (the page they were on). Omitted when unknown — the
 *                 accounts app then drops them on its own default destination.
 */
export function signInUrl(returnTo?: string): string {
  const base = `${accountsOrigin()}/login`
  return returnTo ? `${base}?redirect_to=${encodeURIComponent(returnTo)}` : base
}
