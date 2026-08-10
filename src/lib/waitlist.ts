export type WaitlistPayload = {
  name: string;
  email: string;
  message?: string;
};

/**
 * Posts to the Tirbeo API newsletter endpoint (Supabase-backed subscribers
 * table). Falls back to localhost:3000 in development.
 */
export async function submitWaitlist(payload: WaitlistPayload): Promise<void> {
  const apiBase =
    (import.meta.env.VITE_API_URL as string | undefined) ||
    (typeof window !== "undefined" &&
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
      ? "http://localhost:3000"
      : "https://api.tirbeo.app");

  const res = await fetch(`${apiBase}/api/newsletter/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      message: payload.message || undefined,
      source: "landing",
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Subscription failed. Please try again.");
  }
}
