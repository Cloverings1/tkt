import { pgTable, uuid, timestamp, unique } from "drizzle-orm/pg-core"
import { organizations } from "./organizations"
import { users } from "./users"
import { orgRoleEnum } from "./enums"

export const orgMemberships = pgTable("org_memberships", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  orgId: uuid("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  role: orgRoleEnum("role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  unique("org_memberships_user_org_unique").on(table.userId, table.orgId),
])
