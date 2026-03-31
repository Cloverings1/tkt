import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { mockUsers } from "@/lib/mock-data"
import { Plus } from "lucide-react"

const mockTeam = [
  { ...mockUsers[0], role: "admin" as const },
  { ...mockUsers[1], role: "agent" as const },
  { ...mockUsers[2], role: "agent" as const },
  { ...mockUsers[3], role: "customer" as const },
  { ...mockUsers[4], role: "customer" as const },
]

const roleColors = {
  admin: "bg-violet-500/10 text-violet-400",
  agent: "bg-blue-500/10 text-blue-400",
  customer: "bg-zinc-500/10 text-zinc-400",
}

export default function TeamPage() {
  return (
    <div className="p-8">
      <PageHeader title="Team" description="Manage team members and roles">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </PageHeader>

      <div className="mt-8 rounded-xl border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {mockTeam.map((member) => (
              <tr
                key={member.id}
                className="border-b border-border/50 last:border-0"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {member.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{member.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {member.email}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize ${roleColors[member.role]}`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {member.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
