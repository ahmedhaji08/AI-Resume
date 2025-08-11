import { NextResponse } from "next/server"
import { getPrisma } from "@/lib/prisma"
import { verifyJWT } from "@/lib/jwt"

export async function GET(req: Request) {
  const cookie = (req.headers.get("cookie") || "")
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("session="))
  const token = cookie?.split("=")[1]
  const { ok, payload } = await verifyJWT(token)
  if (!ok || payload.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const prisma = await getPrisma()

  const [users, resumes, profiles, payments, analytics, allUsers, allPayments] = await Promise.all([
    prisma.user.count(),
    prisma.resume.count(),
    prisma.linkedInProfile.count(),
    prisma.payment.count(),
    prisma.analytics.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, fullName: true, email: true, role: true, createdAt: true },
    }),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
      },
    }),
  ])

  return NextResponse.json({
    counts: { users, resumes, profiles, payments, analytics },
    allUsers,
    allPayments,
  })
}
