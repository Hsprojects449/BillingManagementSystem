import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SettingsForm } from "@/components/settings-form"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is super admin
  const { data: profile } = await supabase.from("profiles").select("role, organization_id").eq("id", user.id).single()

  if (profile?.role !== "super_admin") {
    redirect("/dashboard")
  }

  // Get organization settings
  const { data: organization } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", profile.organization_id)
    .single()

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">System Settings</h1>
        <p className="text-slate-500 mt-1">Configure tax rules, invoice templates, and system settings</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Organization Settings</CardTitle>
            <CardDescription>Configure your organization details and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsForm organization={organization} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Configuration</CardTitle>
            <CardDescription>Set default tax rates and rules</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Default tax rates are configured per product. You can set organization-wide defaults here in future
              updates.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Templates</CardTitle>
            <CardDescription>Customize invoice appearance and branding</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Invoice template customization will be available in future updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
