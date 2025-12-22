import { createClient } from "@/lib/supabase/server"
import { InvoiceForm } from "@/components/invoice-form"

export default async function NewInvoicePage() {
  const supabase = await createClient()

  // Fetch clients and active products
  const [clientsResult, productsResult] = await Promise.all([
    supabase.from("clients").select("id, name, email").order("name"),
    supabase.from("products").select("*").eq("is_active", true).order("name"),
  ])

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
        <p className="text-muted-foreground mt-1">Generate a new invoice for a client</p>
      </div>

      <InvoiceForm clients={clientsResult.data || []} products={productsResult.data || []} />
    </div>
  )
}
