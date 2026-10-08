import type { Metadata } from "next"
import { ModernAdminPanel } from "@/components/admin/ModernAdminPanel"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Admin Portal | Ahmad HomeWorks",
  description: "Secure administrative dashboard for 4R Engineering home services portal.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminPage() {
  return <ModernAdminPanel />
}
