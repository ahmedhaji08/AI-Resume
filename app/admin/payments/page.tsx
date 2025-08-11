"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AdminHeader } from "@/components/admin-header"
import { AdminGate } from "@/components/admin-gate"
import { Search, RefreshCcw, Download, CreditCard, TrendingUp, DollarSign, Calendar } from "lucide-react"

type Payment = {
  id: number
  userId: number
  stripePaymentId: string
  amount: string | number
  currency: string
  paymentStatus: string
  createdAt: string
  user?: {
    fullName: string
    email: string
  }
}

type PaymentStats = {
  totalRevenue: number
  totalPayments: number
  successfulPayments: number
  averageAmount: number
  revenueByMonth: { month: string; revenue: number }[]
  payments: Payment[]
}

export default function AdminPaymentsPage() {
  return (
    <AdminGate>
      <div className="min-h-screen bg-slate-50">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          <PaymentsContent />
        </main>
      </div>
    </AdminGate>
  )
}

function PaymentsContent() {
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  async function loadPayments() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/payments", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to load payments:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPayments()
  }, [])

  const filteredPayments =
    stats?.payments.filter(
      (payment) =>
        payment.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.stripePaymentId.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  function exportPayments() {
    if (!stats) return
    const csvContent = [
      ["ID", "User", "Email", "Amount", "Currency", "Status", "Stripe ID", "Date"].join(","),
      ...filteredPayments.map((payment) =>
        [
          payment.id,
          `"${payment.user?.fullName || "Unknown"}"`,
          payment.user?.email || "",
          typeof payment.amount === "string" ? Number.parseFloat(payment.amount) : payment.amount,
          payment.currency,
          payment.paymentStatus,
          payment.stripePaymentId,
          new Date(payment.createdAt).toISOString(),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "succeeded":
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
      case "canceled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Payment Management</h1>
          <p className="text-slate-600 mt-1">Track revenue and payment transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportPayments}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={loadPayments}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-2 text-slate-600">Loading payments...</p>
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">All time revenue</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPayments}</div>
                <p className="text-xs text-muted-foreground">Payment transactions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalPayments > 0 ? Math.round((stats.successfulPayments / stats.totalPayments) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">{stats.successfulPayments} successful</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Amount</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{stats.averageAmount.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Per transaction</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue by Month</CardTitle>
              <CardDescription>Monthly revenue breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.revenueByMonth.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No revenue data available</p>
                ) : (
                  stats.revenueByMonth.map(({ month, revenue }) => {
                    const maxRevenue = Math.max(...stats.revenueByMonth.map((r) => r.revenue), 1)
                    return (
                      <div key={month} className="flex items-center gap-3">
                        <div className="w-24 text-sm text-muted-foreground">{month}</div>
                        <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                          <div
                            className="bg-green-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${(revenue / maxRevenue) * 100}%` }}
                          />
                          <div className="absolute inset-0 flex items-center px-3 text-xs font-medium text-white">
                            ₹{revenue.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Payments</CardTitle>
              <CardDescription>Complete payment transaction history</CardDescription>
              <div className="flex items-center gap-4 mt-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Badge variant="secondary">{filteredPayments.length} payments</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Stripe ID</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{payment.user?.fullName || "Unknown"}</div>
                            <div className="text-sm text-slate-500">{payment.user?.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ₹
                            {(typeof payment.amount === "string"
                              ? Number.parseFloat(payment.amount)
                              : payment.amount
                            ).toFixed(2)}
                          </div>
                          <div className="text-sm text-slate-500 uppercase">{payment.currency}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(payment.paymentStatus)}>{payment.paymentStatus}</Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-slate-100 px-2 py-1 rounded">{payment.stripePaymentId}</code>
                        </TableCell>
                        <TableCell className="text-sm">{new Date(payment.createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Payment Data</h3>
            <p className="text-slate-600">Payment transactions will appear here once users make purchases.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
