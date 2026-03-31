import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, organizations, orgMemberships, orgTicketCounters } from "@/lib/db/schema"
import { hashPassword, createToken, setSessionCookie } from "@/lib/auth"
import { signupSchema } from "@/lib/validators"
import { eq } from "drizzle-orm"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const input = signupSchema.parse(body)

    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, input.email)).limit(1)
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const passwordHash = await hashPassword(input.password)
    const slug = input.orgName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

    const result = await db.transaction(async (tx) => {
      const [user] = await tx.insert(users).values({
        email: input.email,
        passwordHash,
        name: input.name,
      }).returning()

      const [org] = await tx.insert(organizations).values({
        name: input.orgName,
        slug,
      }).returning()

      await tx.insert(orgMemberships).values({
        userId: user.id,
        orgId: org.id,
        role: "admin",
      })

      await tx.insert(orgTicketCounters).values({
        orgId: org.id,
        nextNumber: 1,
      })

      return { user, org }
    })

    const token = await createToken({
      sub: result.user.id,
      orgId: result.org.id,
      role: "admin",
    })

    await setSessionCookie(token)

    return NextResponse.json({
      user: { id: result.user.id, email: result.user.email, name: result.user.name },
      org: { id: result.org.id, name: result.org.name, slug: result.org.slug },
    })
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
