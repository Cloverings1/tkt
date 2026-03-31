import Link from "next/link"
import { Plus, UserPlus, Sparkles } from "lucide-react"

export function WelcomeBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-violet-500 to-blue-500 p-8 shadow-xl shadow-violet-500/10">
      {/* Decorative background elements */}
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-blue-400/15 blur-2xl" />
      <div className="absolute right-12 top-6 h-2 w-2 rounded-full bg-white/40" />
      <div className="absolute right-24 top-14 h-1.5 w-1.5 rounded-full bg-white/25" />

      <div className="relative">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-5 w-5 text-violet-200" />
          <span className="text-xs font-semibold uppercase tracking-widest text-violet-200">
            Getting Started
          </span>
        </div>

        <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
          Welcome to TKT
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-violet-100/90">
          Create your first ticket or invite your team to get started.
          Your support dashboard is ready to go.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard/tickets/new"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 shadow-sm transition-all duration-200 hover:bg-violet-50 hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Create Ticket
          </Link>
          <Link
            href="/dashboard/team"
            className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:border-white/40"
          >
            <UserPlus className="h-4 w-4" />
            Invite Team
          </Link>
        </div>
      </div>
    </div>
  )
}
