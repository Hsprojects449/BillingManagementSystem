"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface Invoice {
  id: string
  invoice_number: string
  total_amount: string
  amount_paid: string
  clients: {
    name: string
  }
}

interface PaymentFormProps {
  invoices: Invoice[]
  preSelectedInvoiceId?: string
}

export function PaymentForm({ invoices, preSelectedInvoiceId }: PaymentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const [formData, setFormData] = useState({
    invoice_id: preSelectedInvoiceId || "",
    amount: "",
    payment_date: new Date().toISOString().split("T")[0],
    payment_method: "bank_transfer",
    reference_number: "",
    status: "completed",
    notes: "",
  })

  // Set selected invoice when invoice_id changes
  useEffect(() => {
    if (formData.invoice_id) {
      const invoice = invoices.find((inv) => inv.id === formData.invoice_id)
      setSelectedInvoice(invoice || null)

      // Auto-fill amount with remaining balance if empty
      if (invoice && !formData.amount) {
        const balance = Number(invoice.total_amount) - Number(invoice.amount_paid)
        setFormData((prev) => ({ ...prev, amount: balance.toFixed(2) }))
      }
    }
  }, [formData.invoice_id, invoices, formData.amount])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setError("You must be logged in")
      setIsLoading(false)
      return
    }

    try {
      // Insert payment
      const { error: paymentError } = await supabase.from("payments").insert({
        invoice_id: formData.invoice_id,
        amount: formData.amount,
        payment_date: formData.payment_date,
        payment_method: formData.payment_method,
        reference_number: formData.reference_number || null,
        status: formData.status,
        notes: formData.notes || null,
        created_by: user.id,
      })

      if (paymentError) throw paymentError

      // Update invoice amount_paid
      if (selectedInvoice) {
        const newAmountPaid = Number(selectedInvoice.amount_paid) + Number(formData.amount)
        const totalAmount = Number(selectedInvoice.total_amount)

        // Determine new status
        let newStatus = "sent"
        if (newAmountPaid >= totalAmount) {
          newStatus = "paid"
        }

        const { error: invoiceError } = await supabase
          .from("invoices")
          .update({
            amount_paid: newAmountPaid,
            status: newStatus,
          })
          .eq("id", formData.invoice_id)

        if (invoiceError) throw invoiceError
      }

      router.push("/dashboard/payments")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const balance = selectedInvoice ? Number(selectedInvoice.total_amount) - Number(selectedInvoice.amount_paid) : 0

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="invoice_id">
              Invoice <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.invoice_id}
              onValueChange={(value) => setFormData({ ...formData, invoice_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an invoice" />
              </SelectTrigger>
              <SelectContent>
                {invoices.map((invoice) => {
                  const invoiceBalance = Number(invoice.total_amount) - Number(invoice.amount_paid)
                  return (
                    <SelectItem key={invoice.id} value={invoice.id}>
                      {invoice.invoice_number} - {invoice.clients.name} (${invoiceBalance.toFixed(2)} due)
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {selectedInvoice && (
            <div className="p-4 bg-slate-50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Invoice Total:</span>
                <span className="font-medium">${Number(selectedInvoice.total_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="font-medium">${Number(selectedInvoice.amount_paid).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t pt-2">
                <span>Balance Due:</span>
                <span className="text-red-600">${balance.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">
                Payment Amount <span className="text-red-500">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max={balance > 0 ? balance : undefined}
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_date">
                Payment Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="payment_date"
                type="date"
                required
                value={formData.payment_date}
                onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_method">
                Payment Method <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference_number">Reference Number</Label>
              <Input
                id="reference_number"
                value={formData.reference_number}
                onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                placeholder="Transaction ID, Check #, etc."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">
              Payment Status <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about this payment..."
              rows={3}
            />
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading || !formData.invoice_id}>
              {isLoading ? "Recording..." : "Record Payment"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
