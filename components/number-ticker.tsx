"use client"

import { useEffect, useRef, useState } from "react"

type NumberTickerProps = {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  locale?: string
  decimals?: number
}

export function NumberTicker({
  value,
  duration = 1000,
  prefix = "",
  suffix = "",
  locale = "en-IN",
  decimals = 0,
}: NumberTickerProps) {
  const [display, setDisplay] = useState(0)
  const startRef = useRef<number | null>(null)
  const fromRef = useRef(0)
  const toRef = useRef(value)

  useEffect(() => {
    fromRef.current = display
    toRef.current = value
    startRef.current = null
    let raf: number

    function step(ts: number) {
      if (startRef.current === null) startRef.current = ts
      const p = Math.min(1, (ts - startRef.current) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      const next = fromRef.current + (toRef.current - fromRef.current) * eased
      setDisplay(next)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration])

  const formatted = display.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return <span>{`${prefix}${formatted}${suffix}`}</span>
}
