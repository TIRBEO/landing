import { useEffect, useState } from "react";

export interface LandingConfig {
  brand: string;
  headline: string;
  subhead: string;
  status: string;
  videoUrl: string;
  loginUrl: string;
  docsUrl: string;
  supportUrl: string;
  waitlistAnchor: string;
}

export const DEFAULT_CONFIG: LandingConfig = {
  brand: "Tirbeo",
  headline: "Make technology human.",
  subhead:
    "Tirbeo builds people-first products and experiences — cleaner workspaces, clearer conversations, and private-by-default design.",
  status: "All systems operational. Your workspace is ready.",
  videoUrl: "",
  loginUrl: "https://accounts.tirbeo.app/login",
  docsUrl: "https://support.tirbeo.app/docs",
  supportUrl: "https://support.tirbeo.app",
  waitlistAnchor: "#waitlist",
};

const CACHE_KEY = "tirbeo:landing_config";
const CACHE_TTL_MS = 1000 * 60 * 5; // 5 minutes

function apiBase(): string {
  const url = import.meta.env.VITE_API_URL as string | undefined;
  if (url) return url.replace(/\/$/, "");
  if (typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    return "http://localhost:3000";
  }
  return "https://api.tirbeo.app";
}

export function useLandingConfig(): LandingConfig {
  const [cfg, setCfg] = useState<LandingConfig>(() => {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const { ts, data } = JSON.parse(raw);
        if (Date.now() - ts < CACHE_TTL_MS) return { ...DEFAULT_CONFIG, ...data };
      }
    } catch {}
    return DEFAULT_CONFIG;
  });

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${apiBase()}/api/public/landing-config`, {
          signal: controller.signal,
          headers: { "Cache-Control": "no-cache" },
        });
        if (!res.ok) return;
        const json = (await res.json()) as Partial<LandingConfig>;
        const merged: LandingConfig = { ...DEFAULT_CONFIG, ...json };
        if (!cancelled) {
          setCfg(merged);
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: merged }));
          } catch {}
        }
      } catch {}
    })();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return cfg;
}
