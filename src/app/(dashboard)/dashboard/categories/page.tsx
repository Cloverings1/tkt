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
import { Plus, Loader2 } from "lucide-react"
import type { Category } from "@/lib/types"

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
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:bg-card/80"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${category.color}15` }}
              >
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium">{category.name}</h3>
                <p className="text-xs text-muted-foreground">{category.color}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </AnimatedLayout>
  )
}
