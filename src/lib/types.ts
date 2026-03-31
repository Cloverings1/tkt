export type OrgRole = "admin" | "agent" | "customer"
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed"
export type TicketPriority = "low" | "medium" | "high" | "urgent"

export interface Organization {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  createdAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  createdAt: Date
}

export interface OrgMembership {
  id: string
  userId: string
  orgId: string
  role: OrgRole
  createdAt: Date
}

export interface Category {
  id: string
  orgId: string
  name: string
  color: string
  icon: string | null
  parentId: string | null
  createdAt: Date
}

export interface Ticket {
  id: string
  orgId: string
  ticketNumber: number
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  categoryId: string | null
  assignedTo: string | null
  createdBy: string
  createdAt: Date
  updatedAt: Date
  closedAt: Date | null
}

export interface TicketMessage {
  id: string
  ticketId: string
  authorId: string
  content: string
  isInternal: boolean
  createdAt: Date
}

export interface TicketWithRelations extends Ticket {
  category: Category | null
  assignee: User | null
  creator: User
}

export interface TicketMessageWithAuthor extends TicketMessage {
  author: User
}

export interface SessionPayload {
  sub: string
  orgId: string
  role: OrgRole
  exp: number
}

export interface UserWithMemberships extends User {
  memberships: (OrgMembership & { organization: Organization })[]
}
