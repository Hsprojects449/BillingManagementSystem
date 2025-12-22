import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Pencil, DollarSign } from "lucide-react"
import { InvoiceActions } from "@/components/invoice-actions"

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [invoiceResult, itemsResult, paymentsResult] = await Promise.all([
    supabase
      .from("invoices")
      .select(
        `
        *,
        clients(name, email, phone, address, city, state, zip_code, country),
        profiles!invoices_created_by_fkey(full_name)
      `,
      )
      .eq("id", id)
      .single(),
    supabase.from("invoice_items").select("*").eq("invoice_id", id),
    supabase.from("payments").select("*").eq("invoice_id", id).order("payment_date", { ascending: false }),
  ])

  if (invoiceResult.error || !invoiceResult.data) {
    notFound()
  }

  const invoice = invoiceResult.data
  const items = itemsResult.data || []
  const payments = paymentsResult.data || []

  const statusConfig = {
    draft: { label: "Draft", className: "bg-gray-100 text-gray-800" },
    sent: { label: "Sent", className: "bg-blue-100 text-blue-800" },
    paid: { label: "Paid", className: "bg-green-100 text-green-800" },
    overdue: { label: "Overdue", className: "bg-red-100 text-red-800" },
    cancelled: { label: "Cancelled", className: "bg-slate-100 text-slate-800" },
  }

  const config = statusConfig[invoice.status as keyof typeof statusConfig]
  const balance = Number(invoice.total_amount) - Number(invoice.amount_paid)

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{invoice.invoice_number}</h1>
          <p className="text-muted-foreground mt-1">Invoice details and line items</p>
        </div>
        <div className="flex gap-2">
          <InvoiceActions invoiceId={invoice.id} currentStatus={invoice.status} />
          {invoice.status === "draft" && (
            <Button asChild variant="outline">
              <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
          )}
          {balance > 0 && invoice.status !== "cancelled" && (
            <Button asChild>
              <Link href={`/dashboard/payments/new?invoice_id=${invoice.id}`}>
                <DollarSign className="h-4 w-4 mr-2" />
                Record Payment
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="secondary" className={config.className}>
                    {config.label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created By</p>
                  <p className="font-medium">{invoice.profiles?.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Issue Date</p>
                  <p className="font-medium">{new Date(invoice.issue_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">{new Date(invoice.due_date).toLocaleDateString()}</p>
                </div>
              </div>

              {invoice.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm">{invoice.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Tax</TableHead>
                    <TableHead className="text-right">Discount</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{Number(item.quantity).toFixed(2)}</TableCell>
                      <TableCell className="text-right">${Number(item.unit_price).toFixed(2)}</TableCell>
                      <TableCell className="text-right">{Number(item.tax_rate).toFixed(2)}%</TableCell>
                      <TableCell className="text-right">{Number(item.discount).toFixed(2)}%</TableCell>
                      <TableCell className="text-right font-medium">${Number(item.line_total).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="border-t mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">${Number(invoice.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount:</span>
                  <span className="font-medium text-red-600">-${Number(invoice.discount_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax:</span>
                  <span className="font-medium">${Number(invoice.tax_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>${Number(invoice.total_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Amount Paid:</span>
                  <span>${Number(invoice.amount_paid).toFixed(2)}</span>
                </div>
                {balance > 0 && (
                  <div className="flex justify-between text-lg font-bold text-red-600">
                    <span>Balance Due:</span>
                    <span>${balance.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {payments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">${Number(payment.amount).toFixed(2)}</TableCell>
                        <TableCell className="capitalize">{payment.payment_method.replace("_", " ")}</TableCell>
                        <TableCell className="text-muted-foreground">{payment.reference_number || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Client Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{invoice.clients.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-sm">{invoice.clients.email}</p>
              </div>
              {invoice.clients.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-sm">{invoice.clients.phone}</p>
                </div>
              )}
              {invoice.clients.address && (
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="text-sm">
                    {invoice.clients.address}
                    <br />
                    {invoice.clients.city}, {invoice.clients.state} {invoice.clients.zip_code}
                    <br />
                    {invoice.clients.country}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
