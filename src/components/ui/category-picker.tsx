"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Check,
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
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface CategoryWithChildren {
  id: string
  name: string
  color: string
  icon: string | null
  parentId: string | null
  orgId: string
  createdAt: string
  children: CategoryWithChildren[]
}

interface CategoryPickerProps {
  categories: CategoryWithChildren[]
  value: string
  onChange: (id: string) => void
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

function getIcon(iconName: string | null): LucideIcon {
  if (!iconName) return Tag
  return iconMap[iconName] ?? Tag
}

export function CategoryPicker({ categories, value, onChange }: CategoryPickerProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<CategoryWithChildren | null>(null)

  function handlePlatformClick(platform: CategoryWithChildren) {
    if (!platform.children || platform.children.length === 0) {
      onChange(platform.id)
      return
    }
    setSelectedPlatform(platform)
  }

  function handleBack() {
    setSelectedPlatform(null)
  }

  const selectedCategory = findCategory(categories, value)

  return (
    <div className="space-y-2">
      <div className="rounded-lg border border-border bg-card">
        {!selectedPlatform ? (
          /* Step 1: Platform selection */
          <div className="p-3 animate-in fade-in duration-150">
            <p className="mb-3 text-xs font-medium text-muted-foreground">
              Select a platform
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {categories.map((platform) => {
                const PlatformIcon = getIcon(platform.icon)
                const isParentOfSelected = value
                  ? platform.children?.some((c) => c.id === value) ?? false
                  : false

                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => handlePlatformClick(platform)}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all duration-200 cursor-pointer hover:bg-accent/40 active:scale-[0.98] ${
                      isParentOfSelected
                        ? "border-transparent ring-2"
                        : "border-border"
                    }`}
                    style={
                      isParentOfSelected
                        ? {
                            boxShadow: `0 0 0 2px ${platform.color}`,
                            backgroundColor: `${platform.color}10`,
                          }
                        : {}
                    }
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${platform.color}15` }}
                    >
                      <PlatformIcon className="h-5 w-5" style={{ color: platform.color }} />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-foreground">{platform.name}</span>
                      {platform.children && platform.children.length > 0 && (
                        <p className="text-[10px] text-muted-foreground">
                          {platform.children.length} categories
                        </p>
                      )}
                    </div>
                    {isParentOfSelected && (
                      <div
                        className="flex h-5 w-5 items-center justify-center rounded-full animate-in fade-in zoom-in duration-200"
                        style={{ backgroundColor: `${platform.color}25` }}
                      >
                        <Check className="h-3 w-3" style={{ color: platform.color }} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          /* Step 2: Child category selection */
          <div className="p-3 animate-in fade-in slide-in-from-right-2 duration-200">
            <button
              type="button"
              onClick={handleBack}
              className="mb-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to platforms
            </button>
            <div className="mb-3 flex items-center gap-2">
              {(() => {
                const PIcon = getIcon(selectedPlatform.icon)
                return (
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${selectedPlatform.color}15` }}
                  >
                    <PIcon className="h-4 w-4" style={{ color: selectedPlatform.color }} />
                  </div>
                )
              })()}
              <span className="text-sm font-semibold">{selectedPlatform.name}</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {(selectedPlatform.children ?? []).map((child) => {
                const ChildIcon = getIcon(child.icon)
                const isSelected = value === child.id

                return (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => onChange(child.id)}
                    className={`flex items-center gap-3 rounded-lg border p-2.5 text-left text-sm transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                      isSelected
                        ? "border-transparent ring-2"
                        : "border-border/50 hover:bg-accent/40"
                    }`}
                    style={
                      isSelected
                        ? {
                            boxShadow: `0 0 0 2px ${child.color}`,
                            backgroundColor: `${child.color}10`,
                          }
                        : {}
                    }
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${child.color}15` }}
                    >
                      <ChildIcon className="h-4 w-4" style={{ color: child.color }} />
                    </div>
                    <span className="flex-1 font-medium text-foreground">{child.name}</span>
                    {isSelected && (
                      <div
                        className="flex h-5 w-5 items-center justify-center rounded-full animate-in fade-in zoom-in duration-200"
                        style={{ backgroundColor: `${child.color}25` }}
                      >
                        <Check className="h-3 w-3" style={{ color: child.color }} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Show selected category */}
      {selectedCategory && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground animate-in fade-in duration-200">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: selectedCategory.color }}
          />
          <span>
            Selected: <span className="font-medium text-foreground">{selectedCategory.name}</span>
          </span>
        </div>
      )}
    </div>
  )
}

function findCategory(
  categories: CategoryWithChildren[],
  id: string
): CategoryWithChildren | null {
  for (const cat of categories) {
    if (cat.id === id) return cat
    if (cat.children) {
      const found = findCategory(cat.children, id)
      if (found) return found
    }
  }
  return null
}
