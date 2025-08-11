"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AdminHeader } from "@/components/admin-header"
import { AdminGate } from "@/components/admin-gate"
import { Search, RefreshCcw, Download, Edit, Trash2 } from "lucide-react"

type User = {
  id: number
  fullName: string
  email: string
  role: string
  createdAt: string
  _count?: {
    resumes: number
    linkedinProfiles: number
    payments: number
  }
}

export default function AdminUsersPage() {
  return (
    <AdminGate>
      <div className="min-h-screen bg-slate-50">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          <UsersContent />
        </main>
      </div>
    </AdminGate>
  )
}

function UsersContent() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [totalUsers, setTotalUsers] = useState(0)

  async function loadUsers() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
        setTotalUsers(data.total || 0)
      }
    } catch (error) {
      console.error("Failed to load users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  function exportUsers() {
    const csvContent = [
      ["ID", "Name", "Email", "Role", "Resumes", "Profiles", "Payments", "Created"].join(","),
      ...filteredUsers.map((user) =>
        [
          user.id,
          `"${user.fullName}"`,
          user.email,
          user.role,
          user._count?.resumes || 0,
          user._count?.linkedinProfiles || 0,
          user._count?.payments || 0,
          new Date(user.createdAt).toLocaleDateString(),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600 mt-1">Manage all registered users and their activities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportUsers}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={loadUsers}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>All registered users</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-blue-600">{totalUsers}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
            <CardDescription>Users with resumes</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-green-600">
            {users.filter((u) => (u._count?.resumes || 0) > 0).length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Premium Users</CardTitle>
            <CardDescription>Users with payments</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-purple-600">
            {users.filter((u) => (u._count?.payments || 0) > 0).length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Admin Users</CardTitle>
            <CardDescription>Administrative accounts</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-orange-600">
            {users.filter((u) => u.role === "admin").length}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Complete list of registered users</CardDescription>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary">{filteredUsers.length} users</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div>
              <p className="mt-2 text-slate-600">Loading users...</p>
            </div>
          ) : (
            <div className="rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.fullName}</div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <div>{user._count?.resumes || 0} resumes</div>
                          <div>{user._count?.linkedinProfiles || 0} profiles</div>
                          <div>{user._count?.payments || 0} payments</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
