"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserMenu } from "./user-menu"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 overflow-hidden rounded-md ring-1 ring-zinc-100">
            <Image src="/abstract-corporate-monogram.png" alt="Brand mark" width={32} height={32} />
          </div>
          <Link href="/" className="text-lg font-semibold tracking-tight">
            ElevateCV
          </Link>
          <Badge variant="secondary" className="ml-2 hidden md:inline-flex">
            AI Resume & LinkedIn
          </Badge>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/#features" className="text-sm text-zinc-600 hover:text-zinc-900">
            Features
          </Link>
          <Link href="/#pricing" className="text-sm text-zinc-600 hover:text-zinc-900">
            Pricing
          </Link>
          <Link href="/#product" className="text-sm text-zinc-600 hover:text-zinc-900">
            Product
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="hidden md:inline-flex bg-transparent">
            <Link href="/#product">Try Demo</Link>
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
