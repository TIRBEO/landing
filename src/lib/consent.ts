/* ══════════════════════════════════════════════════════════════════════════
   TIRBEO — cookie consent helpers (per-category, backwards compatible)
   ══════════════════════════════════════════════════════════════════════════ */

export const CONSENT_COOKIE = "tirbeo_consent";
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/** Consent categories. "essential" is always on and cannot be disabled. */
export type ConsentCategory = "essential" | "analytics" | "preferences";

export const ALL_CATEGORIES: ConsentCategory[] = ["essential", "analytics", "preferences"];

export const CATEGORY_META: Record<
  ConsentCategory,
  { label: string; description: string; locked?: boolean }
> = {
  essential: {
    label: "Essential",
    description: "Required for the site to work — security and core functionality.",
    locked: true,
  },
  analytics: {
    label: "Analytics",
    description: "Helps us understand aggregate usage so we can improve the site.",
  },
  preferences: {
    label: "Preferences",
    description: "Remembers choices you make, like language and display settings.",
  },
};

function readCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  return match ? match.split("=")[1] : null;
}

function writeCookie(value: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${CONSENT_MAX_AGE}; SameSite=Lax`;
}

/**
 * Read which consent categories are enabled.
 * Handles both the legacy single values ("all" / "essential") and the new
 * comma-separated category list. Returns [] when consent is unset.
 *
 * NOTE: consent is recorded for compliance but the site currently loads no
 * analytics/tracking scripts. If third-party analytics are added later, gate
 * them behind `categories.includes("analytics")` before loading.
 */
export function getConsentCategories(): ConsentCategory[] {
  const value = readCookie();
  if (value === null) return [];
  if (value === "all") return [...ALL_CATEGORIES];
  if (value === "essential") return ["essential"];
  // New format: "essential,analytics,preferences"
  const cats = value
    .split(",")
    .map((c) => c.trim())
    .filter((c): c is ConsentCategory => (ALL_CATEGORIES as string[]).includes(c));
  if (cats.length === 0) return [];
  // "essential" is always included.
  return cats.includes("essential") ? cats : ["essential", ...cats];
}

/** Record which consent categories the user accepted. */
export function setConsentCategories(categories: ConsentCategory[]): void {
  const cats = categories.includes("essential")
    ? categories
    : ["essential", ...categories];
  // Store the canonical list.
  writeCookie(cats.join(","));
}

