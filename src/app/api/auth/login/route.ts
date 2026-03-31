import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, orgMemberships, organizations } from "@/lib/db/schema"
import { verifyPassword, createToken, setSessionCookie } from "@/lib/auth"
import { loginSchema } from "@/lib/validators"
import { eq } from "drizzle-orm"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const input = loginSchema.parse(body)

    const [user] = await db.select().from(users).where(eq(users.email, input.email)).limit(1)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const valid = await verifyPassword(input.password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const memberships = await db
      .select({
        id: orgMemberships.id,
        orgId: orgMemberships.orgId,
        role: orgMemberships.role,
        orgName: organizations.name,
        orgSlug: organizations.slug,
      })
      .from(orgMemberships)
      .innerJoin(organizations, eq(orgMemberships.orgId, organizations.id))
      .where(eq(orgMemberships.userId, user.id))

    if (memberships.length === 0) {
      return NextResponse.json({ error: "No organization found" }, { status: 403 })
    }

    const membership = memberships[0]
    const token = await createToken({
      sub: user.id,
      orgId: membership.orgId,
      role: membership.role,
    })

    await setSessionCookie(token)

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
      org: { id: membership.orgId, name: membership.orgName, slug: membership.orgSlug },
      memberships: memberships.map((m) => ({
        orgId: m.orgId,
        orgName: m.orgName,
        role: m.role,
      })),
    })
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
