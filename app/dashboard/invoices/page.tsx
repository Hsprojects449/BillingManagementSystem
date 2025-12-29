import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { InvoicesPageClient } from "./invoices-page-client"
import { DashboardPageWrapper } from "@/components/dashboard-page-wrapper"
import { Suspense } from "react"
import { LoadingOverlay } from "@/components/loading-overlay"

export default async function InvoicesPage() {
  const supabase = await createClient()

  // Get all clients for selector
  const { data: clients } = await supabase
    .from("clients")
    .select("id, name")
    .order("name", { ascending: true })

  const { data: invoices } = await supabase
    .from("invoices")
    .select(
      `
      *,
      clients(name, email),
      profiles!invoices_created_by_fkey(full_name)
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <DashboardPageWrapper title="Invoices">
      <div className="lg:p-8">
        <div className="px-6 pb-4 flex items-center justify-end">
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/dashboard/invoices/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Link>
            </Button>
          </div>
        </div>

        <Suspense fallback={<LoadingOverlay />}>
          <div className="px-6">
            <InvoicesPageClient clients={clients || []} invoices={invoices || []} />
          </div>
        </Suspense>
      </div>
    </DashboardPageWrapper>
  )
}
