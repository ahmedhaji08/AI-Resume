"use client"

import { SiteHeader } from "@/components/site-header"
import { AuthForm } from "@/components/auth-form"
import { AnimatedSection } from "@/components/animated-section"

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <SiteHeader />
      <AnimatedSection className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <h1 className="text-3xl font-semibold tracking-tight">Access your account</h1>
          <p className="mt-2 text-zinc-600">Sign in or sign up to build resumes and manage purchases.</p>
          <div className="mt-8 w-full flex items-center justify-center">
            <AuthForm />
          </div>
        </div>
      </AnimatedSection>
    </main>
  )
}
