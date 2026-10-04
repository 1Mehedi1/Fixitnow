import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdmin } from "@/lib/auth"
import { getCustomSections, saveCustomSection } from "@/lib/sections-store"

/** Public: get all custom sections */
export async function GET() {
  try {
    const sections = await getCustomSections()
    return NextResponse.json({ sections })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to load sections" }, { status: 500 })
  }
}

/** Admin: create a custom section */
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await req.json().catch(() => ({}))
    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: "Title required" }, { status: 400 })
    }
    const section = await saveCustomSection(body)
    try {
      revalidatePath("/")
    } catch {}
    return NextResponse.json({ section, ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create section" }, { status: 500 })
  }
}
