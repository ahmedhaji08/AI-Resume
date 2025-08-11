import { NextResponse } from "next/server"
import { getPrisma } from "@/lib/prisma"

export async function GET() {
  try {
    const prisma = await getPrisma()

    // Try simple counts to validate schema
    const [users, resumes, profiles, payments, analytics] = await Promise.all([
      prisma.user.count(),
      prisma.resume.count(),
      prisma.linkedInProfile.count(),
      prisma.payment.count(),
      prisma.analytics.count(),
    ])

    return NextResponse.json({
      ok: true,
      counts: { users, resumes, profiles, payments, analytics },
    })
  } catch (err: any) {
    // Helpful diagnostics if Prisma client isn't generated or DB is unreachable
    return new NextResponse(
      JSON.stringify({
        ok: false,
        message:
          err?.message ||
          "DB status failed. Make sure DATABASE_URL is set and Prisma Client is generated (npx prisma generate).",
      }),
      { status: 500 },
    )
  }
}
