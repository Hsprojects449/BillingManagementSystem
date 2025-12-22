import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardNav } from "@/components/dashboard-nav"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  let { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

  // If profile doesn't exist, create one with default role
  if (!profile && !error) {
    const { data: newProfile } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email || "",
        full_name: user.user_metadata?.full_name || "User",
        role: user.user_metadata?.role || "accountant",
      })
      .select()
      .single()

    profile = newProfile
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardNav profile={profile} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
