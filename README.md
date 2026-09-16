# Ahmad HomeWorks — Singapore Home-Services Portfolio + Blog

A production-ready Next.js 16 single-worker portfolio + blog website for a freelance
home-services specialist in Singapore (plumbing, painting, renovation, electrical,
interior works, general repair).

Public visitors browse jobs and blog posts with **no login**. The only way to
contact the worker is **WhatsApp**. The worker has a secure admin panel to manage
content and view analytics.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) |
| Animations | Framer Motion |
| Auth | NextAuth.js v4 (credentials provider, JWT session) |
| Database | Prisma ORM + SQLite (swap for Postgres for production) |
| Image compression | `browser-image-compression` (client-side, before upload) |
| Icons | Lucide React |
| Charts | Recharts |
| Markdown | `react-markdown` |
| Theme | `next-themes` (light/dark) |

> The original brief asked for Supabase, but the sandbox stack standardizes on
> Prisma + SQLite + NextAuth. The data model is identical and the routes are
> drop-in replaceable with a Supabase adapter if needed.

---

## Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Set up environment variables
cp .env.example .env  # then edit values

# 3. Push the database schema
bun run db:push

# 4. Start the dev server
bun run dev
```

Open <http://localhost:3000/> in your browser.

### Seed demo content

Visit <http://localhost:3000/api/seed> once after first `db:push` to create:

- Admin user (`admin@homeworks.sg` / `admin123`)
- 7 portfolio jobs (with before/after images)
- 3 blog posts
- 5 testimonials

> The seed endpoint is idempotent — call it again safely.

---

## Environment Variables

```bash
DATABASE_URL=file:./db/custom.db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# Public site config — override for your real worker
NEXT_PUBLIC_WORKER_NAME=Ahmad Rahman
NEXT_PUBLIC_BRAND=Ahmad HomeWorks
NEXT_PUBLIC_PHONE=+65 9123 4567
NEXT_PUBLIC_WHATSAPP=6591234567            # digits only, country code first
NEXT_PUBLIC_EMAIL=hello@ahmadhomeworks.sg
NEXT_PUBLIC_LOCATION=Singapore · Islandwide
```

---

## Admin Access

1. Open <http://localhost:3000/?view=admin> (or click the lock icon in the
   mobile menu).
2. Sign in with `admin@homeworks.sg` / `admin123`.
3. Manage posts, testimonials, and view analytics.

To change the admin password, hash a new one with bcrypt and update the
`User.passwordHash` field directly (or write a small script using
`/src/lib/auth.ts` helpers).

---

## Project Structure

```
prisma/
  schema.prisma              # User, Post, PostImage, Testimonial, AnalyticsEvent

src/
  app/
    page.tsx                 # Server component — fetches data, renders <HomeView/>
    layout.tsx               # Fonts, metadata, providers
    globals.css              # Premium amber/stone theme + dark mode
    api/
      auth/[...nextauth]/    # NextAuth credentials login
      posts/                 # GET (list) + POST (create) + [id] GET/PUT/DELETE
      posts/featured/        # GET featured posts for homepage
      testimonials/          # GET (list) + POST (create) + [id] PUT/DELETE
      upload/                # POST — saves compressed image to /public/uploads
      analytics/             # POST anonymous event tracking
      analytics/stats/       # GET aggregate dashboard stats (admin only)
      seed/                  # GET — idempotent seed endpoint

  components/
    HomeView.tsx             # Client orchestrator — switches between views
    providers.tsx            # SessionProvider + ThemeProvider
    theme-provider.tsx

    site/                    # Public-facing components
      Header.tsx             # Sticky nav + mobile sheet + dark mode toggle
      Hero.tsx               # Headline + CTAs + image collage
      Services.tsx           # 6 service cards
      FeaturedJobs.tsx       # Portfolio cards on homepage
      LatestBlog.tsx         # Blog cards on homepage
      Testimonials.tsx       # Carousel of client testimonials
      About.tsx              # Worker bio + stats
      Footer.tsx             # CTA band + contact + nav
      WhatsAppFloat.tsx      # Floating WhatsApp button + chat preview
      BeforeAfterSlider.tsx  # Draggable image comparison slider
      PostDetailModal.tsx    # Full post view (markdown + slider + WhatsApp CTA)
      PortfolioSection.tsx   # All-jobs listing with category filter
      BlogSection.tsx        # All-posts listing with featured first

    admin/                   # Admin-only components
      AdminPanel.tsx         # Sidebar + main area orchestrator
      AdminLogin.tsx         # Sign-in form (NextAuth credentials)
      PostList.tsx           # Filterable list of all posts
      PostEditor.tsx         # Full CRUD editor (modal)
      ImageUploader.tsx      # Multi-upload with browser-image-compression
      TestimonialManager.tsx # CRUD for testimonials
      AnalyticsDashboard.tsx # KPIs + 14-day chart + top posts

  lib/
    db.ts                    # Prisma client (singleton)
    auth.ts                  # isAdmin() + getAdmin() helpers
    site.ts                  # siteConfig + WhatsApp URL builders

  store/
    useStore.ts              # Zustand — view state (home/portfolio/blog/about/admin)

public/uploads/              # Uploaded images go here (gitignored in production)
```

---

## Database Schema

```prisma
User          // single admin worker (NextAuth credentials)
Post          // portfolio job OR blog post (type field)
PostImage     // gallery | before | after — for the comparison slider
Testimonial   // client quotes
AnalyticsEvent // anonymous page_view / post_view / whatsapp_click / dwell
```

### RLS / Auth Boundary

Since this uses NextAuth + Prisma (not Supabase), the auth boundary is enforced
in every API route via the `isAdmin()` helper from `src/lib/auth.ts`. All write
operations (POST/PUT/DELETE) require a valid session; reads are public.

---

## Image Upload Pipeline

1. Worker selects images in the PostEditor.
2. `browser-image-compression` compresses each to ≤1.5MB / ≤1920px client-side.
3. PNGs are converted to WebP automatically.
4. Compressed bytes are POSTed to `/api/upload`.
5. Server saves to `/public/uploads/<timestamp>-<hash>.<ext>` and returns the URL.
6. Worker can mark each image as `gallery`, `before`, or `after`.
7. If both `before` and `after` are present, the post detail page shows the
   draggable comparison slider.

---

## WhatsApp Integration

Every page has a floating WhatsApp button (bottom-right) that opens a chat
preview dialog. Context-aware pre-filled messages are used:

| Source | Pre-filled message |
|---|---|
| Floating button | "Hi {worker}, I saw your website and would like a quote." |
| Service card | "Hi {worker}, I'm interested in your {service} service." |
| Post detail | "Hi {worker}, I saw your '{title}' work. Can you give me a quote for a similar job?" |

All clicks are tracked as `whatsapp_click` events for analytics.

---

## Analytics

Anonymous events tracked (no cookies, no PII):

- `page_view` — on every view change
- `post_view` — when a post detail modal opens
- `whatsapp_click` — on every WhatsApp link click
- `dwell` — (optional) time spent on a page

The admin Analytics tab shows:

- KPI cards (site views, post views, WA clicks, avg dwell)
- 14-day line chart of daily activity
- Top-6 most-viewed posts with WA conversion

---

## Deployment

### Vercel

1. Push to GitHub.
2. Import into Vercel.
3. Set all env vars from `.env.example`.
4. Run `bun run db:push` once against your production DB (or migrate to
   Postgres by changing `datasource db { provider = "postgresql" }`).
5. Visit `/api/seed` once to create the admin user.

### Netlify

Same as above with the Next.js Runtime plugin.

### Self-hosted

```bash
bun run build
bun run start
```

---

## Customizing

- **Worker name, phone, WhatsApp**: edit `src/lib/site.ts` or set env vars.
- **Services list**: edit the `services` array in `src/lib/site.ts`.
- **Color theme**: edit CSS variables in `src/app/globals.css` (`:root` and
  `.dark`). The current palette is a warm amber (`oklch(0.61 0.18 50)`) on
  cream, with rich charcoal in dark mode.
- **Fonts**: layout.tsx loads Geist Sans, Geist Mono, and Playfair Display
  (for the `--font-display` used in headings).

---

## License

MIT — yours to adapt for your own home-services business.
