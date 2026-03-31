import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core"
import { organizations } from "./organizations"

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: uuid("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: text("color").notNull(),
  icon: text("icon"),
  parentId: uuid("parent_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
