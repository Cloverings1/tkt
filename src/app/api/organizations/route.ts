import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { organizations } from "@/lib/db/schema"
import { getSession } from "@/lib/auth"
import { updateOrgSchema } from "@/lib/validators"
import { eq } from "drizzle-orm"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, session.orgId))

  if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 })

  return NextResponse.json(org)
}

export async function PATCH(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (session.role !== "admin") {
    return NextResponse.json({ error: "Only admins can update org settings" }, { status: 403 })
  }

  const body = await request.json()
  const input = updateOrgSchema.parse(body)

  const [updated] = await db
    .update(organizations)
    .set(input)
    .where(eq(organizations.id, session.orgId))
    .returning()

  return NextResponse.json(updated)
}
