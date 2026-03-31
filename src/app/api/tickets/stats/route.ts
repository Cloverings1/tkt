import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { tickets } from "@/lib/db/schema"
import { getSession } from "@/lib/auth"
import { eq, and, count, sql } from "drizzle-orm"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const results = await db
    .select({
      status: tickets.status,
      count: count(),
    })
    .from(tickets)
    .where(eq(tickets.orgId, session.orgId))
    .groupBy(tickets.status)

  const stats = {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  }

  for (const row of results) {
    stats.total += row.count
    if (row.status === "open") stats.open = row.count
    else if (row.status === "in_progress") stats.inProgress = row.count
    else if (row.status === "resolved") stats.resolved = row.count
  }

  return NextResponse.json(stats)
}
