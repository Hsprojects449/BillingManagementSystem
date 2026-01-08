import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient as createServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { id } = await request.json()
    
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Missing or invalid 'id'" }, { status: 400 })
    }

    // Use service role to unban the auth user (allows sign-in)
    const admin = createAdminClient()
    const { error: unbanError } = await admin.auth.admin.updateUserById(id, {
      ban_duration: "none",
    } as any)

    if (unbanError) {
      return NextResponse.json({ error: unbanError.message }, { status: 500 })
    }

    // Use admin client for profile update to bypass RLS
    const { error: profileError } = await admin
      .from("profiles")
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
