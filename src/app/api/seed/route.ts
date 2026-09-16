import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

/**
 * One-time seed endpoint — sets up:
 *   - Admin user (email: admin@homeworks.sg, password: admin123)
 *   - 6 sample portfolio posts (with categories, before/after)
 *   - 3 sample blog posts
 *   - 5 testimonials
 *   - 6 service images
 * Call GET /api/seed once after deployment, or after `db:push`.
 */
export async function GET() {
  // Idempotent — if admin exists, skip.
  const existing = await db.user.findUnique({ where: { email: "admin@homeworks.sg" } })
  if (!existing) {
    const passwordHash = await bcrypt.hash("admin123", 10)
    await db.user.create({
      data: {
        email: "admin@homeworks.sg",
        name: "Ahmad Rahman",
        passwordHash,
        role: "admin",
      },
    })
  }

  const postCount = await db.post.count()
  if (postCount === 0) {
    const samples = makeSamplePosts()
    for (const s of samples) {
      await db.post.create({ data: s as any })
    }
  }
  const tCount = await db.testimonial.count()
  if (tCount === 0) {
    for (const t of testimonials) {
      await db.testimonial.create({ data: t })
    }
  }

  return NextResponse.json({
    ok: true,
    admin: { email: "admin@homeworks.sg", password: "admin123" },
  })
}

const IMG = {
  plumbing1: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1200&auto=format&fit=crop&q=70",
  plumbing2: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1200&auto=format&fit=crop&q=70",
  paint1: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1200&auto=format&fit=crop&q=70",
  paint2: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&auto=format&fit=crop&q=70",
  reno1: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&auto=format&fit=crop&q=70",
  reno2: "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=1200&auto=format&fit=crop&q=70",
  electric1: "https://images.unsplash.com/photo-1621905251918-48416b573323?w=1200&auto=format&fit=crop&q=70",
  electric2: "https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?w=1200&auto=format&fit=crop&q=70",
  interior1: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&auto=format&fit=crop&q=70",
  interior2: "https://images.unsplash.com/photo-1556909114-44e3e9399a2c?w=1200&auto=format&fit=crop&q=70",
  kitchen: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1200&auto=format&fit=crop&q=70",
  bath: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&auto=format&fit=crop&q=70",
  living: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&auto=format&fit=crop&q=70",
  bedroom: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&auto=format&fit=crop&q=70",
} as const

function makeSamplePosts() {
  const base = [
    {
      type: "portfolio",
      category: "Plumbing",
      tags: "HDB,Toilet,Leak",
      featured: true,
      published: true,
      coverImage: IMG.plumbing1,
      images: {
        create: [
          { url: IMG.plumbing2, kind: "before", position: 0 },
          { url: IMG.plumbing1, kind: "after", position: 1 },
        ],
      },
    },
  ] as const
  void base

  const samples: any[] = [
    {
      title: "HDB Toilet Re-piping in Bedok",
      slug: "hdb-toilet-repiping-bedok",
      excerpt: "Replaced corroded galvanised pipes with PPR, fixed a stubborn leak under the sink that the previous contractor couldn't find.",
      content: `## The Job\n\nThe owner of a 4-room HDB in Bedok had a persistent leak under the master toilet sink. Two previous contractors had re-caulked it but the smell kept coming back.\n\n## What We Found\n\nOn opening the cabinet we discovered corroded galvanised piping with a slow pinhole leak running down the wall — not the joint at all.\n\n## What We Did\n\n- Cut out the corroded section\n- Replaced with PPR piping (heat-fused joints)\n- Re-installed the sink trap\n- Pressure tested for 30 minutes — zero drop\n\nThe job took 4 hours. The leak has not returned in 6 months.`,
      type: "portfolio",
      category: "Plumbing",
      tags: "HDB,Toilet,Leak",
      featured: true,
      published: true,
      coverImage: IMG.plumbing1,
      images: {
        create: [
          { url: IMG.plumbing2, kind: "before", position: 0 },
          { url: IMG.plumbing1, kind: "after", position: 1 },
        ],
      },
    },
    {
      title: "Full 5-Room HDB Painting in Punggol",
      slug: "painting-punggol-5room",
      excerpt: "Nippon Paint 3-in-1 medallion, ceilings included. Dust-free prep, completed in 2.5 days.",
      content: `## Scope\n\n- 5-room HDB, ~110 sqm\n- Walls + ceilings\n- Nippon Paint 3-in-1 Medallion (off-white)\n\n## Process\n\n1. Furniture moved and wrapped\n2. Walls washed, holes patched, hairline cracks taped\n3. One primer + two top coats\n4. Edges hand-cut for crisp lines\n5. Final walkthrough with owner\n\nThe flat looked brand new. Owner commented it felt \"brighter even with the lights off.\"`,
      type: "portfolio",
      category: "Painting",
      tags: "HDB,Punggol,Nippon",
      featured: true,
      published: true,
      coverImage: IMG.paint1,
      images: {
        create: [
          { url: IMG.paint2, kind: "before", position: 0 },
          { url: IMG.paint1, kind: "after", position: 1 },
        ],
      },
    },
    {
      title: "Condo Kitchen Renovation in Serangoon",
      slug: "condo-kitchen-serangoon",
      excerpt: "Custom solid-surface countertop, new backsplash, full re-tiling. Two-week turnaround.",
      content: `## Brief\n\nThe owner wanted a clean white Scandi kitchen with hidden handles, solid surface (no grout lines), and a herringbone backsplash.\n\n## What We Built\n\n- Custom marine-ply carcasses with soft-close Blum hinges\n- Solid-surface (Corian-style) countertop, seamed on-site\n- Herringbone marble-look porcelain backsplash\n- LED strip under cabinets on a motion sensor\n\n## Timeline\n\n2 weeks on-site, including carpentry fabrication off-site.`,
      type: "portfolio",
      category: "Renovation",
      tags: "Condo,Kitchen,Carpentry",
      featured: true,
      published: true,
      coverImage: IMG.kitchen,
      images: {
        create: [
          { url: IMG.reno1, kind: "before", position: 0 },
          { url: IMG.kitchen, kind: "after", position: 1 },
        ],
      },
    },
    {
      title: "Full Electrical Rewiring, Landed in Bukit Timah",
      slug: "rewiring-landed-bukit-timah",
      excerpt: "4-storey landed house, complete rewire with new distribution board. EMA-compliant, LEW-signed off.",
      content: `## Why\n\nA 30-year-old landed home with original wiring. Owner wanted to upgrade to a 100A supply and add EV charger ready-circuit.\n\n## What We Did\n\n- Pulled new PVC conduits throughout (4 storeys)\n- New Hager 100A DB with RCBO protection on every circuit\n- LED downlight conversion (40+ points)\n- EV-ready 32A circuit in car porch\n- LEW inspection & SP submission\n\n3 weeks, zero snag list on handover.`,
      type: "portfolio",
      category: "Electrical",
      tags: "Landed,Rewiring,LEW",
      featured: false,
      published: true,
      coverImage: IMG.electric1,
      images: {
        create: [
          { url: IMG.electric2, kind: "after", position: 0 },
          { url: IMG.electric1, kind: "gallery", position: 1 },
        ],
      },
    },
    {
      title: "Feature Wall & TV Console, BTO Sengkang",
      slug: "feature-wall-tv-console-sengkang",
      excerpt: "Fluted panel feature wall with walnut veneer TV console. Built-in ambient LED lighting.",
      content: `## Concept\n\nOwner wanted a single statement wall in their new BTO living room — warm, textured, but not overpowering.\n\n## Execution\n\n- 4m fluted wood-panel feature wall\n- Floating walnut-veneer TV console with hidden cable management\n- Warm-white LED strip behind console for ambient glow\n- Matte-lacquered matching side cabinet\n\nFinished in 5 days on-site.`,
      type: "portfolio",
      category: "Interior Works",
      tags: "BTO,Sengkang,Carpentry",
      featured: true,
      published: true,
      coverImage: IMG.living,
      images: {
        create: [
          { url: IMG.interior1, kind: "gallery", position: 0 },
          { url: IMG.living, kind: "after", position: 1 },
        ],
      },
    },
    {
      title: "Master Bathroom Hack, EC in Sembawang",
      slug: "bathroom-hack-sembawang",
      excerpt: "Hacked and re-tiled a tired 20-year-old master bathroom. Walk-in rain shower, frameless glass.",
      content: `## Job\n\n- Hacked old wall + floor tiles\n- New waterproofing (2 coats Sika)\n- Large-format 600x600 marble-look tiles\n- Walk-in rain shower with thermostatic mixer\n- Frameless glass partition\n- Wall-hung vanity with above-counter basin\n\nDelivered in 9 working days.`,
      type: "portfolio",
      category: "Renovation",
      tags: "Bathroom,Hack,Waterproofing",
      featured: false,
      published: true,
      coverImage: IMG.bath,
      images: {
        create: [
          { url: IMG.reno2, kind: "before", position: 0 },
          { url: IMG.bath, kind: "after", position: 1 },
        ],
      },
    },
    {
      title: "Bedroom Built-in Wardrobe, Tampines",
      slug: "bedroom-wardrobe-tampines",
      excerpt: "Floor-to-ceiling 4-door wardrobe in soft-close laminate. Hidden handles, integrated lighting.",
      content: `## Brief\n\nOwner wanted maximum storage in a small master bedroom without crowding it.\n\n## Solution\n\n- 2.6m wide x 2.4m tall, 4-door sliding wardrobe\n- Push-to-open hidden handles\n- Soft-close tracks\n- Warm oak exterior, dove-grey interior\n- Integrated top lighting\n\nInstalled in 1 day.`,
      type: "portfolio",
      category: "Interior Works",
      tags: "Wardrobe,Built-in,Laminate",
      featured: false,
      published: true,
      coverImage: IMG.bedroom,
      images: { create: [{ url: IMG.bedroom, kind: "after", position: 0 }] },
    },
    // BLOG posts
    {
      title: "5 Signs Your HDB Pipes Need Replacing",
      slug: "5-signs-pipes-need-replacing",
      excerpt: "Brown water, low pressure, damp smells — these are not things to ignore. Here's what to look for.",
      content: `## 1. Brown or rusty water\n\nIf the cold tap runs brown for the first few seconds, your galvanised pipes are corroding from the inside. This will only get worse.\n\n## 2. Low water pressure in one fixture\n\nOften a sign of a partial blockage — mineral build-up or a crushed pipe joint.\n\n## 3. Damp smell that won't go away\n\nA slow leak behind the wall will create mould long before you see water on the floor.\n\n## 4. Visible green / white crust on joints\n\nThat's mineral deposits leaking through the joint. The joint has already failed.\n\n## 5. Pipes older than 20 years\n\nHDB galvanised pipes from the 1990s are now end-of-life. If you haven't replaced them, plan for it.`,
      type: "blog",
      category: "Plumbing",
      tags: "Guide,Maintenance",
      featured: true,
      published: true,
      coverImage: IMG.plumbing1,
      images: { create: [{ url: IMG.plumbing1, kind: "gallery", position: 0 }] },
    },
    {
      title: "How Much Does It Cost to Paint a 5-Room HDB in 2026?",
      slug: "cost-to-paint-5room-hdb-2026",
      excerpt: "Real numbers from a real job: materials, labour, what bumps the price up, and how to save $400.",
      content: `## The Honest Numbers\n\nA 5-room HDB (110 sqm) painted walls + ceilings:\n\n- **Materials** (Nippon 3-in-1): ~$380\n- **Labour** (2 painters, 2.5 days): ~$1,400\n- **Total**: ~$1,780\n\n## What Bumps the Price Up\n\n- Skirting tape instead of cutting in (+$150)\n- Ceiling paint vs. wall paint (+$120)\n- Dark colours (need extra coat) (+$200)\n- Furniture moving (+$100)\n\n## How to Save $400\n\n1. Move your own furniture\n2. Cut in your own edges (if you can)\n3. Skip the primer if your existing paint is sound\n4. Book in the off-peak months (Feb-Apr)`,
      type: "blog",
      category: "Painting",
      tags: "Cost,Guide",
      featured: true,
      published: true,
      coverImage: IMG.paint1,
      images: { create: [{ url: IMG.paint1, kind: "gallery", position: 0 }] },
    },
    {
      title: "Why Your Renovation Quote Varies by $20,000",
      slug: "why-renovation-quotes-vary",
      excerpt: "Same brief, three quotes, three prices. Here's what's behind the gap — and which one to pick.",
      content: `## What's in a Renovation Quote\n\nA renovation quote is **materials + labour + overhead + margin**. The same brief can produce quotes that vary by $20k because:\n\n1. **Material spec** — a $400/sqft kitchen looks identical to a $220/sqft one in the brochure, until you tap it.\n2. **Sub-contractor quality** — cheap tilers leave uneven grout lines, expensive ones don't.\n3. **Project management** — someone is coordinating the trade sequence. If that's not in the quote, that's you on weekends.\n4. **Warranty** — a 1-year warranty is not a 5-year warranty.\n\n## Which Quote to Pick\n\n- The cheapest quote is rarely the cheapest final bill.\n- The most expensive quote is rarely the best work.\n- Pick the contractor whose previous work you've actually seen.`,
      type: "blog",
      category: "Renovation",
      tags: "Advice,Cost",
      featured: false,
      published: true,
      coverImage: IMG.reno1,
      images: { create: [{ url: IMG.reno1, kind: "gallery", position: 0 }] },
    },
  ]

  return samples
}

const testimonials = [
  {
    name: "Mrs Tan",
    role: "5-Room HDB Owner · Punggol",
    rating: 5,
    content: "Ahmad painted our entire flat in 2.5 days. Edges were crisp, no paint on our furniture, and he cleaned up everything before he left. Felt like a brand new flat.",
    avatar: null,
    published: true,
  },
  {
    name: "Daniel Lim",
    role: "Condo Owner · Serangoon",
    rating: 5,
    content: "Re-did my kitchen. Quote was transparent, no surprises, finished on the date he promised. The solid-surface countertop seaming was invisible — that's craft.",
    avatar: null,
    published: true,
  },
  {
    name: "Priya K",
    role: "BTO Owner · Sengkang",
    rating: 5,
    content: "Built my feature wall + TV console. Came back twice to fine-tune the LED lighting until I was happy. That level of after-service is rare.",
    avatar: null,
    published: true,
  },
  {
    name: "Mr Goh",
    role: "Landed Owner · Bukit Timah",
    rating: 5,
    content: "Full rewire of a 4-storey house. LEW-signed, EMA-compliant, zero snags at handover. Will use again for the next property.",
    avatar: null,
    published: true,
  },
  {
    name: "Aisha Bte Rahmat",
    role: "EC Owner · Sembawang",
    rating: 5,
    content: "Re-did my master bathroom. He explained the waterproofing process so I understood why it mattered. Walk-in rain shower is the best money I've ever spent.",
    avatar: null,
    published: true,
  },
]
