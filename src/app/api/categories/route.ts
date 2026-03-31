import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { categories } from "@/lib/db/schema"
import { getSession } from "@/lib/auth"
import { createCategorySchema } from "@/lib/validators"
import { eq, desc } from "drizzle-orm"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const results = await db
    .select()
    .from(categories)
    .where(eq(categories.orgId, session.orgId))
    .orderBy(desc(categories.createdAt))

  return NextResponse.json(results)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (session.role !== "admin") {
    return NextResponse.json({ error: "Only admins can manage categories" }, { status: 403 })
  }

  const body = await request.json()
  const input = createCategorySchema.parse(body)

  const [category] = await db.insert(categories).values({
    orgId: session.orgId,
    name: input.name,
    color: input.color,
    icon: input.icon ?? null,
  }).returning()

  return NextResponse.json(category, { status: 201 })
}
