import Link from "next/link"
import { ArrowRight, FlaskConical, Lock, BarChart3, Cpu, Globe } from "lucide-react"

const inclusions = [
  { icon: FlaskConical, text: "Early access to experimental features" },
  { icon: BarChart3, text: "Direct input on product roadmap" },
  { icon: Lock, text: "Dedicated environment with full data isolation" },
  { icon: Cpu, text: "Advanced workflow automation (beta)" },
  { icon: Globe, text: "White-glove onboarding with our engineering team" },
]

export function Pricing() {
  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Research Preview
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            We&apos;re partnering with a small group of teams to refine TKT
            before general availability. Acceptance is limited.
          </p>
        </div>

        <div className="relative mx-auto max-w-xl">
          {/* Ambient glow */}
          <div className="absolute -inset-6 rounded-3xl bg-gradient-to-b from-violet-500/10 via-violet-500/5 to-transparent blur-3xl" />

          {/* Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/90 backdrop-blur-sm">
            {/* Top shimmer */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />

            <div className="p-10 sm:p-12">
              {/* Header */}
              <div className="mb-10">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.07] px-3.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                  <span className="text-xs font-medium tracking-widest uppercase text-violet-300">
                    Limited Enrollment
                  </span>
                </div>
                <h3 className="mb-3 text-2xl font-semibold tracking-tight">
                  Research Preview Program
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  Selected organizations receive full platform access, a direct line
                  to our team, and the ability to shape TKT&apos;s direction.
                  Pricing is determined during the review process.
                </p>
              </div>

              {/* Divider */}
              <div className="mb-10 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              {/* Inclusions */}
              <div className="mb-10 space-y-5">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                  What&apos;s included
                </p>
                {inclusions.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3.5">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.02]">
                      <Icon className="h-3.5 w-3.5 text-violet-400" />
                    </div>
                    <span className="text-sm leading-snug text-zinc-300">{text}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href="/apply"
                className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 py-3.5 text-center text-sm font-medium text-white shadow-lg shadow-violet-500/15 transition-all hover:shadow-violet-500/25 hover:brightness-110"
              >
                Apply for Research Preview
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <p className="mt-5 text-center text-xs leading-relaxed text-zinc-600">
                Applications are reviewed on a rolling basis.
                We&apos;ll be in touch within 5 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
