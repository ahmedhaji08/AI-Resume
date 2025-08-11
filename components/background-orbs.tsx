"use client"

import { motion, useReducedMotion } from "framer-motion"

export function BackgroundOrbs() {
  const reduced = useReducedMotion()
  if (reduced) return null
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-100 blur-3xl"
        animate={{ x: [0, 20, -10, 0], y: [0, -10, 10, 0] }}
        transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <motion.div
        className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-100 to-zinc-100 blur-3xl"
        animate={{ x: [0, -15, 10, 0], y: [0, 10, -10, 0] }}
        transition={{ duration: 22, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
    </div>
  )
}
