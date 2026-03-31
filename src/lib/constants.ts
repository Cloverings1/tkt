import type { TicketStatus, TicketPriority, OrgRole } from "./types"

export const TICKET_STATUSES: { value: TicketStatus; label: string; color: string }[] = [
  { value: "open", label: "Open", color: "bg-blue-500" },
  { value: "in_progress", label: "In Progress", color: "bg-amber-500" },
  { value: "resolved", label: "Resolved", color: "bg-emerald-500" },
  { value: "closed", label: "Closed", color: "bg-zinc-500" },
]

export const TICKET_PRIORITIES: { value: TicketPriority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "text-zinc-400" },
  { value: "medium", label: "Medium", color: "text-blue-400" },
  { value: "high", label: "High", color: "text-amber-400" },
  { value: "urgent", label: "Urgent", color: "text-red-500" },
]

export const ORG_ROLES: { value: OrgRole; label: string; description: string }[] = [
  { value: "admin", label: "Admin", description: "Full access to all settings and data" },
  { value: "agent", label: "Agent", description: "Can manage and respond to tickets" },
  { value: "customer", label: "Customer", description: "Can create and view own tickets" },
]

export const STATUS_COLOR_MAP: Record<TicketStatus, string> = {
  open: "bg-blue-500",
  in_progress: "bg-amber-500",
  resolved: "bg-emerald-500",
  closed: "bg-zinc-500",
}

export const PRIORITY_COLOR_MAP: Record<TicketPriority, string> = {
  low: "text-zinc-400 bg-zinc-400/10",
  medium: "text-blue-400 bg-blue-400/10",
  high: "text-amber-400 bg-amber-400/10",
  urgent: "text-red-500 bg-red-500/10",
}
