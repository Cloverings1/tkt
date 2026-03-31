"use client"

import { useEffect, useState, useCallback } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import type { OrgRole } from "@/lib/types"

interface TeamMember {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  role: OrgRole
  joinedAt: string
}

const roleColors: Record<OrgRole, string> = {
  admin: "bg-violet-500/10 text-violet-400",
  agent: "bg-blue-500/10 text-blue-400",
  customer: "bg-zinc-500/10 text-zinc-400",
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  const loadMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/team")
      if (!res.ok) throw new Error("Failed to load team members")
      const data = await res.json()
      setMembers(data)
    } catch (err) {
      console.error("Failed to load team:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMembers()
  }, [loadMembers])

  return (
    <div className="p-8">
      <PageHeader title="Team" description="Manage team members and roles">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </PageHeader>

      {loading ? (
        <div className="mt-8 flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : members.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p className="text-sm">No team members yet.</p>
        </div>
      ) : (
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
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {member.name.charAt(0).toUpperCase()}
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
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
