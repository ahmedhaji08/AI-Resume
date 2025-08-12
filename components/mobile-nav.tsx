"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            ElevateCV
            <Badge variant="secondary" className="text-xs">
              AI Resume
            </Badge>
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col space-y-4">
          <Link
            href="/#features"
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="/#product"
            className="text-lg font-medium transition-colors hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Product
          </Link>
          <div className="pt-4">
            <Button asChild className="w-full" onClick={() => setOpen(false)}>
              <Link href="/#product">Try Demo</Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
