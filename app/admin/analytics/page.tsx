"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AdminHeader } from "@/components/admin-header"
import { AdminGate } from "@/components/admin-gate"
import { RefreshCcw, Download, TrendingUp, Activity, Users, FileText } from "lucide-react"

type AnalyticsEvent = {
  id: number
  userId: number
  eventType: string
  eventData: any
  createdAt: string
  user?: {
    fullName: string
    email: string
  }
}

type AnalyticsStats = {
  totalEvents: number
  uniqueUsers: number
  topEvents: { eventType: string; count: number }[]
  recentEvents: AnalyticsEvent[]
}

export default function AdminAnalyticsPage() {
  return (
    <AdminGate>
      <div className="min-h-screen bg-slate-50">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          <AnalyticsContent />
        </main>
      </div>
    </AdminGate>
  )
}

function AnalyticsContent() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadAnalytics() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/analytics", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to load analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  function exportAnalytics() {
    if (!stats) return
    const csvContent = [
      ["Event Type", "User", "Email", "Data", "Timestamp"].join(","),
      ...stats.recentEvents.map((event) =>
        [
          event.eventType,
          `"${event.user?.fullName || "Unknown"}"`,
          event.user?.email || "",
          `"${JSON.stringify(event.eventData)}"`,
          new Date(event.createdAt).toISOString(),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analytics-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "resume_created":
      case "resume_updated":
        return <FileText className="h-4 w-4" />
      case "user_signup":
      case "user_signin":
        return <Users className="h-4 w-4" />
      case "ai_generation":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case "resume_created":
        return "bg-green-100 text-green-800"
      case "resume_updated":
        return "bg-blue-100 text-blue-800"
      case "user_signup":
        return "bg-purple-100 text-purple-800"
      case "user_signin":
        return "bg-indigo-100 text-indigo-800"
      case "ai_generation":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-600 mt-1">Track user behavior and system usage</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportAnalytics}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={loadAnalytics}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-2 text-slate-600">Loading analytics...</p>
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEvents}</div>
                <p className="text-xs text-muted-foreground">All tracked events</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
                <p className="text-xs text-muted-foreground">Users with activity</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Event</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.topEvents[0]?.count || 0}</div>
                <p className="text-xs text-muted-foreground">{stats.topEvents[0]?.eventType || "No events"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Event Types</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.topEvents.length}</div>
                <p className="text-xs text-muted-foreground">Different event types</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Events</CardTitle>
                <CardDescription>Most frequent user actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topEvents.map((event, index) => (
                    <div key={event.eventType} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100">
                          {getEventIcon(event.eventType)}
                        </div>
                        <div>
                          <div className="font-medium capitalize">{event.eventType.replace("_", " ")}</div>
                          <div className="text-sm text-slate-500">#{index + 1} most frequent</div>
                        </div>
                      </div>
                      <Badge variant="secondary">{event.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest user events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentEvents.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${getEventColor(event.eventType)}`}
                      >
                        {getEventIcon(event.eventType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium capitalize">{event.eventType.replace("_", " ")}</div>
                        <div className="text-sm text-slate-500 truncate">{event.user?.fullName || "Unknown user"}</div>
                      </div>
                      <div className="text-xs text-slate-400">{new Date(event.createdAt).toLocaleTimeString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Events</CardTitle>
              <CardDescription>Complete event log</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.recentEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getEventIcon(event.eventType)}
                            <span className="capitalize">{event.eventType.replace("_", " ")}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{event.user?.fullName || "Unknown"}</div>
                            <div className="text-sm text-slate-500">{event.user?.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                            {JSON.stringify(event.eventData).slice(0, 50)}...
                          </code>
                        </TableCell>
                        <TableCell className="text-sm">{new Date(event.createdAt).toLocaleString()}</TableCell>
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
            <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Analytics Data</h3>
            <p className="text-slate-600">Analytics data will appear here once users start using the platform.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
