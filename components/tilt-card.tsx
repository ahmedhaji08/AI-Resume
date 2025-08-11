"use client"

import type React from "react"
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

type TiltCardProps = {
  children: React.ReactNode
  className?: string
  maxTilt?: number
}

export function TiltCard({ children, className, maxTilt = 10 }: TiltCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rx = useTransform(y, [0, 1], [maxTilt, -maxTilt])
  const ry = useTransform(x, [0, 1], [-maxTilt, maxTilt])
  const rxSpring = useSpring(rx, { stiffness: 150, damping: 12 })
  const rySpring = useSpring(ry, { stiffness: 150, damping: 12 })

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    x.set(px)
    y.set(py)
  }
  function onMouseLeave() {
    x.set(0.5)
    y.set(0.5)
  }

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transformStyle: "preserve-3d" }}
      initial={false}
      animate={{}}
    >
      <motion.div
        style={{ rotateX: rxSpring, rotateY: rySpring, transformStyle: "preserve-3d" }}
        transition={{ type: "spring", stiffness: 150, damping: 12 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
