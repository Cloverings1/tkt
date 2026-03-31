"use client"

import { useEffect, useState, useCallback } from "react"
import { AnimatedLayout } from "@/components/ui/animated-layout"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Loader2, Shield, Headset, User } from "lucide-react"
import { motion } from "motion/react"
import type { LucideIcon } from "lucide-react"
import type { OrgRole } from "@/lib/types"

interface TeamMember {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  role: OrgRole
  joinedAt: string
}

const roleConfig: Record<OrgRole, {
  badge: string
  avatar: string
  icon: LucideIcon
  label: string
}> = {
  admin: {
    badge: "bg-violet-500/15 text-violet-400 border border-violet-500/20",
    avatar: "bg-violet-500/20 text-violet-400 ring-violet-500/30",
    icon: Shield,
    label: "Admin",
  },
  agent: {
    badge: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
    avatar: "bg-blue-500/20 text-blue-400 ring-blue-500/30",
    icon: Headset,
    label: "Agent",
  },
  customer: {
    badge: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/20",
    avatar: "bg-zinc-500/20 text-zinc-400 ring-zinc-500/30",
    icon: User,
    label: "Customer",
  },
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Form fields
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<OrgRole>("agent")

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

  function resetForm() {
    setEmail("")
    setRole("agent")
    setError("")
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to invite member")
      }

      setDialogOpen(false)
      resetForm()
      await loadMembers()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatedLayout>
    <div className="p-8">
      <PageHeader title="Team" description="Manage team members and roles">
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger
            render={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your organization.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={(val) => setRole(val as OrgRole)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <DialogFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Invite
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
        <div className="mt-8 rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-zinc-900/50 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3.5">Member</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => {
                const config = roleConfig[member.role]
                const RoleIcon = config.icon
                return (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                    className="border-b border-border/50 last:border-0 transition-colors duration-150 hover:bg-zinc-900/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ring-2 ${config.avatar}`}>
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-foreground">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground font-mono">
                      {member.email}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${config.badge}`}>
                        <RoleIcon className="h-3 w-3" />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground font-mono">
                      {new Date(member.joinedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </AnimatedLayout>
  )
}
