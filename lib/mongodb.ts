import { MongoClient } from "mongodb"

/**
 * Lazily-connected Mongo client. The app must not crash when
 * MONGODB_URI is absent (local dev / preview builds) — callers check
 * `getClient()` for null and fall back.
 *
 * Tuned for serverless/hosts with flaky DNS: fail fast instead of the
 * driver's default 30s hang, so requests return quickly and the route
 * can use its file fallback.
 */
const SERVER_SELECTION_TIMEOUT_MS = 8_000

let cached: Promise<MongoClient> | null = null

export function getClient(): Promise<MongoClient> | null {
  const uri = process.env.MONGODB_URI
  if (!uri) return null

  if (!cached) {
    cached = new MongoClient(uri, {
      serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
      connectTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
      // Keep trying to reconnect in the background; requests that come
      // in while disconnected use the file fallback instead of hanging.
      retryWrites: true,
    }).connect()
  }
  return cached
}

/** True when the cached client exists but is currently unreachable. */
export function resetClient() {
  cached = null
}
