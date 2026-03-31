import { pgTable, uuid, text, integer, timestamp, unique } from "drizzle-orm/pg-core"
import { organizations } from "./organizations"
import { users } from "./users"
import { categories } from "./categories"
import { ticketStatusEnum, ticketPriorityEnum } from "./enums"

export const tickets = pgTable("tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: uuid("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  ticketNumber: integer("ticket_number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: ticketStatusEnum("status").notNull().default("open"),
  priority: ticketPriorityEnum("priority").notNull().default("medium"),
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
  assignedTo: uuid("assigned_to").references(() => users.id, { onDelete: "set null" }),
  createdBy: uuid("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  closedAt: timestamp("closed_at", { withTimezone: true }),
}, (table) => [
  unique("tickets_org_number_unique").on(table.orgId, table.ticketNumber),
])

export const orgTicketCounters = pgTable("org_ticket_counters", {
  orgId: uuid("org_id").primaryKey().references(() => organizations.id, { onDelete: "cascade" }),
  nextNumber: integer("next_number").notNull().default(1),
})
