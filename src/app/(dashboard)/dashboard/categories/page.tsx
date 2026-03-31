"use client"

import { useEffect, useState, useCallback } from "react"
import { AnimatedLayout } from "@/components/ui/animated-layout"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { motion } from "motion/react"
import {
  Plus,
  Loader2,
  Smartphone,
  Tablet,
  Laptop,
  Headphones,
  Watch,
  AppWindow,
  Download,
  Wrench,
  Cloud,
  Wifi,
  Tag,
  Ticket,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { Category } from "@/lib/types"

const iconMap: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  headphones: Headphones,
  watch: Watch,
  "app-window": AppWindow,
  download: Download,
  wrench: Wrench,
  cloud: Cloud,
  wifi: Wifi,
  tag: Tag,
}

function getCategoryIcon(iconName: string | null): LucideIcon {
  if (!iconName) return Tag
  return iconMap[iconName] ?? Tag
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Form fields
  const [name, setName] = useState("")
  const [color, setColor] = useState("#8b5cf6")
  const [icon, setIcon] = useState("")

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories")
      if (!res.ok) throw new Error("Failed to load categories")
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.error("Failed to load categories:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  function resetForm() {
    setName("")
    setColor("#8b5cf6")
    setIcon("")
    setError("")
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Name is required")
      return
    }

    if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
      setError("Color must be a valid hex (#RRGGBB)")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          color,
          ...(icon.trim() ? { icon: icon.trim() } : {}),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create category")
      }

      setDialogOpen(false)
      resetForm()
      await loadCategories()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatedLayout>
    <div className="p-8">
      <PageHeader title="Categories" description="Organize tickets by category">
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger
            render={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
              <DialogDescription>
                Add a new category to organize your tickets.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cat-name">Name</Label>
                <Input
                  id="cat-name"
                  placeholder="e.g. Bug Report"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-color">Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded-md border border-border bg-transparent"
                  />
                  <Input
                    id="cat-color"
                    placeholder="#8b5cf6"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-icon">Icon (optional)</Label>
                <Input
                  id="cat-icon"
                  placeholder="e.g. bug, server, network"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <DialogFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Category
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {loading ? (
        <div className="mt-8 flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : categories.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p className="text-sm">No categories yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category, index) => {
            const Icon = getCategoryIcon(category.icon)
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative overflow-hidden rounded-xl border border-border bg-card transition-shadow duration-200 hover:shadow-lg hover:shadow-black/20"
              >
                {/* Colored left accent stripe */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-200 group-hover:w-1.5"
                  style={{ backgroundColor: category.color }}
                />

                <div className="p-6 pl-5 ml-1">
                  {/* Icon and name */}
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
                      style={{ backgroundColor: `${category.color}18` }}
                    >
                      <Icon
                        className="h-6 w-6"
                        style={{ color: category.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold leading-tight text-foreground">
                        {category.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-xs font-mono text-muted-foreground">
                          {category.color}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ticket count badge */}
                  <div className="mt-4 flex items-center gap-1.5 text-muted-foreground">
                    <Ticket className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">0 tickets</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
    </AnimatedLayout>
  )
}
