"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AdminUserMenu } from "./admin-user-menu"
import { Shield, Home } from "lucide-react"

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-zinc-900 text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10">
            <Shield className="h-4 w-4" />
          </div>
          <Link href="/admin" className="text-lg font-semibold tracking-tight">
            ElevateCV Admin
          </Link>
          <Badge variant="secondary" className="ml-2 bg-white/10 text-white">
            Administrative Panel
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden md:inline-flex bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Main Site
            </Link>
          </Button>
          <AdminUserMenu />
        </div>
      </div>
    </header>
  )
}
