"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { StatCard } from "@/components/stat-card"
import {
  Download,
  RefreshCcw,
  Search,
  Users,
  CreditCard,
  FileText,
  UserCheck,
  TrendingUp,
  Activity,
  DollarSign,
} from "lucide-react"

type Overview = {
  counts: {
    users: number
    resumes: number
    profiles: number
    payments: number
    analytics: number
  }
  allUsers: {
    id: number
    fullName: string
    email: string
    role: string
    createdAt: string
  }[]
  allPayments: {
    id: number
    userId: number
    amount: string | number
    currency: string
    paymentStatus: string
    createdAt: string
    user?: { fullName: string; email: string }
  }[]
  analytics: {
    dailySignups: { date: string; count: number }[]
    monthlyRevenue: { month: string; revenue: number }[]
    topFeatures: { feature: string; usage: number }[]
  }
}

interface AdminDashboardProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
}

export function AdminDashboard({ activeSection = "overview", onSectionChange }: AdminDashboardProps) {
  const [data, setData] = useState<Overview | null>(null)
  const [loading, setLoading] = useState(true)
  const [userSearch, setUserSearch] = useState("")
  const [paymentSearch, setPaymentSearch] = useState("")

  async function load() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/overview", { cache: "no-store" })
      if (res.ok) {
        const d = await res.json()
        setData(d)
      } else {
        setData(null)
      }
    } catch (error) {
      console.error("Failed to load admin data:", error)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function exportUsersCsv() {
    if (!data?.allUsers) return
    const headers = ["ID", "Name", "Email", "Role", "Created At"]
    const rows = data.allUsers.map((u) => [u.id, u.fullName, u.email, u.role, new Date(u.createdAt).toLocaleString()])
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    downloadCsv(csv, "users.csv")
  }

  function exportPaymentsCsv() {
    if (!data?.allPayments) return
    const headers = ["ID", "User ID", "User Name", "Amount", "Currency", "Status", "Created At"]
    const rows = data.allPayments.map((p) => [
      p.id,
      p.userId,
      p.user?.fullName || "Unknown",
      typeof p.amount === "string" ? p.amount : p.amount.toString(),
      p.currency,
      p.paymentStatus,
      new Date(p.createdAt).toLocaleString(),
    ])
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    downloadCsv(csv, "payments.csv")
  }

  function downloadCsv(content: string, filename: string) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredUsers =
    data?.allUsers?.filter(
      (u) =>
        u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()),
    ) || []

  const filteredPayments =
    data?.allPayments?.filter(
      (p) =>
        p.user?.fullName?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
        p.user?.email?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
        p.paymentStatus.toLowerCase().includes(paymentSearch.toLowerCase()),
    ) || []

  const totalRevenue =
    data?.allPayments?.reduce((sum, p) => {
      const amt = typeof p.amount === "string" ? Number.parseFloat(p.amount) : p.amount
      return sum + (amt || 0)
    }, 0) || 0

  const revenueByDay =
    data?.allPayments?.reduce((acc: Record<string, number>, p) => {
      const date = new Date(p.createdAt).toISOString().slice(0, 10)
      const amt = typeof p.amount === "string" ? Number.parseFloat(p.amount) : p.amount
      acc[date] = (acc[date] || 0) + (amt || 0)
      return acc
    }, {}) || {}

  const revenueData = Object.entries(revenueByDay)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 7)
    .map(([date, revenue]) => ({ date, revenue }))

  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue), 1)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading admin data...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error loading data</CardTitle>
          <CardDescription>Failed to load admin dashboard data</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={load} variant="outline">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeSection === "overview" ? "default" : "ghost"}
          onClick={() => onSectionChange?.("overview")}
        >
          <Activity className="mr-2 h-4 w-4" />
          Overview
        </Button>
        <Button
          variant={activeSection === "analytics" ? "default" : "ghost"}
          onClick={() => onSectionChange?.("analytics")}
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Analytics
        </Button>
        <Button variant={activeSection === "users" ? "default" : "ghost"} onClick={() => onSectionChange?.("users")}>
          <Users className="mr-2 h-4 w-4" />
          Users ({data.counts.users})
        </Button>
        <Button
          variant={activeSection === "payments" ? "default" : "ghost"}
          onClick={() => onSectionChange?.("payments")}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Payments ({data.counts.payments})
        </Button>
      </div>

      {/* Overview Section */}
      {activeSection === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Users" value={data.counts.users} description="Registered users" icon={<Users />} />
            <StatCard
              title="Total Resumes"
              value={data.counts.resumes}
              description="Created resumes"
              icon={<FileText />}
            />
            <StatCard
              title="Total Revenue"
              value={`₹${totalRevenue.toFixed(2)}`}
              description="All time revenue"
              icon={<DollarSign />}
            />
            <StatCard
              title="Active Profiles"
              value={data.counts.profiles}
              description="LinkedIn profiles"
              icon={<UserCheck />}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {revenueData.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No revenue data available</p>
                  ) : (
                    revenueData.map(({ date, revenue }) => (
                      <div key={date} className="flex items-center gap-3">
                        <div className="w-20 text-xs text-muted-foreground">{new Date(date).toLocaleDateString()}</div>
                        <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-300"
                            style={{ width: `${(revenue / maxRevenue) * 100}%` }}
                          />
                          <div className="absolute inset-0 flex items-center px-2 text-xs font-medium text-primary-foreground">
                            ₹{revenue.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest users and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recent Users</h4>
                    <div className="space-y-1">
                      {data.allUsers.slice(0, 5).map((u) => (
                        <div key={u.id} className="flex justify-between text-sm">
                          <span className="font-medium">{u.fullName}</span>
                          <span className="text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recent Payments</h4>
                    <div className="space-y-1">
                      {data.allPayments.slice(0, 5).map((p) => (
                        <div key={p.id} className="flex justify-between text-sm">
                          <span className="font-medium">
                            ₹{(typeof p.amount === "string" ? Number.parseFloat(p.amount) : p.amount)?.toFixed(2)}
                          </span>
                          <span className="text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Analytics Section */}
      {activeSection === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatCard
              title="Daily Signups"
              value={data.analytics?.dailySignups?.slice(-1)[0]?.count || 0}
              description="Today's new users"
              icon={<Users />}
            />
            <StatCard
              title="Monthly Revenue"
              value={`₹${data.analytics?.monthlyRevenue?.slice(-1)[0]?.revenue?.toFixed(2) || "0.00"}`}
              description="This month's revenue"
              icon={<DollarSign />}
            />
            <StatCard title="Conversion Rate" value="12.5%" description="Visitors to users" icon={<TrendingUp />} />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Daily signups over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(data.analytics?.dailySignups || []).slice(-7).map(({ date, count }) => (
                    <div key={date} className="flex items-center gap-3">
                      <div className="w-20 text-xs text-muted-foreground">{new Date(date).toLocaleDateString()}</div>
                      <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${(count / Math.max(...(data.analytics?.dailySignups || []).map((d) => d.count), 1)) * 100}%`,
                          }}
                        />
                        <div className="absolute inset-0 flex items-center px-2 text-xs font-medium text-white">
                          {count} users
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature Usage</CardTitle>
                <CardDescription>Most popular features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(data.analytics?.topFeatures || []).map(({ feature, usage }) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="w-24 text-xs font-medium">{feature}</div>
                      <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                        <div
                          className="bg-green-500 h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${(usage / Math.max(...(data.analytics?.topFeatures || []).map((f) => f.usage), 1)) * 100}%`,
                          }}
                        />
                        <div className="absolute inset-0 flex items-center px-2 text-xs font-medium text-white">
                          {usage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Users Section */}
      {activeSection === "users" && (
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Complete user database ({data.counts.users} total)</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Button variant="outline" size="sm" onClick={exportUsersCsv}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={load}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>#{u.id}</TableCell>
                      <TableCell className="font-medium">{u.fullName}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            u.role === "admin" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {u.role}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(u.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredUsers.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">No users found matching your search.</div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payments Section */}
      {activeSection === "payments" && (
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>All Payments</CardTitle>
              <CardDescription>
                Complete payment history ({data.counts.payments} total) - ₹{totalRevenue.toFixed(2)} revenue
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  value={paymentSearch}
                  onChange={(e) => setPaymentSearch(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Button variant="outline" size="sm" onClick={exportPaymentsCsv}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={load}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>#{p.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{p.user?.fullName || "Unknown User"}</div>
                          <div className="text-sm text-muted-foreground">{p.user?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{(typeof p.amount === "string" ? Number.parseFloat(p.amount) : p.amount)?.toFixed(2)}{" "}
                        {p.currency}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            p.paymentStatus === "completed"
                              ? "bg-green-100 text-green-800"
                              : p.paymentStatus === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {p.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredPayments.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">No payments found matching your search.</div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
