import { NextResponse } from "next/server"
import { getPrisma } from "@/lib/prisma"
import { signJWT } from "@/lib/jwt"
import { hash } from "bcryptjs"
import { isDatabaseConfigured } from "@/lib/env"

export async function POST(req: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        {
          error: "Database not configured. Please add DATABASE_URL to your environment variables.",
        },
        { status: 503 },
      )
    }

    const { fullName, email, password, isAdmin } = await req.json()
    if (!fullName || !email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    const prisma = await getPrisma()
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    const passwordHash = await hash(password, 10)
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        role: isAdmin ? "admin" : "user",
      },
      select: { id: true, fullName: true, email: true, role: true },
    })
    const token = await signJWT({ uid: user.id, role: user.role })
    const res = NextResponse.json({ ok: true, user })
    res.headers.set("Set-Cookie", `session=${token}; Path=/; HttpOnly; SameSite=Lax; Secure`)
    return res
  } catch (e: any) {
    if (e.message?.includes("DATABASE_URL")) {
      return NextResponse.json(
        {
          error: "Database connection failed. Please check your DATABASE_URL configuration.",
        },
        { status: 503 },
      )
    }
    return NextResponse.json({ error: e?.message || "Signup failed" }, { status: 500 })
  }
}
