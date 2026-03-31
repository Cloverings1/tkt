"use client"

import { useEffect, useState, useCallback } from "react"
import { AnimatedLayout } from "@/components/ui/animated-layout"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "motion/react"
import { Loader2, Check, Building2, AlertTriangle } from "lucide-react"
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

  const orgInitial = org?.name?.charAt(0)?.toUpperCase() ?? "O"

  return (
    <AnimatedLayout>
    <div className="p-8">
      <PageHeader title="Settings" description="Manage your organization" />

      <div className="mt-8 max-w-xl space-y-8">
        {/* Org Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-5 rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-violet-500/30 hover:shadow-[0_0_20px_-6px_rgba(139,92,246,0.15)]"
        >
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 ring-2 ring-violet-500/25">
            <span className="text-2xl font-bold text-violet-400">{orgInitial}</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{org?.name}</h2>
            <p className="text-sm text-muted-foreground font-mono">/{org?.slug}</p>
          </div>
        </motion.div>

        {/* Organization Form */}
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          onSubmit={handleSave}
          className="rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-violet-500/30 hover:shadow-[0_0_20px_-6px_rgba(139,92,246,0.15)]"
        >
          <div className="flex items-center gap-3 mb-5">
            <Building2 className="h-5 w-5 text-violet-400" />
            <h2 className="text-lg font-semibold">Organization</h2>
          </div>

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

            <Button type="submit" disabled={saving} className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                {saving ? (
                  <motion.span
                    key="saving"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </motion.span>
                ) : saved ? (
                  <motion.span
                    key="saved"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center text-emerald-400"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Saved
                  </motion.span>
                ) : (
                  <motion.span
                    key="default"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    Save Changes
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </motion.form>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.16 }}
          className="relative rounded-xl bg-card p-6 border border-red-500/30 shadow-[0_0_20px_-8px_rgba(239,68,68,0.2)] transition-all duration-200 hover:border-red-500/50 hover:shadow-[0_0_30px_-6px_rgba(239,68,68,0.25)]"
        >
          {/* Subtle red gradient top edge */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent rounded-t-xl" />

          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Permanently delete this organization and all its data. This action cannot be undone.
          </p>
          <Button variant="destructive">Delete Organization</Button>
        </motion.div>
      </div>
    </div>
    </AnimatedLayout>
  )
}
