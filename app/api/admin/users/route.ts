import { type NextRequest, NextResponse } from "next/server"
import { getPrisma } from "@/lib/prisma"
import { verifyJWT } from "@/lib/jwt"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const jwtResult = await verifyJWT(token)
    if (!jwtResult || !jwtResult.ok || !jwtResult.payload || jwtResult.payload.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const prisma = await getPrisma()
    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            resumes: true,
            linkedinProfiles: true,
            payments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const total = await prisma.user.count()

    return NextResponse.json({ users, total })
  } catch (error) {
    console.error("Admin users API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
