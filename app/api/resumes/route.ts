import { NextResponse } from "next/server"
import { getPrisma } from "@/lib/prisma"
import { verifyJWT } from "@/lib/jwt"

async function currentUserId(req: Request) {
  const cookie = (req.headers.get("cookie") || "")
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("session="))
  const token = cookie?.split("=")[1]
  const { ok, payload } = await verifyJWT(token)
  return ok ? (payload.uid as number) : null
}

export async function GET(req: Request) {
  const uid = await currentUserId(req)
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const prisma = await getPrisma()
  const resumes = await prisma.resume.findMany({ where: { userId: uid }, orderBy: { lastUpdated: "desc" } })
  return NextResponse.json({ resumes })
}

export async function POST(req: Request) {
  try {
    const uid = await currentUserId(req)
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const body = await req.json()
    const prisma = await getPrisma()
    const created = await prisma.resume.create({
      data: {
        userId: uid,
        aiGeneratedContent: typeof body.content === "string" ? body.content : JSON.stringify(body.content ?? {}),
        uploadedDocument: body.uploadedDocument || null,
        templateUsed: body.template || "linkedin-clean",
      },
    })
    return NextResponse.json({ ok: true, resume: created })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to save resume" }, { status: 500 })
  }
}
