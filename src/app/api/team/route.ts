import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orgMemberships, users } from "@/lib/db/schema"
import { getSession } from "@/lib/auth"
import { inviteTeamMemberSchema } from "@/lib/validators"
import { hashPassword } from "@/lib/auth"
import { eq, and } from "drizzle-orm"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const members = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      avatarUrl: users.avatarUrl,
      role: orgMemberships.role,
      joinedAt: orgMemberships.createdAt,
    })
    .from(orgMemberships)
    .innerJoin(users, eq(orgMemberships.userId, users.id))
    .where(eq(orgMemberships.orgId, session.orgId))

  return NextResponse.json(members)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (session.role !== "admin") {
    return NextResponse.json({ error: "Only admins can invite members" }, { status: 403 })
  }

  const body = await request.json()
  const input = inviteTeamMemberSchema.parse(body)

  // Check if user exists
  let [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1)

  if (!user) {
    // Create user with temp password (they'll need to reset)
    const tempHash = await hashPassword(crypto.randomUUID())
    const [newUser] = await db.insert(users).values({
      email: input.email,
      passwordHash: tempHash,
      name: input.email.split("@")[0],
    }).returning()
    user = newUser
  }

  // Check not already a member
  const [existing] = await db
    .select()
    .from(orgMemberships)
    .where(and(eq(orgMemberships.userId, user.id), eq(orgMemberships.orgId, session.orgId)))

  if (existing) {
    return NextResponse.json({ error: "User is already a member" }, { status: 409 })
  }

  await db.insert(orgMemberships).values({
    userId: user.id,
    orgId: session.orgId,
    role: input.role,
  })

  return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: input.role }, { status: 201 })
}
