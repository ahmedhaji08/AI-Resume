import { NextResponse } from "next/server"
import { verifyJWT } from "@/lib/jwt"
import { getPrisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const cookie = (req.headers.get("cookie") || "")
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("session="))
  const token = cookie?.split("=")[1]
  const { ok, payload } = await verifyJWT(token)
  if (!ok) return NextResponse.json({ user: null })
  const prisma = await getPrisma()
  const user = await prisma.user.findUnique({
    where: { id: payload.uid },
    select: { id: true, fullName: true, email: true, role: true },
  })
  return NextResponse.json({ user })
}
