import { AnimatedLayout } from "@/components/ui/animated-layout"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { mockCategories } from "@/lib/mock-data"
import { Plus } from "lucide-react"

export default function CategoriesPage() {
  return (
    <AnimatedLayout>
    <div className="p-8">
      <PageHeader title="Categories" description="Organize tickets by category">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </PageHeader>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockCategories.map((category) => (
          <div
            key={category.id}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:bg-card/80"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${category.color}15` }}
            >
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">{category.name}</h3>
              <p className="text-xs text-muted-foreground">{category.color}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </AnimatedLayout>
  )
}
