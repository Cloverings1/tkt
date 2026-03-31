"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
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

// Direction of the slide animation
type SlideDirection = "forward" | "back"

export function CategoryPicker({ categories, value, onChange }: CategoryPickerProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<CategoryWithChildren | null>(null)
  const [direction, setDirection] = useState<SlideDirection>("forward")

  function handlePlatformClick(platform: CategoryWithChildren) {
    if (platform.children.length === 0) {
      // If no children, select the platform itself
      onChange(platform.id)
      return
    }
    setDirection("forward")
    setSelectedPlatform(platform)
  }

  function handleBack() {
    setDirection("back")
    setSelectedPlatform(null)
  }

  function handleChildClick(childId: string) {
    onChange(childId)
  }

  // Find which platform the current value belongs to (for display)
  const selectedCategory = findCategory(categories, value)

  const slideVariants = {
    enter: (dir: SlideDirection) => ({
      x: dir === "forward" ? 120 : -120,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: SlideDirection) => ({
      x: dir === "forward" ? -120 : 120,
      opacity: 0,
    }),
  }

  return (
    <div className="space-y-2">
      <div className="relative overflow-hidden rounded-lg border border-border bg-card">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          {!selectedPlatform ? (
            /* Step 1: Platform selection */
            <motion.div
              key="platforms"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="p-3"
            >
              <p className="mb-3 text-xs font-medium text-muted-foreground">
                Select a platform
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {categories.map((platform) => {
                  const Icon = getIcon(platform.icon)
                  const isParentOfSelected = selectedCategory?.parentId === platform.id
                  return (
                    <motion.button
                      key={platform.id}
                      type="button"
                      onClick={() => handlePlatformClick(platform)}
                      whileTap={{ scale: 0.97 }}
                      className={`relative flex flex-col items-center gap-2 rounded-lg border px-4 py-4 text-sm font-medium transition-all duration-200 cursor-pointer ${
                        isParentOfSelected
                          ? "border-transparent ring-2"
                          : "border-border hover:bg-accent/40"
                      }`}
                      style={
                        isParentOfSelected
                          ? {
                              ringColor: platform.color,
                              boxShadow: `0 0 0 2px ${platform.color}`,
                              backgroundColor: `${platform.color}10`,
                            }
                          : {}
                      }
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${platform.color}18` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: platform.color }} />
                      </div>
                      <span className="text-foreground">{platform.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {platform.children.length} {platform.children.length === 1 ? "option" : "options"}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          ) : (
            /* Step 2: Child category selection */
            <motion.div
              key={`children-${selectedPlatform.id}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="p-3"
            >
              <div className="mb-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-md"
                  style={{ backgroundColor: `${selectedPlatform.color}18` }}
                >
                  {(() => {
                    const PIcon = getIcon(selectedPlatform.icon)
                    return <PIcon className="h-3.5 w-3.5" style={{ color: selectedPlatform.color }} />
                  })()}
                </div>
                <span className="text-xs font-medium text-foreground">
                  {selectedPlatform.name}
                </span>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {selectedPlatform.children.map((child) => {
                  const ChildIcon = getIcon(child.icon)
                  const isSelected = value === child.id
                  return (
                    <motion.button
                      key={child.id}
                      type="button"
                      onClick={() => handleChildClick(child.id)}
                      whileTap={{ scale: 0.97 }}
                      className={`relative flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-transparent ring-2"
                          : "border-border hover:bg-accent/40"
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
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex h-5 w-5 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${child.color}25` }}
                        >
                          <Check className="h-3 w-3" style={{ color: child.color }} />
                        </motion.div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Show selected category below */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: selectedCategory.color }}
          />
          <span>
            Selected: <span className="font-medium text-foreground">{selectedCategory.name}</span>
          </span>
        </motion.div>
      )}
    </div>
  )
}

/** Recursively find a category by ID */
function findCategory(
  categories: CategoryWithChildren[],
  id: string
): CategoryWithChildren | null {
  for (const cat of categories) {
    if (cat.id === id) return cat
    const found = findCategory(cat.children, id)
    if (found) return found
  }
  return null
}
