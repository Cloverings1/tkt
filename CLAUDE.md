@AGENTS.md

# *** DO NOT SKIP THIS — READ FIRST ***

## **Git Commit & PR Message Style — MANDATORY**

**All commit messages, PR titles, and PR descriptions MUST be written in junior-dev-friendly language.**

- Write like a friendly junior developer explaining what they did
- Keep it simple, clear, and human — no corporate jargon
- Use plain English anyone on the team could understand
- Examples:
  - `add the pricing card section to the landing page`
  - `fix the login button not working on mobile`
  - `update the footer with a nicer gradient line`
  - `hook up the signup form to the database`
  - `make the navbar sticky and add a glow to the logo`
- **Commit often** — every small change gets its own commit
- This applies to ALL git operations: commits, PRs, branch names, everything

---

# TKT — Technical Support Ticketing Platform

## Project Overview
TKT is a multi-tenant SaaS ticketing dashboard for IT and technical support teams. Businesses sign up, create orgs, invite teams, and manage support tickets through a dark-mode interface.

## Architecture
- **Frontend:** Next.js 16 App Router deployed on Vercel
- **Backend:** Next.js Route Handlers (no separate API service)
- **Database:** PostgreSQL 16 on DigitalOcean VPS (157.245.90.41, NYC1)
- **ORM:** Drizzle ORM with postgres.js driver
- **Auth:** Custom JWT (bcrypt + jose), HTTP-only cookies
- **UI:** shadcn/ui + Tailwind CSS 4, dark mode only (zinc-950 + violet-500 accent)
- **Icons:** Lucide React
- **Animations:** motion (Framer Motion v12+)
- **Typography:** Geist Sans (interface) + Geist Mono (IDs, timestamps, code)
- **Validation:** Zod v4

## Key Directories
```
src/app/(marketing)/     — Public splash/landing page
src/app/(auth)/          — Login and signup pages
src/app/(dashboard)/     — Protected dashboard (sidebar layout)
src/app/api/             — API route handlers
src/lib/db/              — Drizzle ORM schema and connection
src/lib/db/schema/       — Database table definitions
src/lib/auth.ts          — JWT auth utilities (hash, verify, session)
src/lib/types.ts         — TypeScript interfaces for all entities
src/lib/constants.ts     — Status/priority/role color maps
src/lib/validators.ts    — Zod schemas for all forms
src/lib/mock-data.ts     — Realistic mock data for UI development
src/components/ui/       — shadcn/ui + custom primitives (StatusBadge, PriorityBadge, etc.)
src/components/marketing/ — Splash page section components
src/components/dashboard/ — Sidebar and dashboard-specific components
src/proxy.ts             — Auth guard for /dashboard routes (Next.js 16 proxy)
drizzle/                 — Migration SQL files
drizzle.config.ts        — Drizzle Kit config
```

## Multi-Tenancy
- All tenant-scoped tables have an `org_id` column
- Application-level isolation: every query filters by `session.orgId`
- Ticket numbers are per-org (managed via `org_ticket_counters` table)

## User Roles
- **Admin:** Full access — org settings, team management, categories
- **Agent:** Can manage/respond to all tickets, see internal notes
- **Customer:** Can create/view own tickets only, cannot see internal notes

## Database Tables
organizations, users, org_memberships, categories, tickets, ticket_messages, org_ticket_counters

## Auth Flow
1. Signup/Login → bcrypt verify → JWT signed with jose (HS256) → set HTTP-only cookie `tkt-session`
2. proxy.ts checks cookie on /dashboard/* routes, redirects to /login if invalid
3. JWT payload: { sub: userId, orgId, role, exp }
4. proxy.ts uses jose directly (no bcrypt import — Node.js runtime)

## Design System
- **Background:** zinc-950 (oklch 0.119)
- **Surfaces:** zinc-900 with zinc-800 borders
- **Primary accent:** violet-500
- **Status colors:** open=blue-500, in_progress=amber-500, resolved=emerald-500, closed=zinc-500
- **Priority colors:** low=zinc-400, medium=blue-400, high=amber-400, urgent=red-500
- **Border radius:** rounded-lg for cards, rounded-md for buttons

## Important Patterns
- Server Components by default; `'use client'` only for interactive elements
- All Next.js 16 request APIs are async: `await cookies()`, `await params`
- Route handler params use `{ params: Promise<{ id: string }> }` pattern
- `motion` package (not `framer-motion`) for animations
- Drizzle connection uses `max: 1` for serverless compatibility
- `.env.local` contains DATABASE_URL and JWT_SECRET (gitignored)

## Git Workflow
- Make frequent, small commits — the more commits the better
- Each logical unit of work gets its own commit
- Use descriptive commit messages

## Spec
Full design spec at: `docs/superpowers/specs/2026-03-30-tkt-ticketing-platform-design.md`
