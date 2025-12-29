import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { UsersTable } from "@/components/users-table"
import { DashboardPageWrapper } from "@/components/dashboard-page-wrapper"
import { Suspense } from "react"
import { LoadingOverlay } from "@/components/loading-overlay"
import { unstable_noStore as noStore } from 'next/cache'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function UsersContent({ userRole }: { userRole: string }) {
  noStore()
  const supabase = await createClient()

  const { data: users } = await supabase
    .from("profiles")
    .select("*, organizations(name)")
    .order("created_at", { ascending: false })

  console.log('Users fetched:', users?.map(u => ({ email: u.email, is_active: u.is_active })))

  return <UsersTable key={Date.now()} users={users || []} userRole={userRole} />
}

export default async function UsersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check role (super_admin full, admin view-only)
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || (profile.role !== "super_admin" && profile.role !== "admin")) {
    redirect("/dashboard")
  }

  const userRole = profile.role

  return (
    <DashboardPageWrapper title="User Management">
      <div className="lg:p-8">
        <div className="px-6 pb-4 flex items-center justify-end">
          <div className="flex items-center gap-2">
            {userRole === "super_admin" && (
              <Link href="/dashboard/users/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </Link>
            )}
          </div>
        </div>

        <Suspense fallback={<LoadingOverlay />}>
          <div className="px-6">
            <UsersContent userRole={userRole} />
          </div>
        </Suspense>
      </div>
    </DashboardPageWrapper>
  )
}
