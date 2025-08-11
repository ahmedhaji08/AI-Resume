"use client"

import { useEffect } from "react"

// This component runs once to capture "demo" checkout successes from URL params into localStorage for admin demo.
export function ClientEffects() {
  useEffect(() => {
    try {
      const url = new URL(window.location.href)
      const isSuccess = url.searchParams.get("checkout") === "success"
      const plan = url.searchParams.get("plan") || "pro"
      const isDemo = url.searchParams.get("demo") === "1"
      if (isSuccess) {
        const key = "demo_payments"
        const raw = localStorage.getItem(key)
        const arr = raw ? (JSON.parse(raw) as any[]) : []
        arr.push({
          id: crypto.randomUUID(),
          plan,
          amountCents: plan === "team" ? 990000 : 390000, // paise
          status: isDemo ? "demo" : "succeeded",
          ts: Date.now(),
        })
        localStorage.setItem(key, JSON.stringify(arr))
      }
    } catch {}
  }, [])

  return null
}
