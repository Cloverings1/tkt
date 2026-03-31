import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { categories } from "@/lib/db/schema"
import { getSession } from "@/lib/auth"
import { createCategorySchema } from "@/lib/validators"
import { eq, asc } from "drizzle-orm"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const allCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.orgId, session.orgId))
    .orderBy(asc(categories.name))

  // Separate parents and children
  const parents = allCategories.filter((c) => c.parentId === null)
  const children = allCategories.filter((c) => c.parentId !== null)

  // Group children under their parents
  const nested = parents.map((parent) => ({
    ...parent,
    children: children.filter((c) => c.parentId === parent.id),
  }))

  return NextResponse.json(nested)
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
    parentId: input.parentId ?? null,
  }).returning()

  return NextResponse.json(category, { status: 201 })
}
