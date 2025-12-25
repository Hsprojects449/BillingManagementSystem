import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { UsersTable } from "@/components/users-table"
import { Suspense } from "react"
import { LoadingOverlay } from "@/components/loading-overlay"

async function UsersContent({ userRole }: { userRole: string }) {
  const supabase = await createClient()

  const { data: users } = await supabase
    .from("profiles")
    .select("*, organizations(name)")
    .order("created_at", { ascending: false })

  return <UsersTable users={users || []} userRole={userRole} />
}

export default async function UsersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check role (admin full, manager view-only)
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || (profile.role !== "admin" && profile.role !== "manager")) {
    redirect("/dashboard")
  }

  const userRole = profile.role

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1">Manage system users and their roles</p>
        </div>
        {userRole === "admin" && (
          <Link href="/dashboard/users/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </Link>
        )}
      </div>

      <Suspense fallback={<LoadingOverlay />}>
        <UsersContent userRole={userRole} />
      </Suspense>
    </div>
  )
}
