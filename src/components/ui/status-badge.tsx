import { cn } from "@/lib/utils"
import { STATUS_COLOR_MAP } from "@/lib/constants"
import type { TicketStatus } from "@/lib/types"

const labelMap: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
}

export function StatusBadge({ status, className }: { status: TicketStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", className)}>
      <span className={cn("h-2 w-2 rounded-full", STATUS_COLOR_MAP[status])} />
      {labelMap[status]}
    </span>
  )
}
