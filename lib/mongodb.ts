import { MongoClient } from "mongodb"

/**
 * Lazily-connected Mongo client. The app must not crash when
 * MONGODB_URI is absent (local dev / preview builds) — callers check
 * `getClient()` for null and fall back.
 *
 * Tuned for serverless/hosts with flaky DNS: fail fast instead of the
 * driver's default 30s hang, so requests return quickly.
 *
 * Critical serverless detail: if .connect() rejects (DNS blip on a cold
 * start), we must NOT keep the rejected promise cached — otherwise every
 * request for the function's lifetime fails. On failure we clear the
 * cache so the next request tries a fresh connection.
 */
const SERVER_SELECTION_TIMEOUT_MS = 8_000

let cached: Promise<MongoClient> | null = null

export function getClient(): Promise<MongoClient> | null {
  const uri = process.env.MONGODB_URI
  if (!uri) return null

  if (!cached) {
    const promise = new MongoClient(uri, {
      serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
      connectTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
    }).connect()

    // Don't leave an unhandled rejection warning if a caller is gone.
    promise.catch(() => {})

    cached = promise
      .then((client) => client)
      .catch((err) => {
        console.error("[mongodb] connection failed, will retry next request:", err?.code || err?.name)
        cached = null
        throw err
      })
  }
  return cached
}

/** Clear the cached client so the next request reconnects fresh. */
export function resetClient() {
  cached = null
}
