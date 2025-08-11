import type React from "react"
import type { Metadata } from "next"
import "./app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ClientEffects } from "./(client-effects)/client-effects"

export const metadata: Metadata = {
  title: "ElevateCV — AI Resume & LinkedIn",
  description: "AI-driven resume writing and LinkedIn makeover service.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
          <ClientEffects />
        </ThemeProvider>
      </body>
    </html>
  )
}
