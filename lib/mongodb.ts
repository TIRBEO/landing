import { MongoClient } from "mongodb"

/**
 * Lazily-connected Mongo client. The app must not crash when
 * MONGODB_URI is absent (local dev / preview builds) — callers check
 * `getClient()` for null and fall back.
 */
let cached: Promise<MongoClient> | null = null

export function getClient(): Promise<MongoClient> | null {
  const uri = process.env.MONGODB_URI
  if (!uri) return null

  if (!cached) {
    cached = new MongoClient(uri).connect()
  }
  return cached
}
