"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserMenu } from "./user-menu"
import { ThemeToggle } from "./theme-toggle"
import { MobileNav } from "./mobile-nav"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <MobileNav />
          <div className="h-8 w-8 overflow-hidden rounded-md ring-1 ring-border transition-all duration-300 hover:scale-110">
            <Image src="/placeholder.svg?height=32&width=32&text=EC" alt="Brand mark" width={32} height={32} />
          </div>
          <Link href="/" className="text-lg font-semibold tracking-tight transition-colors hover:text-primary">
            ElevateCV
          </Link>
          <Badge variant="secondary" className="ml-2 hidden animate-pulse md:inline-flex">
            AI Resume & LinkedIn
          </Badge>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="/#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Pricing
          </Link>
          <Link href="/#product" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Product
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            asChild
            variant="outline"
            className="hidden bg-transparent transition-all duration-300 hover:scale-105 md:inline-flex"
          >
            <Link href="/#product">Try Demo</Link>
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
