import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  className,
}: {
  label: string
  value: string | number
  className?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-2xl font-bold font-mono tracking-tight", className)}>
        {value}
      </p>
    </div>
  )
}
