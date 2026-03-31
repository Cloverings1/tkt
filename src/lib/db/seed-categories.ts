import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { organizations } from "./schema/organizations"
import { categories } from "./schema/categories"
import { eq } from "drizzle-orm"

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://tkt_app:3a275666387de25fedb2be9954db832a@157.245.90.41:5432/tkt?sslmode=require"

const client = postgres(DATABASE_URL, { ssl: "require", max: 1 })
const db = drizzle(client)

interface CategoryDef {
  name: string
  color: string
  icon: string
  children?: CategoryDef[]
}

const CATEGORY_TREE: CategoryDef[] = [
  {
    name: "Apple",
    color: "#A2AAAD",
    icon: "apple",
    children: [
      { name: "iPhone / iOS", color: "#007AFF", icon: "smartphone" },
      { name: "iPad / iPadOS", color: "#5856D6", icon: "tablet" },
      { name: "Mac — Apple Silicon (M1–M5)", color: "#34C759", icon: "laptop" },
      { name: "AirPods", color: "#FF9500", icon: "headphones" },
      { name: "Apple Watch", color: "#FF2D55", icon: "watch" },
      { name: "Apple Native Apps", color: "#AF52DE", icon: "app-window" },
      { name: "3rd Party Apps — Launch & Install", color: "#64D2FF", icon: "download" },
      { name: "3rd Party Apps — Best Effort", color: "#FFD60A", icon: "wrench" },
      { name: "Account & iCloud", color: "#30B0C7", icon: "cloud" },
    ],
  },
  {
    name: "Windows",
    color: "#00A4EF",
    icon: "monitor",
    children: [
      { name: "Desktop / Laptop", color: "#0078D4", icon: "laptop" },
      { name: "Windows Server", color: "#7FBA00", icon: "server" },
      { name: "Active Directory & Identity", color: "#FFB900", icon: "shield" },
      { name: "Microsoft 365", color: "#D83B01", icon: "mail" },
      { name: "Windows Native Apps", color: "#00BCF2", icon: "app-window" },
      { name: "3rd Party Apps — Install & Launch", color: "#737373", icon: "download" },
      { name: "3rd Party Apps — Best Effort", color: "#B4A0FF", icon: "wrench" },
      { name: "Network & VPN", color: "#008272", icon: "wifi" },
    ],
  },
  {
    name: "General",
    color: "#8E8E93",
    icon: "settings",
    children: [
      { name: "Network & Connectivity", color: "#3B82F6", icon: "wifi" },
      { name: "Hardware", color: "#F59E0B", icon: "hard-drive" },
      { name: "Account Management", color: "#10B981", icon: "user" },
      { name: "Other", color: "#6B7280", icon: "help-circle" },
    ],
  },
]

async function seed() {
  console.log("Fetching all organizations...")
  const orgs = await db.select().from(organizations)
  console.log(`Found ${orgs.length} organization(s)`)

  for (const org of orgs) {
    console.log(`\nSeeding categories for org: ${org.name} (${org.id})`)

    // Delete all existing categories for this org
    const deleted = await db.delete(categories).where(eq(categories.orgId, org.id)).returning()
    console.log(`  - Deleted ${deleted.length} existing categories`)

    // Insert hierarchical categories
    for (const parent of CATEGORY_TREE) {
      const [inserted] = await db.insert(categories).values({
        orgId: org.id,
        name: parent.name,
        color: parent.color,
        icon: parent.icon,
        parentId: null,
      }).returning()

      console.log(`  + Created top-level: "${parent.name}" (${inserted.id})`)

      if (parent.children) {
        for (const child of parent.children) {
          await db.insert(categories).values({
            orgId: org.id,
            name: child.name,
            color: child.color,
            icon: child.icon,
            parentId: inserted.id,
          })
          console.log(`    + Created child: "${child.name}"`)
        }
      }
    }
  }

  console.log("\nDone!")
  await client.end()
}

seed().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
