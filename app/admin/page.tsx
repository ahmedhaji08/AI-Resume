"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin-header"
import { AdminDashboard } from "@/components/admin-dashboard"
import { AdminGate } from "@/components/admin-gate"

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState("overview")

  return (
    <AdminGate>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <AdminHeader activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="container mx-auto py-8">
          <AdminDashboard activeSection={activeSection} onSectionChange={setActiveSection} />
        </main>
      </div>
    </AdminGate>
  )
}
