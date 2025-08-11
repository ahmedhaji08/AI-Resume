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
    if (!jwtResult || !jwtResult.payload || jwtResult.payload.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const prisma = await getPrisma()
    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    // Get analytics stats
    const totalEvents = await prisma.analytics.count()
    const uniqueUsers = await prisma.analytics.groupBy({
      by: ["userId"],
      _count: { userId: true },
    })

    // Get top events
    const topEvents = await prisma.analytics.groupBy({
      by: ["eventType"],
      _count: { eventType: true },
      orderBy: { _count: { eventType: "desc" } },
      take: 10,
    })

    // Get recent events with user info
    const recentEvents = await prisma.analytics.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    interface TopEvent {
      eventType: string
      _count: {
        eventType: number
      }
    }

    interface UniqueUserGroup {
      userId: string
      _count: {
        userId: number
      }
    }

    interface RecentEventUser {
      fullName: string
      email: string
    }

    interface RecentEvent {
      // Add other analytics fields as needed
      user: RecentEventUser | null
      [key: string]: any
    }

    interface AnalyticsResponse {
      totalEvents: number
      uniqueUsers: number
      topEvents: {
        eventType: string
        count: number
      }[]
      recentEvents: RecentEvent[]
    }

    return NextResponse.json<AnalyticsResponse>({
      totalEvents,
      uniqueUsers: uniqueUsers.length,
      topEvents: topEvents.map((event: TopEvent) => ({
        eventType: event.eventType,
        count: event._count.eventType,
      })),
      recentEvents: recentEvents as RecentEvent[],
    })
  } catch (error) {
    console.error("Admin analytics API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
