"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading")

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" })
        const data = await res.json()
        if (data?.user?.role === "admin") setState("ok")
        else setState("denied")
      } catch {
        setState("denied")
      }
    })()
  }, [])

  if (state === "loading") return <div className="text-sm text-zinc-500">Verifying admin credentials...</div>

  if (state === "denied")
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900">
            <ShieldAlert className="h-5 w-5" />
            Administrative Access Required
          </CardTitle>
          <CardDescription className="text-amber-700">
            This area is restricted to authorized administrators only. Please sign in with your admin credentials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="bg-amber-900 hover:bg-amber-800">
            <Link href="/admin/login?next=/admin">Admin Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    )

  return <>{children}</>
}
