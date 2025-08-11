"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  ShieldCheck,
  FileText,
  LineChart,
  CreditCard,
  Upload,
  Users,
  Bot,
  Linkedin,
  CheckCircle2,
  Sparkles,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { UserPanel } from "@/components/user-panel"
import { SiteHeader } from "@/components/site-header"
import { AnimatedSection } from "@/components/animated-section"
import { TiltCard } from "@/components/tilt-card"
import { BackgroundOrbs } from "@/components/background-orbs"
import { motion } from "framer-motion"

export default function Page() {
  const [demoMode, setDemoMode] = useState(false)
  const [status, setStatus] = useState<{ hasAI: boolean; hasStripe: boolean; provider: string | null } | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch("/api/status", { cache: "no-store" })
        const s = await res.json()
        if (!active) return
        setStatus({ hasAI: s.hasAI ?? s.ai, hasStripe: s.hasStripe ?? s.payments, provider: s.provider ?? null })
        setDemoMode(!((s.hasAI ?? s.ai) && (s.hasStripe ?? s.payments)))
      } catch {
        if (!active) return
        setStatus({ hasAI: false, hasStripe: false, provider: null })
        setDemoMode(true)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const features = useMemo(
    () => [
      { icon: Bot, title: "AI Resume Builder", desc: "Generate tailored, ATS-friendly resumes in minutes." },
      { icon: Linkedin, title: "LinkedIn Integration", desc: "Import your LinkedIn data or PDF to accelerate setup." },
      { icon: Upload, title: "Document Upload", desc: "Attach existing resumes, cover letters, and certificates." },
      { icon: Users, title: "User Management", desc: "Admin tools to manage accounts and permissions." },
      { icon: LineChart, title: "Analytics & Reports", desc: "Track usage, conversion, and performance with charts." },
      { icon: CreditCard, title: "Payment Tracking", desc: "Integrated checkout and reconciliation workflows." },
    ],
    [],
  )

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <SiteHeader />

      {demoMode && (
        <div className="mx-auto max-w-6xl px-4 pt-4">
          <Alert>
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Demo Mode</AlertTitle>
            <AlertDescription>
              {status ? (
                <>
                  AI {status.hasAI ? `enabled${status.provider ? ` (${status.provider})` : ""}` : "disabled"}; Payments{" "}
                  {status.hasStripe ? "enabled" : "disabled"}. Add XAI_API_KEY or OPENAI_API_KEY, and STRIPE_SECRET_KEY
                  to enable live flows.
                </>
              ) : (
                "Detecting configuration..."
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Hero */}
      <section className="relative">
        <BackgroundOrbs />
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <AnimatedSection>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-zinc-600">
                <Sparkles className="h-3.5 w-3.5" />
                AI Resume & LinkedIn, crafted for professionals
              </div>
              <h1 className="mt-4 bg-gradient-to-b from-zinc-950 to-zinc-700 bg-clip-text text-4xl font-semibold tracking-tight text-transparent md:text-5xl">
                Elevate your career with AI‑driven resumes and LinkedIn makeovers
              </h1>
              <p className="mt-4 text-lg text-zinc-600">
                Create ATS‑optimized resumes, align your LinkedIn, and track progress—all in one corporate‑grade
                platform.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button asChild>
                    <a href="#product">Build My Resume</a>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button asChild variant="outline">
                    <a href="#features">Explore Features</a>
                  </Button>
                </motion.div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  No card required for demo
                </div>
              </div>
              <div className="mt-6 flex items-center gap-6 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" /> ATS‑friendly formats
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> Privacy‑first
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative"
            >
              <Image
                src="/corporate-analytics-mockup.png"
                alt="Product preview"
                width={960}
                height={640}
                className="rounded-xl border shadow-sm"
                priority
              />
            </motion.div>
          </AnimatedSection>
        </div>

        {/* Trusted by */}
        <AnimatedSection>
          <div className="mx-auto max-w-6xl px-4 pb-6">
            <div className="rounded-xl border bg-white/60 p-4 backdrop-blur">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <p className="text-sm text-zinc-500">Trusted by professionals at</p>
                <div className="flex flex-wrap items-center justify-center gap-6 grayscale">
                  <Image src="/corporate-logo-1.png" alt="Corporate logo 1" width={80} height={28} />
                  <Image src="/corporate-logo-2.png" alt="Corporate logo 2" width={80} height={28} />
                  <Image src="/corporate-logo-3.png" alt="Corporate logo 3" width={80} height={28} />
                  <Image src="/corporate-logo-4.png" alt="Corporate logo 4" width={80} height={28} />
                  <Image src="/corporate-logo-5.png" alt="Corporate logo 5" width={80} height={28} />
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Features */}
      <AnimatedSection className="border-t bg-zinc-50" delay={0.05}>
        <div id="features" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <h2 className="text-3xl font-semibold tracking-tight">Purpose‑Built for Careers</h2>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Everything you need to stand out—crafted with enterprise polish.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <TiltCard key={i} className="h-full">
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <f.icon className="h-5 w-5 text-zinc-900" />
                    <div>
                      <CardTitle className="text-base">{f.title}</CardTitle>
                      <CardDescription>{f.desc}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </TiltCard>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Product */}
      <AnimatedSection className="border-t" delay={0.05}>
        <div id="product" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Product</h2>
              <p className="mt-2 max-w-2xl text-zinc-600">
                Use the User Panel to build and refine. Admins can manage users, payments, and analytics in the portal.
              </p>
            </div>
          </div>

          <div id="user-panel" className="mt-8">
            <UserPanel />
          </div>
        </div>
      </AnimatedSection>

      {/* Pricing */}
      <AnimatedSection className="border-t bg-zinc-50" delay={0.05}>
        <div id="pricing" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <h2 className="text-3xl font-semibold tracking-tight">Simple, Transparent Pricing</h2>
          <p className="mt-2 max-w-2xl text-zinc-600">Upgrade when you&apos;re ready. Demo is free.</p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <TiltCard>
              <Card className="flex flex-col transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                  <CardDescription>Try the essentials</CardDescription>
                </CardHeader>
                <CardContent className="flex grow flex-col">
                  <div className="text-4xl font-semibold">₹0</div>
                  <p className="mt-2 text-sm text-zinc-600">Limited AI credits</p>
                  <Separator className="my-4" />
                  <ul className="space-y-2 text-sm text-zinc-700">
                    <li>• AI resume draft</li>
                    <li>• Upload one document</li>
                    <li>• Manual LinkedIn import</li>
                  </ul>
                  <div className="mt-6">
                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <a href="#product">Start Free</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TiltCard>

            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <TiltCard>
                <Card className="flex flex-col border-zinc-900 transition-shadow hover:shadow-xl">
                  <CardHeader>
                    <CardTitle>Pro</CardTitle>
                    <CardDescription>For active job seekers</CardDescription>
                  </CardHeader>
                  <CardContent className="flex grow flex-col">
                    <div className="text-4xl font-semibold">₹3,900</div>
                    <p className="mt-2 text-sm text-zinc-600">One‑time</p>
                    <Separator className="my-4" />
                    <ul className="space-y-2 text-sm text-zinc-700">
                      <li>• Unlimited AI generations</li>
                      <li>• Full LinkedIn makeover</li>
                      <li>• Export PDF/Docx</li>
                    </ul>
                    <div className="mt-6">
                      <PaymentButton plan="pro" amountCents={390000} label="Upgrade to Pro" />
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            </motion.div>

            <TiltCard>
              <Card className="flex flex-col transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Team</CardTitle>
                  <CardDescription>For career coaches & HR</CardDescription>
                </CardHeader>
                <CardContent className="flex grow flex-col">
                  <div className="text-4xl font-semibold">₹9,900</div>
                  <p className="mt-2 text-sm text-zinc-600">per seat / mo</p>
                  <Separator className="my-4" />
                  <ul className="space-y-2 text-sm text-zinc-700">
                    <li>• Admin & analytics</li>
                    <li>• Priority support</li>
                    <li>• Bulk credits</li>
                  </ul>
                  <div className="mt-6">
                    <PaymentButton plan="team" amountCents={990000} label="Start Team Trial" modeSubscription />
                  </div>
                </CardContent>
              </Card>
            </TiltCard>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 md:flex-row">
          <div className="text-sm text-zinc-500">© {new Date().getFullYear()} ElevateCV Inc. All rights reserved.</div>
          <div className="flex items-center gap-6 text-sm text-zinc-600">
            <Link href="#" className="hover:text-zinc-900">
              Privacy
            </Link>
            <Link href="#" className="hover:text-zinc-900">
              Terms
            </Link>
            <Link href="#" className="hover:text-zinc-900">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

function PaymentButton(props: { plan: string; amountCents: number; label?: string; modeSubscription?: boolean }) {
  const [loading, setLoading] = useState(false)
  const label = props.label ?? "Checkout"

  async function onCheckout() {
    try {
      setLoading(true)
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          plan: props.plan,
          amountCents: props.amountCents, // INR paise
          mode: props.modeSubscription ? "subscription" : "payment",
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Checkout unavailable. Running demo mode.")
      }
    } catch (e: any) {
      console.error(e)
      alert("Something went wrong starting checkout.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
      <Button onClick={onCheckout} disabled={loading} className={cn("w-full", loading && "opacity-70")}>
        {loading ? "Redirecting..." : label}
      </Button>
    </motion.div>
  )
}
