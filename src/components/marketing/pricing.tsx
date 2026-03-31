import Link from "next/link"
import { ArrowRight, Sparkles, Shield, Zap, Users } from "lucide-react"

const highlights = [
  { icon: Zap, text: "Unlimited tickets & workflows" },
  { icon: Users, text: "Full team collaboration" },
  { icon: Shield, text: "Enterprise-grade security" },
  { icon: Sparkles, text: "Priority onboarding & support" },
]

export function Pricing() {
  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Get Early Access
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            We&apos;re onboarding select teams for our research preview.
            Apply today to shape the future of support.
          </p>
        </div>

        <div className="relative mx-auto max-w-lg">
          {/* Ambient glow */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-b from-violet-500/15 via-violet-500/5 to-transparent blur-2xl" />
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-violet-500/20 via-violet-400/10 to-transparent opacity-60" />

          {/* Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/80 backdrop-blur-sm">
            {/* Shimmer top edge */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

            <div className="p-10 sm:p-12">
              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-xs font-medium tracking-wide text-violet-300">
                  Research Preview
                </span>
              </div>

              {/* Pricing */}
              <div className="mb-2">
                <span className="text-5xl font-bold tracking-tight">Invitation</span>
              </div>
              <p className="mb-10 text-muted-foreground">
                Pricing details shared upon acceptance into the program.
              </p>

              {/* Features */}
              <div className="mb-10 grid gap-4 sm:grid-cols-2">
                {highlights.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03]">
                      <Icon className="h-4 w-4 text-violet-400" />
                    </div>
                    <span className="text-sm text-zinc-300">{text}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href="/signup"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 py-3.5 text-center font-medium text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30 hover:brightness-110"
              >
                Apply for Research Preview
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <p className="mt-5 text-center text-xs text-zinc-500">
                Limited spots available &middot; By invitation only
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
