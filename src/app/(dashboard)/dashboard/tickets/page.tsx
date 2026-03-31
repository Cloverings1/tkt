"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { AnimatedLayout } from "@/components/ui/animated-layout"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { StatusBadge } from "@/components/ui/status-badge"
import { PriorityBadge } from "@/components/ui/priority-badge"
import type { TicketStatus, TicketPriority } from "@/lib/types"

interface TicketRow {
  id: string
  ticketNumber: number
  title: string
  status: TicketStatus
  priority: TicketPriority
  categoryName: string | null
  categoryColor: string | null
  assigneeName: string | null
  createdAt: string
}

export default function TicketsPage() {
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "all">("all")
  const [tickets, setTickets] = useState<TicketRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams()
    if (statusFilter !== "all") params.set("status", statusFilter)
    if (priorityFilter !== "all") params.set("priority", priorityFilter)

    setLoading(true)
    fetch(`/api/tickets?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setTickets(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [statusFilter, priorityFilter])

  return (
    <AnimatedLayout>
    <div className="p-8">
      <PageHeader
        title={
          <span className="flex items-center gap-2.5">
            Tickets
            {!loading && tickets.length > 0 && (
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-violet-500/15 px-2 text-xs font-semibold text-violet-400">
                {tickets.length}
              </span>
            )}
          </span>
        }
        description="Manage and track support tickets"
      >
        <Link href="/dashboard/tickets/new">
          <Button className="relative shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-shadow duration-300">
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </Link>
      </PageHeader>

      {/* Filters */}
      <div className="mt-6 flex gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TicketStatus | "all")}
          className="rounded-full border border-border bg-zinc-900 px-4 py-1.5 text-sm text-foreground transition-colors duration-150 hover:border-violet-500/40 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | "all")}
          className="rounded-full border border-border bg-zinc-900 px-4 py-1.5 text-sm text-foreground transition-colors duration-150 hover:border-violet-500/40 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* Ticket table */}
      <div className="mt-6 rounded-xl border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Assignee</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-3"><div className="h-5 w-20 rounded bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%] animate-shimmer" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-10 rounded bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%] animate-shimmer" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-48 rounded bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%] animate-shimmer" /></td>
                  <td className="px-4 py-3"><div className="h-5 w-16 rounded bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%] animate-shimmer" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-20 rounded bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%] animate-shimmer" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-24 rounded bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%] animate-shimmer" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-14 rounded bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%] animate-shimmer" /></td>
                </tr>
              ))
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No tickets match your filters.
                </td>
              </tr>
            ) : (
              tickets.map((ticket, index) => (
                <motion.tr
                  key={ticket.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04, ease: "easeOut" }}
                  className="border-b border-border/50 transition-colors duration-150 last:border-0 hover:bg-violet-500/[0.03]"
                >
                  <td className="px-4 py-3">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {ticket.ticketNumber}
                  </td>
                  <td className="max-w-xs px-4 py-3">
                    <Link
                      href={`/dashboard/tickets/${ticket.id}`}
                      className="text-sm transition-colors duration-150 hover:text-primary hover:underline"
                    >
                      {ticket.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={ticket.priority} />
                  </td>
                  <td className="px-4 py-3">
                    {ticket.categoryName && (
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: ticket.categoryColor ?? undefined }}
                        />
                        {ticket.categoryName}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {ticket.assigneeName ?? (
                      <span className="italic text-zinc-600">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground tabular-nums">
                    {formatTimeAgo(new Date(ticket.createdAt))}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
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
