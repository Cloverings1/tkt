"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Ticket,
  Tags,
  Users,
  Settings,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  Menu,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/tickets", label: "Tickets", icon: Ticket },
  { href: "/dashboard/categories", label: "Categories", icon: Tags },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

function NavLinks({
  pathname,
  collapsed,
  onNavigate,
}: {
  pathname: string
  collapsed: boolean
  onNavigate?: () => void
}) {
  return (
    <>
      {navItems.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href)
        const isTickets = item.href === "/dashboard/tickets"

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-gradient-to-r from-violet-500/15 via-violet-500/8 to-transparent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              collapsed && "justify-center px-0"
            )}
            title={collapsed ? item.label : undefined}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-violet-500" />
            )}
            <item.icon className={cn(
              "h-4.5 w-4.5 shrink-0 transition-transform duration-200",
              "group-hover:scale-110",
              isActive && "text-violet-400"
            )} />
            {!collapsed && (
              <span className="relative">
                {item.label}
                {isTickets && (
                  <span className="absolute -right-3 -top-0.5 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                )}
              </span>
            )}
            {collapsed && isTickets && (
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
            )}
          </Link>
        )
      })}
    </>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <>
      {/* Mobile hamburger button */}
      <div className="fixed left-4 top-4 z-50 md:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-accent"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" showCloseButton={true} className="w-64 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            {/* Mobile sidebar content */}
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center gap-2.5 border-b border-border px-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-[0_0_12px_rgba(139,92,246,0.4)]">
                  <Ticket className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-bold tracking-tight">TKT</span>
              </div>

              <nav className="flex-1 space-y-1 p-3">
                <NavLinks
                  pathname={pathname}
                  collapsed={false}
                  onNavigate={() => setSheetOpen(false)}
                />
              </nav>

              <div className="border-t border-border p-3">
                <button
                  onClick={() => {
                    setSheetOpen(false)
                    handleLogout()
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
                >
                  <LogOut className="h-4.5 w-4.5 shrink-0" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden h-screen flex-col border-r border-border bg-card transition-[width] duration-200 md:flex",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                <Ticket className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold tracking-tight">TKT</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-accent-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          <NavLinks pathname={pathname} collapsed={collapsed} />
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3">
          <button
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-red-500/10 hover:text-red-400",
              collapsed && "justify-center px-0"
            )}
            title={collapsed ? "Sign out" : undefined}
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
