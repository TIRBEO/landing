import { NextResponse } from "next/server"
import { getClient, resetClient } from "@/lib/mongodb"
import { isAdmin } from "@/lib/security"

/**
 * Returns every waitlist entry, newest first. Requires the admin
 * cookie set by POST /api/waitlist/admin.
 */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const clientPromise = getClient()
  if (!clientPromise) {
    return NextResponse.json({ error: "Storage unavailable" }, { status: 500 })
  }

  try {
    const client = await clientPromise
    const docs = await client
      .db("tirbeo")
      .collection("waitlist")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      count: docs.length,
      entries: docs.map((d) => ({
        email: d.email as string,
        createdAt: d.createdAt as string,
        source: d.source as string,
      })),
    })
  } catch (err) {
    // Transient Mongo errors (DNS blips, cold starts) happen — surface a
    // retryable status and reset the cached client so the next request
    // reconnects instead of failing on a dead handle.
    console.error("[waitlist:list]", err)
    resetClient()
    return NextResponse.json(
      { error: "Could not load waitlist — please refresh to retry." },
      { status: 503, headers: { "Retry-After": "2" } },
    )
  }
}
