import type {
  User,
  Organization,
  Category,
  TicketWithRelations,
  TicketMessageWithAuthor,
} from "./types"

const now = new Date()
const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000)
const hoursAgo = (n: number) => new Date(now.getTime() - n * 3600000)
const minutesAgo = (n: number) => new Date(now.getTime() - n * 60000)

export const mockOrg: Organization = {
  id: "org-1",
  name: "Acme Corp",
  slug: "acme-corp",
  logoUrl: null,
  createdAt: daysAgo(90),
}

export const mockUsers: User[] = [
  { id: "user-1", email: "admin@acme.com", name: "Sarah Chen", avatarUrl: null, createdAt: daysAgo(90) },
  { id: "user-2", email: "agent@acme.com", name: "Marcus Rivera", avatarUrl: null, createdAt: daysAgo(60) },
  { id: "user-3", email: "agent2@acme.com", name: "Emily Watson", avatarUrl: null, createdAt: daysAgo(45) },
  { id: "user-4", email: "customer@client.com", name: "David Park", avatarUrl: null, createdAt: daysAgo(30) },
  { id: "user-5", email: "customer2@client.com", name: "Lisa Nguyen", avatarUrl: null, createdAt: daysAgo(14) },
]

export const mockCategories: Category[] = [
  { id: "cat-1", orgId: "org-1", name: "Network", color: "#3b82f6", icon: "wifi", createdAt: daysAgo(85) },
  { id: "cat-2", orgId: "org-1", name: "Hardware", color: "#f59e0b", icon: "monitor", createdAt: daysAgo(85) },
  { id: "cat-3", orgId: "org-1", name: "Software", color: "#8b5cf6", icon: "code", createdAt: daysAgo(85) },
  { id: "cat-4", orgId: "org-1", name: "Security", color: "#ef4444", icon: "shield", createdAt: daysAgo(85) },
  { id: "cat-5", orgId: "org-1", name: "Account", color: "#10b981", icon: "user", createdAt: daysAgo(80) },
]

export const mockTickets: TicketWithRelations[] = [
  {
    id: "tkt-1", orgId: "org-1", ticketNumber: 1042,
    title: "VPN connection drops intermittently for remote team",
    description: "Multiple users on the remote team are reporting that their VPN connection drops every 30-45 minutes, requiring them to reconnect.",
    status: "open", priority: "high",
    categoryId: "cat-1", assignedTo: "user-2", createdBy: "user-4",
    createdAt: hoursAgo(2), updatedAt: hoursAgo(1), closedAt: null,
    category: mockCategories[0], assignee: mockUsers[1], creator: mockUsers[3],
  },
  {
    id: "tkt-2", orgId: "org-1", ticketNumber: 1041,
    title: "New employee laptop setup request",
    description: "Need a new MacBook Pro configured with standard development tools for the new backend engineer starting next Monday.",
    status: "in_progress", priority: "medium",
    categoryId: "cat-2", assignedTo: "user-3", createdBy: "user-1",
    createdAt: daysAgo(1), updatedAt: hoursAgo(4), closedAt: null,
    category: mockCategories[1], assignee: mockUsers[2], creator: mockUsers[0],
  },
  {
    id: "tkt-3", orgId: "org-1", ticketNumber: 1040,
    title: "Slack integration not syncing with project channels",
    description: "The Slack bot is no longer posting updates to the #engineering channel. Last working yesterday around 3pm.",
    status: "open", priority: "urgent",
    categoryId: "cat-3", assignedTo: null, createdBy: "user-5",
    createdAt: minutesAgo(45), updatedAt: minutesAgo(45), closedAt: null,
    category: mockCategories[2], assignee: null, creator: mockUsers[4],
  },
  {
    id: "tkt-4", orgId: "org-1", ticketNumber: 1039,
    title: "SSL certificate expiring on staging server",
    description: "The SSL certificate for staging.acme.com expires in 3 days. Need to renew before it causes deployment issues.",
    status: "resolved", priority: "high",
    categoryId: "cat-4", assignedTo: "user-2", createdBy: "user-2",
    createdAt: daysAgo(2), updatedAt: hoursAgo(6), closedAt: hoursAgo(6),
    category: mockCategories[3], assignee: mockUsers[1], creator: mockUsers[1],
  },
  {
    id: "tkt-5", orgId: "org-1", ticketNumber: 1038,
    title: "Password reset not sending confirmation email",
    description: "Users attempting to reset their password are not receiving the confirmation email. Checked spam folders already.",
    status: "closed", priority: "medium",
    categoryId: "cat-5", assignedTo: "user-3", createdBy: "user-4",
    createdAt: daysAgo(5), updatedAt: daysAgo(3), closedAt: daysAgo(3),
    category: mockCategories[4], assignee: mockUsers[2], creator: mockUsers[3],
  },
  {
    id: "tkt-6", orgId: "org-1", ticketNumber: 1037,
    title: "Request access to production database for debugging",
    description: "Need read-only access to the production PostgreSQL database to investigate a data inconsistency reported by the analytics team.",
    status: "open", priority: "low",
    categoryId: "cat-4", assignedTo: "user-2", createdBy: "user-5",
    createdAt: daysAgo(1), updatedAt: daysAgo(1), closedAt: null,
    category: mockCategories[3], assignee: mockUsers[1], creator: mockUsers[4],
  },
  {
    id: "tkt-7", orgId: "org-1", ticketNumber: 1036,
    title: "Office printer on 3rd floor not responding",
    description: "The HP LaserJet on the 3rd floor is showing offline status. Power cycling didn't help. Print queue is backed up.",
    status: "in_progress", priority: "low",
    categoryId: "cat-2", assignedTo: "user-3", createdBy: "user-4",
    createdAt: daysAgo(3), updatedAt: daysAgo(1), closedAt: null,
    category: mockCategories[1], assignee: mockUsers[2], creator: mockUsers[3],
  },
]

export const mockMessages: TicketMessageWithAuthor[] = [
  {
    id: "msg-1", ticketId: "tkt-1", authorId: "user-4",
    content: "This has been happening since the network maintenance last Friday. About 15 people are affected.",
    isInternal: false, createdAt: hoursAgo(2),
    author: mockUsers[3],
  },
  {
    id: "msg-2", ticketId: "tkt-1", authorId: "user-2",
    content: "Thanks for reporting this. I can see the VPN logs showing timeout errors. Investigating the gateway configuration now.",
    isInternal: false, createdAt: hoursAgo(1.5),
    author: mockUsers[1],
  },
  {
    id: "msg-3", ticketId: "tkt-1", authorId: "user-2",
    content: "Looks like the keepalive interval was changed during maintenance. Need to coordinate with network team to revert.",
    isInternal: true, createdAt: hoursAgo(1),
    author: mockUsers[1],
  },
]

export const mockStats = {
  total: 142,
  open: 23,
  inProgress: 18,
  resolved: 12,
  avgResolutionHours: 4.2,
}
