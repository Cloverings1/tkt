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

export default function NewTicketPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [priority, setPriority] = useState<TicketPriority>("medium")

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

      router.push("/dashboard/tickets")
    } catch {
      setError("Failed to create ticket. Please try again.")
      setLoading(false)
    }
  }

  return (
    <AnimatedLayout>
    <div className="p-8">
      <PageHeader title="New Ticket" description="Create a new support ticket" />

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
        {error && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Brief summary of the issue"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe the issue in detail..."
            rows={6}
            required
          />
        </div>

        <div className="space-y-3">
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Ticket
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
    </AnimatedLayout>
  )
}
