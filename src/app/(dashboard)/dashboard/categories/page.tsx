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
import { motion, AnimatePresence } from "motion/react"
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
  Monitor,
  Server,
  Shield,
  Mail,
  HardDrive,
  User,
  HelpCircle,
  Settings,
  Tag,
  Ticket,
  ChevronDown,
  Layers,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface CategoryWithChildren {
  id: string
  name: string
  color: string
  icon: string | null
  parentId: string | null
  orgId: string
  createdAt: string
  children: CategoryWithChildren[]
}

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
  monitor: Monitor,
  server: Server,
  shield: Shield,
  mail: Mail,
  "hard-drive": HardDrive,
  user: User,
  "help-circle": HelpCircle,
  settings: Settings,
  apple: Laptop,
  tag: Tag,
}

function getCategoryIcon(iconName: string | null): LucideIcon {
  if (!iconName) return Tag
  return iconMap[iconName] ?? Tag
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithChildren[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [dialogParentId, setDialogParentId] = useState<string | null>(null)

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
      // Expand all sections by default
      const ids = data.map((c: CategoryWithChildren) => c.id)
      setExpandedSections(new Set(ids))
    } catch (err) {
      console.error("Failed to load categories:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  function toggleSection(id: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function resetForm() {
    setName("")
    setColor("#8b5cf6")
    setIcon("")
    setError("")
    setDialogParentId(null)
  }

  function openAddDialog(parentId: string | null) {
    setDialogParentId(parentId)
    setDialogOpen(true)
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
          ...(dialogParentId ? { parentId: dialogParentId } : {}),
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

  const dialogTitle = dialogParentId
    ? `Add Category to ${categories.find((c) => c.id === dialogParentId)?.name ?? "Platform"}`
    : "Add Platform"

  return (
    <AnimatedLayout>
      <div className="p-8">
        <PageHeader title="Categories" description="Organize tickets by platform and category">
          <Button onClick={() => openAddDialog(null)}>
            <Layers className="mr-2 h-4 w-4" />
            Add Platform
          </Button>
        </PageHeader>

        {/* Create dialog */}
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription>
                {dialogParentId
                  ? "Add a sub-category under this platform."
                  : "Create a new top-level platform group."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cat-name">Name</Label>
                <Input
                  id="cat-name"
                  placeholder={dialogParentId ? "e.g. iPhone / iOS" : "e.g. Apple"}
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
                  placeholder="e.g. smartphone, monitor, settings"
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
                  {dialogParentId ? "Add Category" : "Add Platform"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {loading ? (
          <div className="mt-8 flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : categories.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Layers className="mb-3 h-8 w-8 opacity-40" />
            <p className="text-sm">No platforms yet. Add one to get started.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {categories.map((platform, platformIndex) => {
              const PlatformIcon = getCategoryIcon(platform.icon)
              const isExpanded = expandedSections.has(platform.id)

              return (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: platformIndex * 0.06 }}
                  className="overflow-hidden rounded-xl border border-border bg-card"
                >
                  {/* Platform section header */}
                  <button
                    onClick={() => toggleSection(platform.id)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-accent/30"
                  >
                    {/* Color accent bar */}
                    <div
                      className="h-10 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: platform.color }}
                    />

                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${platform.color}18` }}
                    >
                      <PlatformIcon
                        className="h-5 w-5"
                        style={{ color: platform.color }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground">
                        {platform.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {platform.children.length} {platform.children.length === 1 ? "category" : "categories"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: platform.color }}
                      />
                      <span className="text-xs font-mono text-muted-foreground">
                        {platform.color}
                      </span>
                    </div>

                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  </button>

                  {/* Collapsible children */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border px-5 pb-4 pt-4">
                          {platform.children.length === 0 ? (
                            <p className="py-4 text-center text-xs text-muted-foreground">
                              No categories in this platform yet.
                            </p>
                          ) : (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                              {platform.children.map((child, childIndex) => {
                                const ChildIcon = getCategoryIcon(child.icon)
                                return (
                                  <motion.div
                                    key={child.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, delay: childIndex * 0.03 }}
                                    whileHover={{ y: -2, transition: { duration: 0.15 } }}
                                    className="group relative flex items-center gap-3 rounded-lg border border-border bg-zinc-900/50 p-3 transition-shadow duration-200 hover:shadow-md hover:shadow-black/20"
                                  >
                                    <div
                                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110"
                                      style={{ backgroundColor: `${child.color}15` }}
                                    >
                                      <ChildIcon
                                        className="h-4 w-4"
                                        style={{ color: child.color }}
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-sm font-medium text-foreground">
                                        {child.name}
                                      </p>
                                      <div className="mt-0.5 flex items-center gap-1.5">
                                        <div
                                          className="h-2 w-2 rounded-full"
                                          style={{ backgroundColor: child.color }}
                                        />
                                        <span className="text-[10px] font-mono text-muted-foreground">
                                          {child.color}
                                        </span>
                                      </div>
                                    </div>
                                  </motion.div>
                                )
                              })}
                            </div>
                          )}

                          {/* Add child category button */}
                          <button
                            onClick={() => openAddDialog(platform.id)}
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-violet-500/40 hover:text-violet-400"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add Category
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </AnimatedLayout>
  )
}
