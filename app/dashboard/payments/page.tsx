import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { PaymentsTable } from "@/components/payments-table"

export default async function PaymentsPage() {
  const supabase = await createClient()

  const { data: payments } = await supabase
    .from("payments")
    .select(
      `
      *,
      invoices(invoice_number, total_amount, clients(name)),
      profiles!payments_created_by_fkey(full_name)
    `,
    )
    .order("payment_date", { ascending: false })

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground mt-1">Track and manage payment records</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/payments/new">
            <Plus className="h-4 w-4 mr-2" />
            Record Payment
          </Link>
        </Button>
      </div>

      <PaymentsTable payments={payments || []} />
    </div>
  )
}
