"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/ui/status-badge"
import { PriorityBadge } from "@/components/ui/priority-badge"
import { mockTickets, mockMessages, mockUsers, mockCategories } from "@/lib/mock-data"
import { ArrowLeft, Send, Lock } from "lucide-react"
import Link from "next/link"
import type { TicketStatus, TicketPriority } from "@/lib/types"

export default function TicketDetailPage() {
  const params = useParams()
  const ticket = mockTickets.find((t) => t.id === params.id) ?? mockTickets[0]
  const messages = mockMessages.filter((m) => m.ticketId === ticket.id)

  const [newMessage, setNewMessage] = useState("")
  const [isInternal, setIsInternal] = useState(false)
  const [status, setStatus] = useState<TicketStatus>(ticket.status)
  const [priority, setPriority] = useState<TicketPriority>(ticket.priority)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border px-8 py-4">
        <Link
          href="/dashboard/tickets"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">{ticket.title}</h1>
          <p className="text-xs text-muted-foreground">
            <span className="font-mono">#{ticket.ticketNumber}</span> opened by {ticket.creator.name}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Conversation thread */}
        <div className="flex flex-1 flex-col border-r border-border">
          <div className="flex-1 space-y-4 overflow-y-auto p-8">
            {/* Original description */}
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {ticket.creator.name.charAt(0)}
                </div>
                <span className="text-sm font-medium">{ticket.creator.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(ticket.createdAt)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">{ticket.description}</p>
            </div>

            {/* Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-lg border p-4 ${
                  msg.isInternal
                    ? "border-dashed border-amber-500/30 bg-amber-500/5"
                    : "border-border bg-card"
                }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {msg.author.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{msg.author.name}</span>
                  {msg.isInternal && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
                      <Lock className="h-2.5 w-2.5" />
                      Internal
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(msg.createdAt)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">{msg.content}</p>
              </div>
            ))}
          </div>

          {/* Reply box */}
          <div className="border-t border-border p-4">
            <div className="mb-2 flex items-center gap-3">
              <button
                onClick={() => setIsInternal(false)}
                className={`text-xs font-medium transition-colors ${
                  !isInternal ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Reply
              </button>
              <button
                onClick={() => setIsInternal(true)}
                className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                  isInternal ? "text-amber-400" : "text-muted-foreground"
                }`}
              >
                <Lock className="h-3 w-3" />
                Internal Note
              </button>
            </div>
            <div className="flex gap-2">
              <Textarea
                placeholder={isInternal ? "Add an internal note..." : "Write a reply..."}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={2}
                className="min-h-0 resize-none"
              />
              <Button size="icon" className="shrink-0 self-end">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Metadata sidebar */}
        <div className="hidden w-80 space-y-6 overflow-y-auto p-6 lg:block">
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TicketStatus)}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TicketPriority)}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Category</label>
            <select className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm">
              <option value="">None</option>
              {mockCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">Assignee</label>
            <select className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm">
              <option value="">Unassigned</option>
              {mockUsers.slice(0, 3).map((user) => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>

          <div className="border-t border-border pt-4">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={status} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Priority</span>
                <PriorityBadge priority={priority} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ticket #</span>
                <span className="font-mono">{ticket.ticketNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{ticket.createdAt.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
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
