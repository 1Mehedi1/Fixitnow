import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const form = await req.formData()
  const file = form.get("file") as File | null
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ error: "Storage service is not configured (missing environment variables)." }, { status: 500 })
  }

  const buf = Buffer.from(await file.arrayBuffer())
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${
    file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
  }`

  const { error } = await supabase.storage
    .from("uploads")
    .upload(filename, buf, { contentType: file.type || "image/jpeg" })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data } = supabase.storage.from("uploads").getPublicUrl(filename)
  return NextResponse.json({ url: data.publicUrl })
}