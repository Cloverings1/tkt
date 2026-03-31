"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"

interface SuccessFlashProps {
  show: boolean
  onComplete?: () => void
}

export function SuccessFlash({ show, onComplete }: SuccessFlashProps) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 1500)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col items-center gap-3"
          >
            {/* Glow ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0.5, 0.2], scale: [0.5, 1.2, 1.1] }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute h-32 w-32 rounded-full bg-emerald-500/20 blur-xl"
            />

            {/* Circle background */}
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.25)]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="absolute inset-0 rounded-full border-2 border-emerald-500/30"
              />

              {/* Animated checkmark SVG */}
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                className="text-emerald-400"
              >
                <motion.path
                  d="M10 20L17 27L30 13"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                />
              </svg>
            </div>

            {/* Label */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="text-sm font-medium text-emerald-400"
            >
              Ticket Created
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
