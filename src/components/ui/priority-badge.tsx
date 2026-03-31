import { cn } from "@/lib/utils"
import { PRIORITY_COLOR_MAP } from "@/lib/constants"
import type { TicketPriority } from "@/lib/types"

const labelMap: Record<TicketPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
}

export function PriorityBadge({ priority, className }: { priority: TicketPriority; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        PRIORITY_COLOR_MAP[priority],
        className
      )}
    >
      {labelMap[priority]}
    </span>
  )
}
