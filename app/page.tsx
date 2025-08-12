"use client"

import { SiteHeader } from "@/components/site-header"
import { EnhancedUserPanel } from "@/components/user-panel"
import { ResumePreview } from "@/components/resume-preview"
import { BackgroundOrbs } from "@/components/background-orbs"
import { AnimatedSection } from "@/components/animated-section"
import { TiltCard } from "@/components/tilt-card"
import { NumberTicker } from "@/components/number-ticker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, FileText, Linkedin, Download, Zap, Users, TrendingUp, Shield, Star, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <BackgroundOrbs />
      <SiteHeader />

      {/* Hero Section */}
      <AnimatedSection className="relative overflow-hidden py-20 lg:py-32">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge variant="secondary" className="mb-6 animate-pulse">
              <Sparkles className="mr-2 h-3 w-3" />
              AI-Powered Resume Builder
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-6 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl lg:text-7xl"
          >
            Elevate Your Career with{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AI-Enhanced
            </span>{" "}
            Resumes
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            Transform your LinkedIn profile into a professional resume in minutes. Our AI analyzes your content and
            creates ATS-optimized resumes that get you hired.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button size="lg" className="group transition-all duration-300 hover:scale-105">
              <Sparkles className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
              Start Building Free
            </Button>
            <Button variant="outline" size="lg" className="transition-all duration-300 hover:scale-105 bg-transparent">
              <FileText className="mr-2 h-5 w-5" />
              View Examples
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                <NumberTicker value={10000} />+
              </div>
              <div className="text-sm text-muted-foreground">Resumes Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                <NumberTicker value={95} />%
              </div>
              <div className="text-sm text-muted-foreground">ATS Compatible</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                <NumberTicker value={4.9} decimals={1} />
              </div>
              <div className="text-sm text-muted-foreground">User Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                <NumberTicker value={24} />h
              </div>
              <div className="text-sm text-muted-foreground">Average Time Saved</div>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Features Section */}
      <div id="features">
        <AnimatedSection className="py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                <Zap className="mr-2 h-3 w-3" />
                Features
              </Badge>
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Everything you need to create the perfect resume</h2>
              <p className="mx-auto mb-12 max-w-2xl text-muted-foreground">
                Our AI-powered platform combines the best of technology and design to help you stand out.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Linkedin,
                  title: "LinkedIn Integration",
                  description:
                    "Import your LinkedIn profile data instantly and transform it into a professional resume.",
                },
                {
                  icon: Sparkles,
                  title: "AI Enhancement",
                  description:
                    "Our AI analyzes your content and suggests improvements to make your resume more impactful.",
                },
                {
                  icon: Shield,
                  title: "ATS Optimized",
                  description:
                    "Built-in ATS optimization ensures your resume passes through applicant tracking systems.",
                },
                {
                  icon: Download,
                  title: "Multiple Formats",
                  description: "Export your resume in PDF, DOCX, or other formats with professional templates.",
                },
                {
                  icon: TrendingUp,
                  title: "Real-time Analytics",
                  description: "Track your resume performance and get insights on how to improve your job search.",
                },
                {
                  icon: Users,
                  title: "Collaboration Tools",
                  description: "Share your resume with mentors and get feedback before applying to jobs.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <TiltCard>
                    <Card className="h-full border-2 transition-all duration-300 hover:border-primary/50">
                      <CardHeader>
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Product Demo Section */}
      <div id="product">
        <AnimatedSection className="py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                <FileText className="mr-2 h-3 w-3" />
                Try It Now
              </Badge>
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Build Your Resume in Minutes</h2>
              <p className="mx-auto mb-12 max-w-2xl text-muted-foreground">
                Experience the power of AI-driven resume building. Import from LinkedIn, enhance with AI, and export
                professionally.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="order-2 lg:order-1">
                <EnhancedUserPanel />
              </div>
              <div className="order-1 lg:order-2">
                <div className="sticky top-24">
                  <ResumePreview />
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Pricing Section */}
      <div id="pricing">
        <AnimatedSection className="py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                <Star className="mr-2 h-3 w-3" />
                Pricing
              </Badge>
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Choose Your Plan</h2>
              <p className="mx-auto mb-12 max-w-2xl text-muted-foreground">
                Start free and upgrade as you grow. All plans include our core features.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  title: "Free",
                  price: "₹0",
                  description: "Perfect for getting started",
                  features: ["1 Resume", "Basic Templates", "LinkedIn Import"],
                  buttonText: "Get Started",
                  popular: false,
                },
                {
                  title: "Pro",
                  price: "₹39",
                  description: "For serious job seekers",
                  features: ["Unlimited Resumes", "Premium Templates", "AI Enhancement", "ATS Optimization"],
                  buttonText: "Upgrade to Pro",
                  popular: true,
                },
                {
                  title: "Enterprise",
                  price: "₹99",
                  description: "For teams and organizations",
                  features: ["Everything in Pro", "Team Collaboration", "Analytics Dashboard", "Priority Support"],
                  buttonText: "Contact Sales",
                  popular: false,
                },
              ].map((plan, index) => (
                <motion.div
                  key={plan.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <TiltCard>
                    <Card
                      className={`relative h-full border-2 transition-all duration-300 hover:border-primary/50 ${
                        plan.popular ? "border-primary" : ""
                      }`}
                    >
                      {plan.popular && (
                        <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">Most Popular</Badge>
                      )}
                      <CardHeader>
                        <CardTitle>{plan.title}</CardTitle>
                        <div className="text-4xl font-bold">{plan.price}</div>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          {plan.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <Button
                          className={`w-full ${plan.popular ? "" : "bg-transparent"}`}
                          variant={plan.popular ? "default" : "outline"}
                        >
                          {plan.buttonText}
                        </Button>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary" />
              <span className="font-semibold">ElevateCV</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 ElevateCV. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
