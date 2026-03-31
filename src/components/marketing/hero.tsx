import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 pt-16">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-orb-slow rounded-full bg-violet-500/20 blur-[120px]" />
        <div className="absolute left-1/3 top-2/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 animate-orb-slow-reverse rounded-full bg-blue-500/15 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center rounded-full border border-border/60 bg-card/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Now in public beta
        </div>

        <h1 className="mb-6 text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
          Support tickets,{" "}
          <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            solved.
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          The modern ticketing platform for technical support teams.
          Beautiful, fast, and built for the way your team actually works.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="group inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:gap-3"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#features"
            className="inline-flex h-12 items-center rounded-lg border border-border px-6 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
          >
            See how it works
          </a>
        </div>
      </div>
    </section>
  )
}
