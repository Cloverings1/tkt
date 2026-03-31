import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { tickets, categories, users, ticketMessages } from "@/lib/db/schema"
import { getSession } from "@/lib/auth"
import { updateTicketSchema } from "@/lib/validators"
import { eq, and, desc } from "drizzle-orm"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const [ticket] = await db
    .select({
      id: tickets.id,
      orgId: tickets.orgId,
      ticketNumber: tickets.ticketNumber,
      title: tickets.title,
      description: tickets.description,
      status: tickets.status,
      priority: tickets.priority,
      categoryId: tickets.categoryId,
      assignedTo: tickets.assignedTo,
      createdBy: tickets.createdBy,
      createdAt: tickets.createdAt,
      updatedAt: tickets.updatedAt,
      closedAt: tickets.closedAt,
      categoryName: categories.name,
      categoryColor: categories.color,
      assigneeName: users.name,
    })
    .from(tickets)
    .leftJoin(categories, eq(tickets.categoryId, categories.id))
    .leftJoin(users, eq(tickets.assignedTo, users.id))
    .where(and(eq(tickets.id, id), eq(tickets.orgId, session.orgId)))

  if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 })

  // Get creator info
  const [creator] = await db
    .select({ name: users.name, email: users.email })
    .from(users)
    .where(eq(users.id, ticket.createdBy))

  // Get messages
  const messages = await db
    .select({
      id: ticketMessages.id,
      ticketId: ticketMessages.ticketId,
      authorId: ticketMessages.authorId,
      content: ticketMessages.content,
      isInternal: ticketMessages.isInternal,
      createdAt: ticketMessages.createdAt,
      authorName: users.name,
    })
    .from(ticketMessages)
    .innerJoin(users, eq(ticketMessages.authorId, users.id))
    .where(eq(ticketMessages.ticketId, id))
    .orderBy(ticketMessages.createdAt)

  // Filter internal messages for customers
  const filteredMessages = session.role === "customer"
    ? messages.filter((m) => !m.isInternal)
    : messages

  return NextResponse.json({ ...ticket, creator, messages: filteredMessages })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (session.role === "customer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const input = updateTicketSchema.parse(body)

  const updateData: Record<string, unknown> = {}
  if (input.status !== undefined) {
    updateData.status = input.status
    if (input.status === "resolved" || input.status === "closed") {
      updateData.closedAt = new Date()
    }
  }
  if (input.priority !== undefined) updateData.priority = input.priority
  if (input.categoryId !== undefined) updateData.categoryId = input.categoryId
  if (input.assignedTo !== undefined) updateData.assignedTo = input.assignedTo
  if (input.title !== undefined) updateData.title = input.title
  if (input.description !== undefined) updateData.description = input.description

  const [updated] = await db
    .update(tickets)
    .set(updateData)
    .where(and(eq(tickets.id, id), eq(tickets.orgId, session.orgId)))
    .returning()

  if (!updated) return NextResponse.json({ error: "Ticket not found" }, { status: 404 })

  return NextResponse.json(updated)
}
