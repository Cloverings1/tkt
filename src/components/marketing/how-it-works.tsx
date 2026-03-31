import { UserPlus, Settings, Rocket } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Sign up your team",
    description: "Create your organization and invite team members in seconds. No credit card required.",
  },
  {
    icon: Settings,
    number: "02",
    title: "Configure your workspace",
    description: "Set up categories, priority levels, and color coding that matches your workflow.",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Start resolving",
    description: "Open tickets, assign to agents, and track everything in one beautiful dashboard.",
  },
]

export function HowItWorks() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Up and running in minutes
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            No complex setup. No consultants needed. Just sign up and go.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative text-center">
              <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="mb-2 font-mono text-xs text-primary">{step.number}</div>
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
