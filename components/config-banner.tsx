"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Database, Key, Shield, Zap } from "lucide-react"

interface ConfigStatus {
  ai: { configured: boolean; mode: string }
  stripe: { configured: boolean }
  session: { configured: boolean }
  database: { configured: boolean; connected: boolean }
  demo: boolean
}

export function ConfigBanner() {
  const [status, setStatus] = useState<ConfigStatus | null>(null)

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus(null))
  }, [])

  if (!status?.demo) return null

  const issues = []
  if (!status.ai.configured) issues.push("AI API key")
  if (!status.stripe.configured) issues.push("Stripe secret key")
  if (!status.session.configured) issues.push("Session secret")
  if (!status.database.configured) issues.push("Database URL")
  else if (!status.database.connected) issues.push("Database connection")

  return (
    <Alert className="mb-6 border-amber-200 bg-amber-50">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        <strong>Demo Mode:</strong> Missing configuration for {issues.join(", ")}. Add these environment variables in
        your Vercel project settings:
        <div className="mt-2 space-y-1 text-sm">
          {!status.ai.configured && (
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3" />
              <code>XAI_API_KEY</code> or <code>OPENAI_API_KEY</code>
            </div>
          )}
          {!status.stripe.configured && (
            <div className="flex items-center gap-2">
              <Key className="h-3 w-3" />
              <code>STRIPE_SECRET_KEY</code>
            </div>
          )}
          {!status.session.configured && (
            <div className="flex items-center gap-2">
              <Shield className="h-3 w-3" />
              <code>SESSION_SECRET</code>
            </div>
          )}
          {!status.database.configured && (
            <div className="flex items-center gap-2">
              <Database className="h-3 w-3" />
              <code>DATABASE_URL</code> (Postgres connection string)
            </div>
          )}
          {status.database.configured && !status.database.connected && (
            <div className="flex items-center gap-2">
              <Database className="h-3 w-3" />
              Database connection failed - check your DATABASE_URL
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}
