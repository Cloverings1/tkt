import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { StatusBadge } from "@/components/ui/status-badge"
import { PriorityBadge } from "@/components/ui/priority-badge"
import { mockTickets, mockStats } from "@/lib/mock-data"
import Link from "next/link"

export default function DashboardPage() {
  const recentTickets = mockTickets.slice(0, 5)

  return (
    <div className="p-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your support operations"
      />

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Tickets" value={mockStats.total} />
        <StatCard label="Open" value={mockStats.open} className="text-blue-400" />
        <StatCard label="In Progress" value={mockStats.inProgress} className="text-amber-400" />
        <StatCard label="Resolved (this week)" value={mockStats.resolved} className="text-emerald-400" />
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
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-card/80"
            >
              <StatusBadge status={ticket.status} />
              <span className="font-mono text-xs text-muted-foreground">
                #{ticket.ticketNumber}
              </span>
              <span className="flex-1 truncate text-sm">{ticket.title}</span>
              <PriorityBadge priority={ticket.priority} />
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(ticket.createdAt)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
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
