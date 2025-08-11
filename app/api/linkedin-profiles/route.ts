import { NextResponse } from "next/server"
import { getPrisma } from "@/lib/prisma"
import { verifyJWT } from "@/lib/jwt"

async function uidFromReq(req: Request) {
  const cookie = (req.headers.get("cookie") || "")
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("session="))
  const token = cookie?.split("=")[1]
  const { ok, payload } = await verifyJWT(token)
  return ok ? (payload.uid as number) : null
}

export async function GET(req: Request) {
  const uid = await uidFromReq(req)
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const prisma = await getPrisma()
  const profile = await prisma.linkedInProfile.findUnique({ where: { userId: uid } })
  return NextResponse.json({ profile })
}

export async function POST(req: Request) {
  const uid = await uidFromReq(req)
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const body = await req.json()
    const prisma = await getPrisma()
    const upsert = await prisma.linkedInProfile.upsert({
      where: { userId: uid },
      update: {
        headline: body.headline ?? null,
        summary: body.summary ?? null,
        experience: body.experience ?? null,
        education: body.education ?? null,
        skills: body.skills ?? [],
      },
      create: {
        userId: uid,
        headline: body.headline ?? null,
        summary: body.summary ?? null,
        experience: body.experience ?? null,
        education: body.education ?? null,
        skills: body.skills ?? [],
      },
    })
    return NextResponse.json({ ok: true, profile: upsert })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to save profile" }, { status: 500 })
  }
}
