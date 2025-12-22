import { createClient } from "@/lib/supabase/server"
import { PaymentForm } from "@/components/payment-form"

export default async function NewPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ invoice_id?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Fetch unpaid or partially paid invoices
  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, invoice_number, total_amount, amount_paid, clients(name)")
    .neq("status", "paid")
    .neq("status", "cancelled")
    .order("invoice_number", { ascending: false })

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Record Payment</h1>
        <p className="text-muted-foreground mt-1">Add a new payment record</p>
      </div>

      <div className="max-w-2xl">
        <PaymentForm invoices={invoices || []} preSelectedInvoiceId={params.invoice_id} />
      </div>
    </div>
  )
}
