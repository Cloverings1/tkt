import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { organizations } from "./schema/organizations"
import { categories } from "./schema/categories"
import { eq, and } from "drizzle-orm"

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://tkt_app:3a275666387de25fedb2be9954db832a@157.245.90.41:5432/tkt?sslmode=require"

const client = postgres(DATABASE_URL, { ssl: "require", max: 1 })
const db = drizzle(client)

const APPLE_CATEGORIES = [
  { name: "iPhone / iOS", color: "#007AFF", icon: "smartphone" },
  { name: "iPad / iPadOS", color: "#5856D6", icon: "tablet" },
  { name: "Mac — Apple Silicon", color: "#34C759", icon: "laptop" },
  { name: "AirPods", color: "#FF9500", icon: "headphones" },
  { name: "Apple Watch", color: "#FF2D55", icon: "watch" },
  { name: "Apple Native Apps", color: "#AF52DE", icon: "app-window" },
  { name: "3rd Party Apps — Launch & Install", color: "#64D2FF", icon: "download" },
  { name: "3rd Party Apps — Best Effort", color: "#FFD60A", icon: "wrench" },
  { name: "Account & iCloud", color: "#30B0C7", icon: "cloud" },
  { name: "Network & Connectivity", color: "#8E8E93", icon: "wifi" },
] as const

async function seed() {
  console.log("Fetching all organizations...")
  const orgs = await db.select().from(organizations)
  console.log(`Found ${orgs.length} organization(s)`)

  for (const org of orgs) {
    console.log(`\nSeeding categories for org: ${org.name} (${org.id})`)

    for (const cat of APPLE_CATEGORIES) {
      // Check if category already exists for this org
      const existing = await db
        .select()
        .from(categories)
        .where(and(eq(categories.orgId, org.id), eq(categories.name, cat.name)))

      if (existing.length > 0) {
        console.log(`  ✓ "${cat.name}" already exists, skipping`)
        continue
      }

      await db.insert(categories).values({
        orgId: org.id,
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
      })
      console.log(`  + Created "${cat.name}"`)
    }
  }

  console.log("\nDone!")
  await client.end()
}

seed().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
