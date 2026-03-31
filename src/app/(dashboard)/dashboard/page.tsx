import { redirect } from "next/navigation"
import Link from "next/link"
import { AnimatedLayout } from "@/components/ui/animated-layout"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { StatusBadge } from "@/components/ui/status-badge"
import { PriorityBadge } from "@/components/ui/priority-badge"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { tickets, categories, users } from "@/lib/db/schema"
import { eq, and, count, desc } from "drizzle-orm"
import { Inbox } from "lucide-react"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  // Query ticket stats by status
  const statsRows = await db
    .select({
      status: tickets.status,
      count: count(),
    })
    .from(tickets)
    .where(eq(tickets.orgId, session.orgId))
    .groupBy(tickets.status)

  const stats = { total: 0, open: 0, inProgress: 0, resolved: 0 }
  for (const row of statsRows) {
    stats.total += row.count
    if (row.status === "open") stats.open = row.count
    else if (row.status === "in_progress") stats.inProgress = row.count
    else if (row.status === "resolved") stats.resolved = row.count
  }

  // Query recent 5 tickets with category + assignee joins
  const recentTickets = await db
    .select({
      id: tickets.id,
      ticketNumber: tickets.ticketNumber,
      title: tickets.title,
      status: tickets.status,
      priority: tickets.priority,
      createdAt: tickets.createdAt,
      categoryName: categories.name,
      categoryColor: categories.color,
      assigneeName: users.name,
    })
    .from(tickets)
    .leftJoin(categories, eq(tickets.categoryId, categories.id))
    .leftJoin(users, eq(tickets.assignedTo, users.id))
    .where(eq(tickets.orgId, session.orgId))
    .orderBy(desc(tickets.createdAt))
    .limit(5)

  return (
    <AnimatedLayout>
      <div className="p-8">
        <PageHeader
          title="Dashboard"
          description="Overview of your support operations"
        />

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Tickets" value={stats.total} accentColor="zinc" />
          <StatCard label="Open" value={stats.open} className="text-blue-400" accentColor="blue" />
          <StatCard label="In Progress" value={stats.inProgress} className="text-amber-400" accentColor="amber" />
          <StatCard label="Resolved (this week)" value={stats.resolved} className="text-emerald-400" accentColor="emerald" />
        </div>

        {/* Recent tickets */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Tickets</h2>
            <Link
              href="/dashboard/tickets"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="space-y-2">
            {recentTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/dashboard/tickets/${ticket.id}`}
                className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-card/80 hover:shadow-lg hover:shadow-violet-500/5 hover:border-violet-500/20"
              >
                <div className="relative flex items-center">
                  <StatusBadge status={ticket.status} />
                  {ticket.status === "open" && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  #{ticket.ticketNumber}
                </span>
                <span className="flex-1 truncate text-sm transition-colors duration-150 group-hover:text-foreground">{ticket.title}</span>
                <PriorityBadge priority={ticket.priority} />
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {formatTimeAgo(ticket.createdAt)}
                </span>
              </Link>
            ))}
            {recentTickets.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
                <Inbox className="h-10 w-10 text-zinc-600" />
                <p className="mt-4 text-sm font-medium text-muted-foreground">
                  No tickets yet
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Your team is on top of things!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedLayout>
  )
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}
