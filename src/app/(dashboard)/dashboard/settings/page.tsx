import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mockOrg } from "@/lib/mock-data"

export default function SettingsPage() {
  return (
    <div className="p-8">
      <PageHeader title="Settings" description="Manage your organization" />

      <div className="mt-8 max-w-xl space-y-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Organization</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization name</Label>
              <Input
                id="orgName"
                defaultValue={mockOrg.name}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL slug</Label>
              <Input
                id="slug"
                defaultValue={mockOrg.slug}
              />
              <p className="text-xs text-muted-foreground">
                Used in URLs and API references
              </p>
            </div>

            <Button>Save Changes</Button>
          </div>
        </div>

        <div className="rounded-xl border border-destructive/30 bg-card p-6">
          <h2 className="mb-2 text-lg font-semibold text-destructive">Danger Zone</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Permanently delete this organization and all its data.
          </p>
          <Button variant="destructive">Delete Organization</Button>
        </div>
      </div>
    </div>
  )
}
