"use client"

import { useEffect, useState, useCallback } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import type { Category } from "@/lib/types"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="p-8">
      <PageHeader title="Categories" description="Organize tickets by category">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
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
  )
}
