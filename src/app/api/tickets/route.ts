import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { tickets, categories, users, orgTicketCounters } from "@/lib/db/schema"
import { getSession } from "@/lib/auth"
import { createTicketSchema } from "@/lib/validators"
import { eq, and, desc, sql } from "drizzle-orm"

export async function GET(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const priority = searchParams.get("priority")

  const conditions = [eq(tickets.orgId, session.orgId)]
  if (status) conditions.push(eq(tickets.status, status as "open" | "in_progress" | "resolved" | "closed"))
  if (priority) conditions.push(eq(tickets.priority, priority as "low" | "medium" | "high" | "urgent"))

  const results = await db
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
    .where(and(...conditions))
    .orderBy(desc(tickets.createdAt))

  return NextResponse.json(results)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const input = createTicketSchema.parse(body)

    const result = await db.transaction(async (tx) => {
      // Atomic ticket number increment
      const [counter] = await tx
        .update(orgTicketCounters)
        .set({ nextNumber: sql`${orgTicketCounters.nextNumber} + 1` })
        .where(eq(orgTicketCounters.orgId, session.orgId))
        .returning()

      const [ticket] = await tx.insert(tickets).values({
        orgId: session.orgId,
        ticketNumber: counter.nextNumber - 1,
        title: input.title,
        description: input.description,
        priority: input.priority,
        categoryId: input.categoryId ?? null,
        createdBy: session.sub,
      }).returning()

      return ticket
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }
    console.error("Create ticket error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
