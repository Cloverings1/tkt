import { Ticket } from "lucide-react"

export function Footer() {
  return (
    <footer className="px-6 py-16">
      <div className="mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 pt-12 text-center">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Ticket className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold">TKT</span>
        </div>

        <p className="text-sm text-muted-foreground">Modern support, simplified.</p>

        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#" className="transition-colors hover:text-foreground">Privacy</a>
          <a href="#" className="transition-colors hover:text-foreground">Terms</a>
          <a href="#" className="transition-colors hover:text-foreground">GitHub</a>
        </div>

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} TKT. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
