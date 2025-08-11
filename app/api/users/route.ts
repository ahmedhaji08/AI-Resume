import { NextResponse } from "next/server"
import { getPrisma } from "@/lib/prisma"

export async function GET() {
  try {
    const prisma = await getPrisma()
    const users = await prisma.user.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      select: { id: true, fullName: true, email: true, role: true, createdAt: true },
    })
    return NextResponse.json({ ok: true, users })
  } catch (e: any) {
    return new NextResponse(JSON.stringify({ ok: false, message: e?.message || "Failed to list users" }), {
      status: 500,
    })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const prisma = await getPrisma()
    const user = await prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        passwordHash: body.passwordHash ?? "set-a-proper-hash",
        role: body.role ?? "user",
      },
      select: { id: true, fullName: true, email: true, role: true },
    })
    return NextResponse.json({ ok: true, user })
  } catch (e: any) {
    return new NextResponse(JSON.stringify({ ok: false, message: e?.message || "Failed to create user" }), {
      status: 500,
    })
  }
}
