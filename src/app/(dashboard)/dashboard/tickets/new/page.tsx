"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/ui/page-header"
import { Loader2 } from "lucide-react"

interface CategoryOption {
  id: string
  name: string
  color: string
}

export default function NewTicketPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<CategoryOption[]>([])

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
    const priority = formData.get("priority") as string
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

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <select
              id="priority"
              name="priority"
              defaultValue="medium"
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
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
  )
}
