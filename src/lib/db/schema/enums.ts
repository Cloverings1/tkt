import { pgEnum } from "drizzle-orm/pg-core"

export const orgRoleEnum = pgEnum("org_role", ["admin", "agent", "customer"])
export const ticketStatusEnum = pgEnum("ticket_status", ["open", "in_progress", "resolved", "closed"])
export const ticketPriorityEnum = pgEnum("ticket_priority", ["low", "medium", "high", "urgent"])
