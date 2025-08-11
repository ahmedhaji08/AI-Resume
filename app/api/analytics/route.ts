import { NextResponse } from "next/server"
import { getPrisma } from "@/lib/prisma"
import { verifyJWT } from "@/lib/jwt"

async function uid(req: Request) {
  const cookie = (req.headers.get("cookie") || "")
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("session="))
  const token = cookie?.split("=")[1]
  const { ok, payload } = await verifyJWT(token)
  return ok ? (payload.uid as number) : null
}

export async function POST(req: Request) {
  const userId = await uid(req)
  const prisma = await getPrisma()
  try {
    const { action, details } = await req.json()
    await prisma.analytics.create({ data: { userId: userId ?? 0, action, details: details ?? null } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Failed to record" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const userId = await uid(req)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const prisma = await getPrisma()
  const logs = await prisma.analytics.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 100 })
  return NextResponse.json({ logs })
}
