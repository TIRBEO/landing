/**
 * One-off cleanup: remove demo/test signups from the waitlist collection,
 * keeping only genuine addresses.
 *
 * Safety: runs a dry-run report by default; pass --apply to actually delete.
 */
import { MongoClient } from "mongodb"
import { readFileSync } from "node:fs"

const uri = readFileSync(new URL("../.env.local", import.meta.url), "utf8")
  .split("\n")
  .map((l) => l.match(/^MONGODB_URI="?([^"\n]*)"?/))
  .find(Boolean)?.[1]

if (!uri) {
  console.error("MONGODB_URI not found in .env.local")
  process.exit(1)
}

const apply = process.argv.includes("--apply")
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 })
await client.connect()
const col = client.db("tirbeo").collection("waitlist")

const all = await col.find({}, { projection: { _id: 0, email: 1, createdAt: 1, source: 1 } })
  .sort({ createdAt: 1 }).toArray()

// Test/demo markers seen in seeded runs.
const TEST_EMAIL = /@(example\.(com|org|net|test)|test\.com)$/i
const TEST_LOCAL =
  /^(?:dbg|pre[0-9]?|pre-ui|modal-dbg|api-test|prod-check|turnstile-no-token|nat-user|test)/i

const keep = []
const drop = []
for (const e of all) {
  const email = (e.email || "").toLowerCase()
  const local = email.split("@")[0] || ""
  ;(TEST_EMAIL.test(email) || TEST_LOCAL.test(local) ? drop : keep).push(e)
}

console.log(`total: ${all.length}  keep: ${keep.length}  drop: ${drop.length}\n`)
console.log("── KEEP ──")
for (const e of keep) console.log(`  ${e.email}  ${e.createdAt}`)
console.log("\n── DROP ──")
for (const e of drop) console.log(`  ${e.email}`)

if (apply && drop.length) {
  const emails = drop.map((e) => (e.email || "").toLowerCase())
  const res = await col.deleteMany({ email: { $in: emails } })
  console.log(`\ndeleted ${res.deletedCount} documents`)
  console.log(`remaining: ${await col.countDocuments()}`)
} else if (!apply) {
  console.log("\n(dry run — re-run with --apply to delete)")
}

await client.close()
