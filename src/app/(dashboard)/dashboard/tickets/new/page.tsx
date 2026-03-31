"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatedLayout } from "@/components/ui/animated-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/ui/page-header"
import { mockCategories } from "@/lib/mock-data"
import { Loader2 } from "lucide-react"

export default function NewTicketPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    // Will wire to API later
    await new Promise((r) => setTimeout(r, 500))
    router.push("/dashboard/tickets")
  }

  return (
    <AnimatedLayout>
    <div className="p-8">
      <PageHeader title="New Ticket" description="Create a new support ticket" />

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
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
              {mockCategories.map((cat) => (
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
    </AnimatedLayout>
  )
}
