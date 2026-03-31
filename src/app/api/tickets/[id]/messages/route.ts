import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { ticketMessages, tickets, users } from "@/lib/db/schema"
import { getSession } from "@/lib/auth"
import { createMessageSchema } from "@/lib/validators"
import { eq, and } from "drizzle-orm"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  // Verify ticket belongs to org
  const [ticket] = await db
    .select({ id: tickets.id, createdBy: tickets.createdBy })
    .from(tickets)
    .where(and(eq(tickets.id, id), eq(tickets.orgId, session.orgId)))

  if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 })

  // Customers can only message their own tickets
  if (session.role === "customer" && ticket.createdBy !== session.sub) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()
  const input = createMessageSchema.parse(body)

  // Customers cannot write internal notes
  if (session.role === "customer" && input.isInternal) {
    return NextResponse.json({ error: "Customers cannot create internal notes" }, { status: 403 })
  }

  const [message] = await db.insert(ticketMessages).values({
    ticketId: id,
    authorId: session.sub,
    content: input.content,
    isInternal: input.isInternal,
  }).returning()

  const [author] = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, session.sub))

  return NextResponse.json({ ...message, authorName: author.name }, { status: 201 })
}
