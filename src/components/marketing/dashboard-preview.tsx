export function DashboardPreview() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-violet-500/5">
          {/* Glow effect */}
          <div className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-b from-violet-500/20 via-transparent to-transparent opacity-50" />

          {/* Mock window chrome */}
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-zinc-700" />
            <div className="h-3 w-3 rounded-full bg-zinc-700" />
            <div className="h-3 w-3 rounded-full bg-zinc-700" />
            <div className="ml-4 h-6 flex-1 rounded-md bg-zinc-800/50" />
          </div>

          {/* Mock dashboard */}
          <div className="flex">
            {/* Sidebar */}
            <div className="hidden w-56 border-r border-border bg-zinc-900/50 p-4 sm:block">
              <div className="mb-6 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/20" />
                <div className="h-4 w-20 rounded bg-zinc-800" />
              </div>
              {["Dashboard", "Tickets", "Categories", "Team", "Settings"].map((item, i) => (
                <div
                  key={item}
                  className={`mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-xs ${
                    i === 1 ? "bg-primary/10 text-primary" : "text-zinc-500"
                  }`}
                >
                  <div className={`h-3.5 w-3.5 rounded ${i === 1 ? "bg-primary/30" : "bg-zinc-700"}`} />
                  {item}
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="flex-1 p-6">
              {/* Stats row */}
              <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Open", value: "23", color: "text-blue-400" },
                  { label: "In Progress", value: "18", color: "text-amber-400" },
                  { label: "Resolved", value: "12", color: "text-emerald-400" },
                  { label: "Avg. Time", value: "4.2h", color: "text-violet-400" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-border bg-zinc-900/50 p-3">
                    <p className="text-[10px] text-zinc-500">{stat.label}</p>
                    <p className={`text-lg font-bold font-mono ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Mock ticket rows */}
              <div className="space-y-2">
                {[
                  { status: "bg-blue-500", priority: "text-amber-400", title: "VPN connection drops for remote team", id: "#1042", time: "2h ago" },
                  { status: "bg-amber-500", priority: "text-blue-400", title: "New employee laptop setup request", id: "#1041", time: "1d ago" },
                  { status: "bg-blue-500", priority: "text-red-500", title: "Slack integration not syncing", id: "#1040", time: "45m ago" },
                  { status: "bg-emerald-500", priority: "text-amber-400", title: "SSL certificate renewal — staging", id: "#1039", time: "2d ago" },
                ].map((ticket) => (
                  <div key={ticket.id} className="flex items-center gap-3 rounded-lg border border-border/50 bg-zinc-900/30 px-4 py-3">
                    <div className={`h-2 w-2 rounded-full ${ticket.status}`} />
                    <span className="font-mono text-[11px] text-zinc-500">{ticket.id}</span>
                    <span className="flex-1 truncate text-xs">{ticket.title}</span>
                    <span className={`text-[10px] font-medium ${ticket.priority}`}>!</span>
                    <span className="text-[10px] text-zinc-600">{ticket.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
