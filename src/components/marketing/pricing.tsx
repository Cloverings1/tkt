import Link from "next/link"
import { Check } from "lucide-react"

const features = [
  "Unlimited tickets",
  "Full team collaboration",
  "All features included",
  "Priority onboarding",
]

export function Pricing() {
  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Pricing
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Free while in beta. Simple pricing coming soon.
          </p>
        </div>

        <div className="mx-auto max-w-md rounded-xl border border-primary/30 bg-card p-10 shadow-lg shadow-primary/10">
          <p className="mb-4 font-mono text-sm text-primary">Early Access</p>

          <div className="mb-8 flex items-baseline gap-2">
            <span className="text-4xl font-bold">Free</span>
            <span className="text-muted-foreground">during beta</span>
          </div>

          <ul className="mb-8 space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm">
                <Check className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/signup"
            className="block w-full rounded-lg bg-primary py-3 text-center font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Apply for Early Access
          </Link>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            No credit card required
          </p>
        </div>
      </div>
    </section>
  )
}
