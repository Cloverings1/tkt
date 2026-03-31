# TKT — Technical Support Ticketing Platform

## Context

TKT is a SaaS ticketing dashboard for IT and technical support teams. Businesses sign up, invite their team, and manage customer support tickets through a modern dark-mode interface. Customers can also create and track their own tickets. The product is marketed to companies offering technical support services.

The motivation is to build a world-class, aesthetically-driven ticketing tool that competes on design quality and developer experience, hosted on Vercel for performance with a self-managed VPS backend for full infrastructure control.

---

## Architecture

### Frontend
- **Framework:** Next.js 16 App Router on Vercel
- **Rendering:** Server Components by default, Client Components only for interactive widgets (filters, forms, real-time updates)
- **Styling:** Tailwind CSS 4 + shadcn/ui (dark mode first)
- **Typography:** Geist Sans (interface), Geist Mono (IDs, timestamps, code)
- **Icons:** Lucide React
- **Animations:** Framer Motion (page transitions, list staggering), CSS transitions for micro-interactions

### Backend
- **API:** Next.js Route Handlers (no separate API service)
- **ORM:** Drizzle ORM with `postgres.js` driver
- **Auth:** Custom JWT authentication (bcrypt for password hashing, jose for JWT signing/verification)
- **Sessions:** HTTP-only cookies with JWT tokens

### Database
- **Engine:** PostgreSQL on user's VPS
- **Migrations:** Drizzle Kit
- **Multi-tenancy:** Application-level isolation via `org_id` column on all tenant-scoped tables
- **Connection:** Direct TCP from Vercel serverless functions to VPS Postgres (SSL required)

### Deployment
- **Frontend:** `vercel deploy` (preview + production)
- **Database:** Postgres on DigitalOcean droplet (Ubuntu 24.04, 2GB RAM, 50GB disk, NYC1)
- **Domain:** Single domain (tkt.app or similar), org switcher after login

---

## Data Model

### organizations
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Generated |
| name | text | Display name |
| slug | text (unique) | URL-safe identifier |
| logo_url | text (nullable) | Org logo |
| created_at | timestamptz | Default now() |

### users
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Generated |
| email | text (unique) | Login identifier |
| password_hash | text | bcrypt hash |
| name | text | Display name |
| avatar_url | text (nullable) | Profile image |
| created_at | timestamptz | Default now() |

### org_memberships
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Generated |
| user_id | uuid (FK → users) | |
| org_id | uuid (FK → organizations) | |
| role | enum: admin, agent, customer | |
| created_at | timestamptz | Default now() |
| Unique constraint | (user_id, org_id) | One role per org |

### categories
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Generated |
| org_id | uuid (FK → organizations) | Tenant-scoped |
| name | text | e.g., "Network", "Hardware" |
| color | text | Hex color code |
| icon | text (nullable) | Lucide icon name |
| created_at | timestamptz | Default now() |

### tickets
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Generated |
| org_id | uuid (FK → organizations) | Tenant-scoped |
| ticket_number | integer | Human-readable, per-org (auto-incremented via application logic) |
| title | text | Short summary |
| description | text | Initial description |
| status | enum: open, in_progress, resolved, closed | |
| priority | enum: low, medium, high, urgent | |
| category_id | uuid (FK → categories, nullable) | |
| assigned_to | uuid (FK → users, nullable) | Agent assignment |
| created_by | uuid (FK → users) | Ticket creator |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Auto-updated |
| closed_at | timestamptz (nullable) | When resolved/closed |

### ticket_messages
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Generated |
| ticket_id | uuid (FK → tickets) | |
| author_id | uuid (FK → users) | |
| content | text | Message body (markdown) |
| is_internal | boolean | Agent-only internal notes |
| created_at | timestamptz | Default now() |

---

## User Roles & Permissions

| Action | Admin | Agent | Customer |
|--------|-------|-------|----------|
| View all org tickets | Yes | Yes | No |
| View own tickets | Yes | Yes | Yes |
| Create tickets | Yes | Yes | Yes |
| Assign tickets | Yes | Yes | No |
| Change ticket status | Yes | Yes | No (can close own) |
| Send messages on tickets | Yes | Yes | Own tickets only |
| View internal notes | Yes | Yes | No |
| Manage categories | Yes | No | No |
| Manage team members | Yes | No | No |
| Org settings | Yes | No | No |

---

## Pages & Routes

### Route Groups

```
src/app/
├── (marketing)/
│   ├── page.tsx                    # Landing/splash page
│   └── layout.tsx                  # No sidebar, full-width
├── (auth)/
│   ├── login/page.tsx              # Sign in
│   ├── signup/page.tsx             # Sign up + create first org
│   └── layout.tsx                  # Centered card layout
├── (dashboard)/
│   ├── layout.tsx                  # Sidebar + main content
│   ├── dashboard/
│   │   ├── page.tsx                # Overview (ticket stats, recent activity)
│   │   ├── tickets/
│   │   │   ├── page.tsx            # Ticket list (filterable, sortable)
│   │   │   ├── [id]/page.tsx       # Ticket detail (conversation thread)
│   │   │   └── new/page.tsx        # Create new ticket
│   │   ├── categories/page.tsx     # Manage categories
│   │   ├── team/page.tsx           # Manage team + roles
│   │   └── settings/page.tsx       # Org settings
│   └── middleware (auth guard)
└── api/
    ├── auth/
    │   ├── login/route.ts
    │   ├── signup/route.ts
    │   └── logout/route.ts
    ├── tickets/
    │   ├── route.ts                # GET list, POST create
    │   └── [id]/
    │       ├── route.ts            # GET, PATCH, DELETE
    │       └── messages/route.ts   # GET, POST
    ├── categories/route.ts
    ├── team/route.ts
    └── organizations/route.ts
```

---

## Splash Page Design

### Sections (top to bottom)

1. **Navigation bar** — TKT logo (left), nav links (Features, Pricing), "Sign In" text link, "Get Started" CTA button (violet-500)

2. **Hero** — Full-width, centered
   - Headline: Bold, large (text-5xl/6xl), e.g., "Support tickets, solved."
   - Subtext: Muted (zinc-400), one sentence about modern ticketing
   - CTA: "Get Started Free" button (violet-500, hover violet-400)
   - Subtle animated gradient orb in background (violet/blue, CSS animation)

3. **Feature grid** — 2x2 or 3-column grid of cards
   - Real-time ticket tracking
   - Priority & category management
   - Team collaboration & assignment
   - Color-coded organization
   - Each card: icon (Lucide), title, short description, zinc-900 surface with zinc-800 border

4. **Dashboard preview** — Centered stylized mockup component (built in JSX/CSS, not a screenshot) showing the ticket dashboard UI, with a subtle violet glow border effect

5. **How it works** — 3 numbered steps
   - Sign up your team
   - Configure categories & priorities
   - Start resolving tickets

6. **Pricing** — 3-tier card layout (Free / Pro / Enterprise), placeholder pricing
   - Highlight "Pro" as recommended

7. **Footer** — Logo, copyright, links (Privacy, Terms, GitHub)

### Visual Language
- **Background:** zinc-950 (#09090b)
- **Surfaces:** zinc-900 (#18181b) with zinc-800 (#27272a) borders
- **Text:** zinc-50 (headings), zinc-400 (body/muted)
- **Accent:** violet-500 (#8b5cf6) for CTAs, links, highlights
- **Secondary accent:** blue-500 (#3b82f6) for status indicators
- **Radius:** rounded-lg (8px) for cards, rounded-md (6px) for buttons
- **Spacing:** Generous — py-24 between sections, gap-6 in grids

---

## Dashboard Design

### Sidebar (fixed left, 256px wide, collapsible to 64px)
- **Top:** Org logo + name, org switcher dropdown
- **Nav items:** Dashboard (overview), Tickets, Categories, Team, Settings
- **Bottom:** User avatar + name, logout
- **Style:** zinc-900 background, zinc-800 border-right, active item: violet-500/10 bg + violet-500 text

### Main Content Area
- **Header bar:** Page title (left), action buttons (right, e.g., "New Ticket")
- **Content:** Cards and tables on zinc-950 background

### Ticket List View
- Filterable by status, priority, category, assignee
- Sortable columns
- Each row: status badge (colored dot), ticket number (mono), title, priority badge, category tag, assignee avatar, time ago
- Status colors: open=blue-500, in_progress=amber-500, resolved=emerald-500, closed=zinc-500
- Priority colors: low=zinc-400, medium=blue-400, high=amber-400, urgent=red-500

### Ticket Detail View
- **Left panel (60%):** Conversation thread — messages displayed chronologically, markdown rendered, internal notes styled differently (dashed border, muted bg). Reply box at bottom with rich text.
- **Right panel (40%):** Metadata sidebar — status select, priority select, category select, assignee select, created date, ticket number. All as compact form controls.

### Animations
- Page transitions: fade + slight y-translate (150ms)
- List items: staggered fade-in on load
- Sidebar collapse: smooth width transition (200ms)
- Status badge changes: color transition (150ms)
- All animations respect `prefers-reduced-motion`

---

## Authentication Flow

1. **Sign up:** Email + password + org name → creates user, org, and admin membership. Sets JWT cookie.
2. **Login:** Email + password → verifies bcrypt hash → sets JWT cookie.
3. **Session:** JWT stored in HTTP-only, secure, SameSite=Lax cookie. Contains user_id and current org_id.
4. **Org switching:** Dropdown in sidebar → API call updates the org_id in the JWT → refresh.
5. **Auth guard:** Next.js proxy.ts (middleware replacement in v16) checks JWT on all /dashboard routes. Redirects to /login if invalid.
6. **Logout:** Clears cookie, redirects to /.

JWT payload: `{ sub: user_id, org_id: current_org_id, role: current_role, exp: timestamp }`

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Hosting | Vercel (frontend) |
| Database | PostgreSQL (VPS) |
| ORM | Drizzle ORM |
| Auth | Custom JWT (bcrypt + jose) |
| UI Components | shadcn/ui |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Animations | Framer Motion |
| Typography | Geist Sans + Geist Mono |
| Validation | Zod |

---

## Verification Plan

1. **Splash page:** Visit `/` — all sections render, CTA links work, responsive on mobile
2. **Auth:** Sign up → login → JWT cookie set → redirected to dashboard. Invalid credentials show error. Logout clears session.
3. **Dashboard:** Sidebar navigation works, all pages load. Org switcher changes context.
4. **Tickets CRUD:** Create a ticket → appears in list → open detail → send message → change status → close ticket
5. **Roles:** Customer can only see own tickets. Agent sees all. Admin can manage team/categories.
6. **Performance:** Lighthouse score >90. No layout shift. Animations smooth at 60fps.
7. **Multi-tenancy:** Create two orgs → data isolated between them.
