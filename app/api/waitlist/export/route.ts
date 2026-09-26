import { promises as fs } from "node:fs"
import path from "node:path"
import { NextResponse } from "next/server"
import { getClient } from "@/lib/mongodb"
import { isAdmin } from "@/lib/security"

type Entry = { email: string; createdAt: string; source: string }

/** Minimal CSV field escaping (quotes, commas, newlines, formula injection). */
function csvField(value: string): string {
  const safe = value.replace(/^[=+\-@]/, "'")
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

/** CSV export of the full waitlist. Requires the admin cookie. */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let entries: Entry[] = []
  const clientPromise = getClient()

  try {
    if (clientPromise) {
      const client = await clientPromise
      const docs = await client
        .db("tirbeo")
        .collection("waitlist")
        .find({})
        .sort({ createdAt: -1 })
        .toArray()
      entries = docs.map((d) => ({
        email: d.email as string,
        createdAt: d.createdAt as string,
        source: d.source as string,
      }))
    } else {
      // File fallback (same as the signup route).
      const file = path.join(process.cwd(), "data", "waitlist.json")
      entries = JSON.parse(await fs.readFile(file, "utf8")) as Entry[]
    }
  } catch (err) {
    console.error("[waitlist:export]", err)
    return NextResponse.json({ error: "Could not export waitlist" }, { status: 500 })
  }

  const rows = [
    "email,created_at,source",
    ...entries.map((e) => [csvField(e.email), csvField(e.createdAt), csvField(e.source)].join(",")),
  ]
  const csv = rows.join("\n")

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="waitlist-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  })
}
