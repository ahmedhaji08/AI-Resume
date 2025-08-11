import { NextResponse } from "next/server"

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.headers.set("Set-Cookie", `session=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`)
  return res
}
