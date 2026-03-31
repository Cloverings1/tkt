"use client"

import { motion, useReducedMotion } from "motion/react"
import { Children, type ReactNode } from "react"

interface StaggeredListProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggeredList({
  children,
  className,
  staggerDelay = 0.05,
}: StaggeredListProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className={className}>
      {Children.map(children, (child, index) => (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
            delay: prefersReducedMotion ? 0 : index * staggerDelay,
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}
