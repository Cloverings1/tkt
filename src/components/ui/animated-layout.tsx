"use client"

import { motion, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"

interface AnimatedLayoutProps {
  children: ReactNode
  className?: string
}

export function AnimatedLayout({ children, className }: AnimatedLayoutProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
