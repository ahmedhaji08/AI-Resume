import { type NextRequest, NextResponse } from "next/server"
import { getPrisma } from "@/lib/prisma"
import { verifyJWT } from "@/lib/jwt"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.ok || !payload.payload || payload.payload.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const prisma = await getPrisma()
    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    // Get all payments with user info
    const payments = await prisma.payment.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Calculate stats
    const totalPayments = payments.length
    const successfulPayments: number = payments.filter((p: Payment) => p.paymentStatus === "succeeded").length
    interface PaymentUser {
        fullName: string
        email: string
    }

    interface Payment {
        paymentStatus: string
        amount: number | string
        createdAt: string | Date
        user: PaymentUser
    }

    const totalRevenue = payments
        .filter((p: Payment) => p.paymentStatus === "succeeded")
        .reduce((sum: number, p: Payment) => {
            const amount: number = typeof p.amount === "string" ? Number.parseFloat(p.amount) : p.amount
            return sum + (amount || 0)
        }, 0)

    const averageAmount = successfulPayments > 0 ? totalRevenue / successfulPayments : 0

    // Revenue by month
    interface RevenueByMonth {
      [month: string]: number
    }

    const revenueByMonth: RevenueByMonth = payments
      .filter((p: Payment) => p.paymentStatus === "succeeded")
      .reduce((acc: RevenueByMonth, payment: Payment) => {
        const month: string = new Date(payment.createdAt).toISOString().slice(0, 7) // YYYY-MM
        const amount: number = typeof payment.amount === "string" ? Number.parseFloat(payment.amount) : payment.amount
        acc[month] = (acc[month] || 0) + (amount || 0)
        return acc
      }, {})

    const revenueData = Object.entries(revenueByMonth)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month))

    return NextResponse.json({
      totalRevenue,
      totalPayments,
      successfulPayments,
      averageAmount,
      revenueByMonth: revenueData,
      payments,
    })
  } catch (error) {
    console.error("Admin payments API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
