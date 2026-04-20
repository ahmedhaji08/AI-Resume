// app/auth/page.tsx
import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { AuthForm } from "@/components/auth-form"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Users } from "lucide-react"

function AuthFormFallback() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <SiteHeader />
      <div className="container relative min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left side - Branding and Features */}
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Shield className="mr-2 h-6 w-6" />
            ElevateCV
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                "Transform your career with AI-powered resume building and LinkedIn optimization. Join thousands of
                professionals who've elevated their job search."
              </p>
            </blockquote>
            <div className="mt-8 grid gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">AI-Powered Generation</p>
                  <p className="text-sm text-white/80">Smart resume and LinkedIn profile creation</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Professional Templates</p>
                  <p className="text-sm text-white/80">Industry-standard designs that get noticed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <div className="flex items-center justify-center mb-4 lg:hidden">
                <Shield className="mr-2 h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">ElevateCV</span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your account or create a new one to get started
              </p>
            </div>

            <Card className="border-0 shadow-lg lg:border lg:shadow-sm">
              <CardHeader className="space-y-1 pb-4">
                <div className="flex items-center justify-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    Secure Authentication
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<AuthFormFallback />}>
                  <AuthForm />
                </Suspense>
              </CardContent>
            </Card>

            <div className="px-8 text-center text-sm text-muted-foreground">
              By continuing, you agree to our{" "}
              <a href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
