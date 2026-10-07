import type { SiteSettingsT } from "./site"
import type { StoredPost } from "./posts-store"

/**
 * Returns the canonical base URL for the site.
 * Future-proofed: updates automatically when NEXT_PUBLIC_SITE_URL or custom domain is configured.
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return "https://fixitnow-sg.vercel.app"
}

export const COMPANY_NAME = "Fixitnow"
export const LEGAL_NAME = "4R ENGINEERING PTE. LTD."
export const COMPANY_UEN = "202143324G"
export const PRIMARY_PHONE = "+65 9123 4567"
export const PRIMARY_EMAIL = "hello@ahmadhomeworks.sg"
export const SPECIALIST_NAME = "Ahmad Rahman"

/**
 * Major Singapore residential and commercial planning areas for local search relevance.
 */
export const SINGAPORE_AREAS = [
  "Bedok",
  "Tampines",
  "Pasir Ris",
  "Punggol",
  "Sengkang",
  "Hougang",
  "Ang Mo Kio",
  "Bishan",
  "Toa Payoh",
  "Yishun",
  "Woodlands",
  "Sembawang",
  "Bukit Panjang",
  "Choa Chu Kang",
  "Bukit Batok",
  "Jurong East",
  "Jurong West",
  "Clementi",
  "Queenstown",
  "Bukit Timah",
  "Novena",
  "Kallang",
  "Marine Parade",
  "Geylang",
  "Central Area",
]

export interface ServiceDetail {
  slug: string
  key: string
  title: string
  metaTitle: string
  metaDescription: string
  h1: string
  subtitle: string
  overview: string
  keywords: string[]
  features: string[]
  serviceType: string
  priceRange: string
  faqs: { question: string; answer: string }[]
}

export const CORE_SERVICES: Record<string, ServiceDetail> = {
  "electrician-singapore": {
    slug: "electrician-singapore",
    key: "electrical",
    title: "Licensed Electrician Singapore",
    metaTitle: "Licensed Electrician Singapore | Fast HDB, Condo & Commercial Electrical Services",
    metaDescription:
      "Licensed electrician in Singapore by 4R Engineering. Fast emergency power trip repair, full HDB rewiring, DB box replacement, light & socket installation islandwide.",
    h1: "Licensed Electrician Singapore — EMA-Compliant Electrical Services",
    subtitle:
      "Fast, reliable islandwide electrical troubleshooting, emergency power trip repair, and full house rewiring across all Singapore HDBs, condominiums, and landed homes.",
    overview:
      "Electricity issues can be hazardous and disruptive. 4R Engineering delivers certified, EMA-standard electrical solutions for Singapore homeowners and businesses. From diagnosing stubborn power trips to full distribution board (DB) replacements and whole-house electrical rewiring, every job is executed with high-grade components, strict safety testing, and transparent pricing with zero middleman markups.",
    keywords: [
      "electrician Singapore",
      "licensed electrician Singapore",
      "electrical rewiring Singapore",
      "power trip repair Singapore",
      "emergency electrician Singapore",
      "DB box replacement Singapore",
      "HDB rewiring contractor",
      "electrical repair Singapore",
    ],
    features: [
      "EMA-compliant & certified safety procedures",
      "Fast emergency attendance for sudden power trips & blackouts",
      "Full HDB 3/4/5-room and condominium house rewiring",
      "Distribution Board (DB) replacement with RCCB surge protection",
      "Ceiling fan, lighting points, water heater & 13A socket installation",
      "Zero hidden middleman markups — direct trade contractor rates",
    ],
    serviceType: "Electrical Services",
    priceRange: "$45 – $3,500",
    faqs: [
      {
        question: "How fast can an electrician attend to an emergency power trip in Singapore?",
        answer:
          "For urgent power trips and total home blackouts, our team provides fast islandwide dispatch across Singapore estates (including Tampines, Jurong, Bedok, Woodlands, and Punggol). Contact us immediately on WhatsApp with a photo of your DB box for rapid assistance.",
      },
      {
        question: "Are your electrical installations compliant with Singapore EMA & HDB regulations?",
        answer:
          "Yes. All electrical work conducted by 4R Engineering adheres strictly to Singapore's Energy Market Authority (EMA) safety guidelines and SS CP5 code of practice, utilizing safety-certified cables, breakers, and conduits.",
      },
      {
        question: "What causes recurring power trips in HDB flats?",
        answer:
          "Common culprits include aged water heater elements, faulty refrigerator compressors, overloaded circuits, or deteriorated insulation behind walls causing earth leakage. We use calibrated insulation resistance testers to isolate the exact fault point safely.",
      },
      {
        question: "How much does electrical rewiring cost in Singapore?",
        answer:
          "HDB flat rewiring typically ranges from $1,200 for a 3-room flat to $2,800–$3,500 for larger 5-room flats or executive apartments, depending on whether wiring is surface-mounted in PVC casing or concealed within false ceilings.",
      },
    ],
  },
  "handyman-singapore": {
    slug: "handyman-singapore",
    key: "handyman",
    title: "Handyman Singapore",
    metaTitle: "Handyman Singapore | Islandwide HDB, Condo & Home Repair Services",
    metaDescription:
      "Trusted handyman in Singapore by 4R Engineering. TV wall mounting, door lock repairs, drilling, furniture assembly, plumbing & general home fixes islandwide.",
    h1: "Professional Handyman Singapore — Reliable Islandwide Home Repairs",
    subtitle:
      "From precision TV wall mounting and door lock replacement to general drilling and small fixes, get your home repairs handled properly by skilled trade specialists.",
    overview:
      "Tired of juggling separate contractors for minor household fixes? Our handyman team provides complete, multi-trade home maintenance across Singapore. Whether you need a 75-inch TV securely anchored into concrete, a squeaky sliding door realigned, bathroom accessories installed, or furniture assembled, we bring professional equipment, dust-conscious prep, and honest craftsmanship to every visit.",
    keywords: [
      "handyman Singapore",
      "home repair Singapore",
      "TV wall mounting Singapore",
      "door lock repair Singapore",
      "drilling service Singapore",
      "HDB handyman service",
      "furniture assembly Singapore",
      "affordable handyman Singapore",
    ],
    features: [
      "Precision concrete drilling with dust collection equipment",
      "Heavy-duty TV wall mounting for 43” to 85” displays",
      "Door lock, mortise lock, and digital smart lock installation",
      "Cabinet hinge replacement and sliding door roller repairs",
      "Curtain track, blind, and bathroom accessory mounting",
      "Transparent upfront quotes with zero hidden trip fees",
    ],
    serviceType: "Handyman Services",
    priceRange: "$40 – $250",
    faqs: [
      {
        question: "What types of handyman jobs do you handle in Singapore?",
        answer:
          "We handle virtually all residential repair and installation jobs: TV wall mounting, door lock & handle fixes, mirror & art hanging, curtain rod installation, cabinet hinge repairs, silicone sealant renewal, minor painting, and plumbing tap replacements.",
      },
      {
        question: "Do you bring your own brackets, screws, and tools?",
        answer:
          "Yes. We arrive fully equipped with heavy-duty rotary hammer drills, laser leveling devices, Fischer concrete rawlplugs, stainless steel hardware, and various bracket options suited for Singapore HDB concrete and condo drywalls.",
      },
      {
        question: "How do I book a handyman appointment in Singapore?",
        answer:
          "Simply snap a photo or quick video of the items you need fixed or installed, and WhatsApp our direct line. We will provide an immediate transparent quote and schedule a convenient service slot.",
      },
    ],
  },
  "roofing-waterproofing": {
    slug: "roofing-waterproofing",
    key: "roofing",
    title: "Roofing & Waterproofing Singapore",
    metaTitle: "Roofing & Waterproofing Singapore | Leak Repair & Canopy Specialists",
    metaDescription:
      "Expert roofing and waterproofing in Singapore by 4R Engineering. Roof leak repairs, PU injection, canopy restoration, and roof tiles installation with leak-free warranty.",
    h1: "Roofing & Waterproofing Singapore — Guaranteed Leak-Free Solutions",
    subtitle:
      "Specialized leak detection, multi-layer waterproofing membrane application, canopy restoration, and ridge tile sealing across Singapore landed homes and commercial properties.",
    overview:
      "Singapore's heavy monsoon downpours quickly exploit hairline roof cracks and aged waterproofing membranes. 4R Engineering offers specialized waterproofing and roofing repair services using premium polyurethane (PU) injections, torch-on membranes, and cementitious coatings. We locate the root cause of water ingress and execute long-lasting repairs backed by a leak-free guarantee.",
    keywords: [
      "roofing Singapore",
      "waterproofing Singapore",
      "roof leak repair Singapore",
      "canopy repair Singapore",
      "roof tiles installation Singapore",
      "PU injection Singapore",
      "ceiling leak repair",
      "landed roof contractor Singapore",
    ],
    features: [
      "Advanced thermal & moisture leak detection",
      "High-pressure polyurethane (PU) grout injection for concrete cracks",
      "Multi-layer elastomeric & torch-on waterproofing membranes",
      "Canopy polycarbonate & glass panel joint resealing",
      "Roof tile realignment, replacement, and ridge mortar pointing",
      "Warranty-backed protection against recurring water leaks",
    ],
    serviceType: "Roofing and Waterproofing",
    priceRange: "$180 – $1,200",
    faqs: [
      {
        question: "How do you detect hidden roof leaks without tearing down ceilings?",
        answer:
          "We use non-invasive moisture meters and thermal imaging to trace water pathways behind ceilings and walls, pinpointing the external entry point on the roof or balcony without unnecessary hacking.",
      },
      {
        question: "What is PU injection waterproofing?",
        answer:
          "Polyurethane (PU) injection is a proven, no-hack method where liquid polyurethane is injected under high pressure into concrete fissures. Upon contact with moisture, it expands into a dense, flexible rubber foam that permanently seals water seepage.",
      },
      {
        question: "Do you provide a warranty for roof leak repairs?",
        answer:
          "Yes. All our full-scope roofing and waterproofing jobs come with an official workmanship and leak-free warranty from 4R ENGINEERING PTE. LTD.",
      },
    ],
  },
  "painting-services": {
    slug: "painting-services",
    key: "painting",
    title: "Painting Services Singapore",
    metaTitle: "Painting Services Singapore | HDB, Condo, Office & Epoxy Painting",
    metaDescription:
      "Professional painting services in Singapore by 4R Engineering. Full HDB/Condo house painting, Nippon Paint interior overhaul, epoxy flooring & office painting.",
    h1: "Painting Services Singapore — Dust-Free Prep & Premium Finishes",
    subtitle:
      "Transform your HDB, condominium, or commercial space with premium Nippon & Dulux low-VOC paints, careful furniture protection, and crisp line detailing.",
    overview:
      "A quality paint job requires thorough surface preparation. 4R Engineering provides end-to-end residential and commercial painting services across Singapore. We handle all furniture masking, hairline crack skimming, anti-mold base sealing, and two coats of premium low-odor paint. Our team completes jobs quickly and cleanly so your daily life is not interrupted.",
    keywords: [
      "painting services Singapore",
      "house painting Singapore",
      "HDB painting package",
      "epoxy painting Singapore",
      "office painting Singapore",
      "room painting Singapore",
      "Nippon paint contractor",
      "condo painting Singapore",
    ],
    features: [
      "Full furniture and flooring masking with protective plastic and dropsheets",
      "Anti-mold sealer and hairline plaster patching on all walls",
      "2 full coats of premium Nippon Paint (Odour-less / Vinilex / 3-in-1) or Dulux",
      "Heavy-duty seamless epoxy coating for kitchen, toilet, and carpark floors",
      "Fast 2-3 day completion for full HDB 3/4/5-room flats",
      "Thorough post-job clean-up with zero paint spatter left behind",
    ],
    serviceType: "Painting Services",
    priceRange: "$180 – $1,800",
    faqs: [
      {
        question: "How long does it take to paint a full HDB flat in Singapore?",
        answer:
          "A 3-room HDB flat is typically completed in 1.5 to 2 days, while a 4-room or 5-room flat takes 2 to 3 days. We deploy an experienced crew to ensure swift completion without sacrificing coat quality.",
      },
      {
        question: "Do I need to move or pack my furniture before painting?",
        answer:
          "No need to worry. Our team handles moving furniture to the center of each room and covers everything securely with clean plastic sheeting before preparing the walls.",
      },
      {
        question: "What paints do you use for interior walls in Singapore homes?",
        answer:
          "We primarily apply genuine Nippon Paint Odour-less or Nippon Vinilex 5000, as well as Dulux Wash & Wear. These formulas are low-VOC, anti-bacterial, easy to wipe clean, and dry quickly in Singapore's tropical climate.",
      },
    ],
  },
  "plumbing-services": {
    slug: "plumbing-services",
    key: "plumbing",
    title: "Plumbing Services Singapore",
    metaTitle: "Plumbing Services Singapore | Toilet Leak Repair & Pipe Replacement",
    metaDescription:
      "Reliable plumbing services in Singapore by 4R Engineering. Toilet leak repair, re-piping, tap replacement, unclogging & pipe burst fixes islandwide.",
    h1: "Plumbing Services Singapore — Fast Pipe & Toilet Leak Repairs",
    subtitle:
      "Concealed pipe leak tracing, toilet pan collar repairs, siphon replacements, and pressure-tested PPR pipe upgrades across Singapore homes.",
    overview:
      "Plumbing leaks can cause severe water damage and inflated utility bills if left unaddressed. 4R Engineering delivers prompt, long-lasting plumbing fixes for HDB flats, condominiums, and commercial units across Singapore. From simple faucet replacements and toilet bowl leaks to replacing corroded copper or galvanised pipes with modern heat-fused PPR piping, our work is clean, pressure-tested, and built to last.",
    keywords: [
      "plumbing services Singapore",
      "plumber Singapore",
      "toilet leaking repair Singapore",
      "pipe leak repair Singapore",
      "HDB plumbing contractor",
      "clogged toilet repair Singapore",
      "water heater plumbing Singapore",
      "tap replacement Singapore",
    ],
    features: [
      "Rapid leak detection for exposed and concealed water supply pipes",
      "Toilet bowl siphon, pan collar, flush valve, and inlet pipe repair",
      "Replacement of corroded pipes with heat-fused PPR piping",
      "Kitchen sink, basin mixer tap, and bidet spray replacement",
      "30-minute hydraulic pressure testing to guarantee leak-free joints",
      "Transparent upfront rates with no surprise add-ons",
    ],
    serviceType: "Plumbing Services",
    priceRange: "$80 – $450",
    faqs: [
      {
        question: "What causes a toilet bowl to continuously leak or run water in Singapore HDBs?",
        answer:
          "The most common issue is a deteriorated flush valve flapper or cracked siphon diaphragm inside the cistern, which allows water to trickle down into the bowl constantly. We can replace these internal mechanisms in under 45 minutes.",
      },
      {
        question: "Can you fix concealed pipe leaks behind bathroom tiles without hacking everything?",
        answer:
          "Yes. We first conduct acoustic and pressure tests to pinpoint the exact failure zone. In many cases, we can re-route the supply line using clean stainless steel or PPR casing without extensive tile hacking.",
      },
      {
        question: "Do you provide emergency plumbing repairs on weekends?",
        answer:
          "Yes. Our plumbing technicians operate 7 days a week across all Singapore estates. Contact us directly on WhatsApp with photos or videos for fast assistance.",
      },
    ],
  },
}

/**
 * Builds the comprehensive Schema.org LocalBusiness JSON-LD markup.
 */
export function buildLocalBusinessSchema(settings: SiteSettingsT) {
  const baseUrl = getBaseUrl()
  const brandName = settings.brand || COMPANY_NAME
  const companyLegal = settings.companyName || LEGAL_NAME
  const companyUen = settings.companyUen || COMPANY_UEN
  const phone = settings.phone || PRIMARY_PHONE
  const email = settings.email || PRIMARY_EMAIL

  return {
    "@context": "https://schema.org",
    "@type": ["HomeAndConstructionBusiness", "LocalBusiness", "ProfessionalService"],
    "@id": `${baseUrl}/#localbusiness`,
    name: `${brandName} — ${companyLegal}`,
    alternateName: brandName,
    legalName: companyLegal,
    description:
      "Licensed electrician, handyman, roofing & waterproofing, painting services, and plumbing contractor in Singapore. ACRA registered entity 4R ENGINEERING PTE. LTD.",
    url: baseUrl,
    telephone: phone,
    email: email,
    priceRange: "$$",
    image: `${baseUrl}/hero/hero-1.webp`,
    logo: `${baseUrl}/favicon.ico`,
    taxID: companyUen,
    founder: {
      "@type": "Person",
      name: settings.workerName || SPECIALIST_NAME,
      jobTitle: "Principal Trade Contractor",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Singapore Islandwide",
      addressLocality: "Singapore",
      postalCode: "018989",
      addressCountry: "SG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 1.3521,
      longitude: 103.8198,
    },
    areaServed: SINGAPORE_AREAS.map((area) => ({
      "@type": "City",
      name: `${area}, Singapore`,
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "08:00",
        closes: "21:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: settings.rating || 4.9,
      reviewCount: 148,
      bestRating: 5,
      worstRating: 1,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Singapore Home & Trade Services",
      itemListElement: Object.values(CORE_SERVICES).map((service, index) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.overview,
          url: `${baseUrl}/services/${service.slug}`,
        },
        position: index + 1,
      })),
    },
  }
}

/**
 * Builds Schema.org Service JSON-LD for a specific service page.
 */
export function buildServiceSchema(service: ServiceDetail, settings: SiteSettingsT) {
  const baseUrl = getBaseUrl()
  const phone = settings.phone || PRIMARY_PHONE
  const brandName = settings.brand || COMPANY_NAME

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${baseUrl}/services/${service.slug}#service`,
    name: service.title,
    serviceType: service.serviceType,
    description: service.metaDescription,
    provider: {
      "@type": "LocalBusiness",
      name: `${brandName} — ${settings.companyName || LEGAL_NAME}`,
      telephone: phone,
      url: baseUrl,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Singapore",
        addressCountry: "SG",
      },
    },
    areaServed: {
      "@type": "Country",
      name: "Singapore",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "SGD",
      price: service.priceRange,
      availability: "https://schema.org/InStock",
    },
  }
}

/**
 * Builds Schema.org CreativeWork / Project JSON-LD for an individual portfolio work page.
 */
export function buildProjectSchema(post: StoredPost, settings: SiteSettingsT) {
  const baseUrl = getBaseUrl()
  const coverImage = post.coverImage || post.images?.[0]?.url || `${baseUrl}/hero/hero-1.webp`

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${baseUrl}/work/${post.slug}#project`,
    headline: post.title,
    description: post.excerpt || post.title,
    image: [coverImage],
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt || post.createdAt).toISOString(),
    author: {
      "@type": "Organization",
      name: `${settings.brand || COMPANY_NAME} — ${settings.companyName || LEGAL_NAME}`,
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: settings.companyName || LEGAL_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/favicon.ico`,
      },
    },
    about: {
      "@type": "Thing",
      name: post.category || "Home Improvement",
    },
    locationCreated: {
      "@type": "Place",
      name: "Singapore",
    },
  }
}

/**
 * Builds Schema.org FAQPage JSON-LD.
 */
export function buildFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  }
}

/**
 * Builds Schema.org BreadcrumbList JSON-LD.
 */
export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
