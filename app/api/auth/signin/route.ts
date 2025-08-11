import { NextResponse } from "next/server"
import { getPrisma } from "@/lib/prisma"
import { signJWT } from "@/lib/jwt"
import { compare } from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    const prisma = await getPrisma()
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
    const ok = await compare(password, user.passwordHash)
    if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
    const token = await signJWT({ uid: user.id, role: user.role })
    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    })
    res.headers.set("Set-Cookie", `session=${token}; Path=/; HttpOnly; SameSite=Lax; Secure`)
    return res
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Signin failed" }, { status: 500 })
  }
}
