"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { AnimatedLayout } from "@/components/ui/animated-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/ui/page-header"
import { SuccessFlash } from "@/components/ui/success-flash"
import {
  Loader2,
  CircleMinus,
  Circle,
  AlertTriangle,
  AlertOctagon,
  Check,
} from "lucide-react"
import type { TicketPriority } from "@/lib/types"

interface CategoryOption {
  id: string
  name: string
  color: string
}

const PRIORITY_CARDS: {
  value: TicketPriority
  label: string
  icon: typeof Circle
  color: string
  ringColor: string
  bgGlow: string
  selectedBg: string
  pulseClass?: string
}[] = [
  {
    value: "low",
    label: "Low",
    icon: CircleMinus,
    color: "text-zinc-400",
    ringColor: "ring-zinc-400",
    bgGlow: "bg-zinc-400/10",
    selectedBg: "bg-zinc-400/5",
  },
  {
    value: "medium",
    label: "Medium",
    icon: Circle,
    color: "text-blue-400",
    ringColor: "ring-blue-400",
    bgGlow: "bg-blue-400/10",
    selectedBg: "bg-blue-400/5",
  },
  {
    value: "high",
    label: "High",
    icon: AlertTriangle,
    color: "text-amber-400",
    ringColor: "ring-amber-400",
    bgGlow: "bg-amber-400/10",
    selectedBg: "bg-amber-400/5",
  },
  {
    value: "urgent",
    label: "Urgent",
    icon: AlertOctagon,
    color: "text-red-500",
    ringColor: "ring-red-500",
    bgGlow: "bg-red-500/10",
    selectedBg: "bg-red-500/5",
    pulseClass: "animate-pulse",
  },
]

const COLOR_DOT_MAP: Record<string, string> = {
  red: "bg-red-400",
  blue: "bg-blue-400",
  green: "bg-emerald-400",
  yellow: "bg-yellow-400",
  orange: "bg-orange-400",
  purple: "bg-purple-400",
  pink: "bg-pink-400",
  indigo: "bg-indigo-400",
  teal: "bg-teal-400",
  cyan: "bg-cyan-400",
  amber: "bg-amber-400",
  emerald: "bg-emerald-400",
  violet: "bg-violet-400",
  rose: "bg-rose-400",
  lime: "bg-lime-400",
  zinc: "bg-zinc-400",
  slate: "bg-slate-400",
}

function getCategoryDotColor(color: string): string {
  const lower = color.toLowerCase()
  for (const [key, cls] of Object.entries(COLOR_DOT_MAP)) {
    if (lower.includes(key)) return cls
  }
  return "bg-violet-400"
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
}

export default function NewTicketPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [priority, setPriority] = useState<TicketPriority>("medium")
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories")
        if (res.ok) {
          setCategories(await res.json())
        }
      } catch {
        // Categories are optional, don't block the form
      }
    }
    fetchCategories()
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const categoryId = formData.get("category") as string

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          priority,
          categoryId: categoryId || undefined,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        setError(err.error || "Failed to create ticket")
        setLoading(false)
        return
      }

      setShowSuccess(true)
    } catch {
      setError("Failed to create ticket. Please try again.")
      setLoading(false)
    }
  }

  return (
    <AnimatedLayout>
    <div className="relative p-8">
      <SuccessFlash
        show={showSuccess}
        onComplete={() => router.push("/dashboard/tickets")}
      />

      <PageHeader title="New Ticket" description="Create a new support ticket" />

      <motion.form
        onSubmit={handleSubmit}
        className="mt-8 max-w-2xl space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {error}
          </motion.div>
        )}

        <motion.div className="space-y-2" variants={staggerItem}>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Brief summary of the issue"
            required
            className="transition-shadow duration-200 focus-visible:ring-violet-500/40 focus-visible:border-violet-500/60 focus-visible:shadow-[0_0_12px_rgba(139,92,246,0.15)]"
          />
        </motion.div>

        <motion.div className="space-y-2" variants={staggerItem}>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe the issue in detail..."
            rows={6}
            required
            className="transition-shadow duration-200 focus-visible:ring-violet-500/40 focus-visible:border-violet-500/60 focus-visible:shadow-[0_0_12px_rgba(139,92,246,0.15)]"
          />
        </motion.div>

        <motion.div className="space-y-3" variants={staggerItem}>
          <Label>Priority</Label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PRIORITY_CARDS.map((p) => {
              const isSelected = priority === p.value
              const Icon = p.icon
              return (
                <motion.button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`relative flex flex-col items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? `${p.ringColor} ring-2 ${p.bgGlow} border-transparent`
                      : "border-border bg-card hover:bg-accent/50"
                  }`}
                >
                  <div className={`relative ${p.color}`}>
                    <Icon
                      className={`h-5 w-5 ${
                        isSelected && p.pulseClass ? p.pulseClass : ""
                      }`}
                    />
                  </div>
                  <span
                    className={
                      isSelected ? p.color : "text-muted-foreground"
                    }
                  >
                    {p.label}
                  </span>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full ${p.bgGlow}`}
                    >
                      <Check className={`h-3 w-3 ${p.color}`} />
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        <motion.div className="space-y-2" variants={staggerItem}>
          <Label htmlFor="category">Category</Label>
          <div className="relative">
            <select
              id="category"
              name="category"
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm transition-shadow duration-200 focus-visible:ring-3 focus-visible:ring-violet-500/40 focus-visible:border-violet-500/60 focus-visible:shadow-[0_0_12px_rgba(139,92,246,0.15)] outline-none"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {categories.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${getCategoryDotColor(cat.color)}`}
                  />
                  {cat.name}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div className="flex gap-3" variants={staggerItem}>
          <button
            type="submit"
            disabled={loading}
            className="group relative inline-flex h-8 items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            {loading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            Create Ticket
          </button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </motion.div>
      </motion.form>
    </div>
    </AnimatedLayout>
  )
}
