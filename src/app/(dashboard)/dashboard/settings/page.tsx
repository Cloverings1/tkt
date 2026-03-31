"use client"

import { useEffect, useState, useCallback } from "react"
import { AnimatedLayout } from "@/components/ui/animated-layout"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Check } from "lucide-react"
import type { Organization } from "@/lib/types"

export default function SettingsPage() {
  const [org, setOrg] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  // Form fields
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")

  const loadOrg = useCallback(async () => {
    try {
      const res = await fetch("/api/organizations")
      if (!res.ok) throw new Error("Failed to load organization")
      const data = await res.json()
      setOrg(data)
      setName(data.name)
      setSlug(data.slug)
    } catch (err) {
      console.error("Failed to load org:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrg()
  }, [loadOrg])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSaved(false)

    if (!name.trim()) {
      setError("Organization name is required")
      return
    }

    if (!slug.trim()) {
      setError("URL slug is required")
      return
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      setError("Slug must be lowercase letters, numbers, and hyphens only")
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/organizations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slug: slug.trim() }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to update organization")
      }

      const updated = await res.json()
      setOrg(updated)
      setName(updated.name)
      setSlug(updated.slug)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <PageHeader title="Settings" description="Manage your organization" />
        <div className="mt-8 flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <AnimatedLayout>
    <div className="p-8">
      <PageHeader title="Settings" description="Manage your organization" />

      <div className="mt-8 max-w-xl space-y-8">
        <form onSubmit={handleSave} className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Organization</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization name</Label>
              <Input
                id="orgName"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Used in URLs and API references
              </p>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : saved ? (
                <Check className="mr-2 h-4 w-4" />
              ) : null}
              {saved ? "Saved" : "Save Changes"}
            </Button>
          </div>
        </form>

        <div className="rounded-xl border border-destructive/30 bg-card p-6">
          <h2 className="mb-2 text-lg font-semibold text-destructive">Danger Zone</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Permanently delete this organization and all its data.
          </p>
          <Button variant="destructive">Delete Organization</Button>
        </div>
      </div>
    </div>
    </AnimatedLayout>
  )
}
