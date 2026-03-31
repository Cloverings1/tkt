import { cn } from "@/lib/utils"
import { TrendingUp } from "lucide-react"

export function StatCard({
  label,
  value,
  className,
  accentColor,
}: {
  label: string
  value: string | number
  className?: string
  accentColor?: "blue" | "amber" | "emerald" | "zinc"
}) {
  const borderColorMap = {
    blue: "border-l-blue-500",
    amber: "border-l-amber-500",
    emerald: "border-l-emerald-500",
    zinc: "border-l-zinc-600",
  }

  const trendColorMap = {
    blue: "text-blue-400",
    amber: "text-amber-400",
    emerald: "text-emerald-400",
    zinc: "text-zinc-400",
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 transition-colors duration-200 hover:bg-card/80",
        accentColor && "border-l-[3px]",
        accentColor && borderColorMap[accentColor]
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {accentColor && (
          <TrendingUp
            className={cn("h-3.5 w-3.5", trendColorMap[accentColor])}
          />
        )}
      </div>
      <p className={cn("mt-1 text-2xl font-bold font-mono tracking-tight", className)}>
        {value}
      </p>
    </div>
  )
}
