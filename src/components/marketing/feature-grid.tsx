import { Zap, Tags, Users, Palette } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Real-time Tracking",
    description: "See ticket updates the moment they happen. No refresh needed, no delays.",
  },
  {
    icon: Tags,
    title: "Priority & Categories",
    description: "Organize tickets with custom categories, color coding, and four priority levels.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Assign tickets, leave internal notes, and keep your whole team in sync.",
  },
  {
    icon: Palette,
    title: "Beautiful by Default",
    description: "A dark-mode interface designed for focus. No configuration needed.",
  },
]

export function FeatureGrid() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to resolve faster
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Built for IT teams that take support seriously. Every feature designed
            to reduce resolution time and keep your customers happy.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-8 transition-colors hover:border-border/80 hover:bg-card/80"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
