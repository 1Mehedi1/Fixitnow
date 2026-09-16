/** Singapore home-services worker config. Edit via env in production. */
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_WORKER_NAME || "Ahmad Rahman",
  brand: process.env.NEXT_PUBLIC_BRAND || "Ahmad HomeWorks",
  tagline: "Singapore's Trusted Handyman",
  phone: process.env.NEXT_PUBLIC_PHONE || "+65 9123 4567",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "6591234567", // digits only, country code first
  email: process.env.NEXT_PUBLIC_EMAIL || "hello@ahmadhomeworks.sg",
  location: process.env.NEXT_PUBLIC_LOCATION || "Singapore · Islandwide",
  yearsExperience: 12,
  jobsCompleted: 540,
  happyClients: 320,
  rating: 4.9,
  services: [
    { key: "plumbing", label: "Plumbing", icon: "Wrench", desc: "Leaks, taps, pipes, water heaters, toilets — fixed fast and guaranteed." },
    { key: "painting", label: "Painting", icon: "PaintRoller", desc: "HDB, condo, landed. Premium paints, neat edges, dust-free prep." },
    { key: "renovation", label: "Renovation", icon: "Hammer", desc: "Kitchen, toilet, full-home. Design-build with trusted sub-contractors." },
    { key: "electrical", label: "Electrical", icon: "Zap", desc: "Licensed (LEW) wiring, sockets, lighting, DB upgrades, EMA compliance." },
    { key: "interior", label: "Interior Works", icon: "Sofa", desc: "Carpentry, built-ins, feature walls, false ceilings, lighting design." },
    { key: "repair", label: "General Repair", icon: "Settings", desc: "Doors, locks, cabinets, tiles, grout, caulking. No job too small." },
  ] as const,
}

/** Build a wa.me URL with a pre-filled message. */
export function whatsappLink(message?: string): string {
  const text = message
    ? `?text=${encodeURIComponent(message)}`
    : ""
  return `https://wa.me/${siteConfig.whatsapp}${text}`
}

/** Build a context-aware WhatsApp message for a specific post. */
export function whatsappForPost(title: string, type: "portfolio" | "blog"): string {
  return type === "portfolio"
    ? `Hi ${siteConfig.name}, I saw your "${title}" work on your website. Can you give me a quote for a similar job?`
    : `Hi ${siteConfig.name}, I read your blog post "${title}" and I'd like to chat about a job.`
}
