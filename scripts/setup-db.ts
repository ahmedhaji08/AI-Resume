/// <reference lib="dom" />
/**
 * Node.js script to apply the provided SQL schema to your Postgres database.
 * Usage (locally):
 *   1) Set DATABASE_URL in env
 *   2) node --loader ts-node/esm scripts/setup-db.ts
 *
 * In this v0 preview, you can also run this script block directly if supported.
 */
import { Client } from "pg"

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error("DATABASE_URL is not set.")
    process.exit(1)
  }

  // Fetch the SQL file from the project filesystem
  const res = await fetch("/scripts/sql/ai_resume-schema.sql")
  if (!res.ok) {
    throw new Error(`Failed to load SQL file: ${res.status} ${res.statusText}`)
  }
  const sql = await res.text()

  const client = new Client({ connectionString: url })
  await client.connect()
  try {
    console.log("Applying schema...")
    await client.query(sql)
    console.log("Done.")
  } finally {
    await client.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
