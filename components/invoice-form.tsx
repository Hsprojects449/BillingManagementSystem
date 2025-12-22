"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"

interface Client {
  id: string
  name: string
  email: string
}

interface Product {
  id: string
  name: string
  description: string | null
  unit_price: string
  unit: string | null
  tax_rate: string
}

interface InvoiceItem {
  product_id: string | null
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
  discount: number
  line_total: number
}

interface InvoiceFormProps {
  clients: Client[]
  products: Product[]
}

export function InvoiceForm({ clients, products }: InvoiceFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    client_id: "",
    issue_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "",
  })

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      product_id: null,
      description: "",
      quantity: 1,
      unit_price: 0,
      tax_rate: 0,
      discount: 0,
      line_total: 0,
    },
  ])

  const [totals, setTotals] = useState({
    subtotal: 0,
    tax_amount: 0,
    discount_amount: 0,
    total_amount: 0,
  })

  // Calculate line total for each item
  const calculateLineTotal = (item: InvoiceItem) => {
    const subtotal = item.quantity * item.unit_price
    const discountAmount = (subtotal * item.discount) / 100
    const afterDiscount = subtotal - discountAmount
    const taxAmount = (afterDiscount * item.tax_rate) / 100
    return afterDiscount + taxAmount
  }

  // Recalculate totals whenever items change
  useEffect(() => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
    const discount_amount = items.reduce(
      (sum, item) => sum + (item.quantity * item.unit_price * item.discount) / 100,
      0,
    )
    const afterDiscount = subtotal - discount_amount
    const tax_amount = items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unit_price
      const itemDiscount = (itemSubtotal * item.discount) / 100
      const itemAfterDiscount = itemSubtotal - itemDiscount
      return sum + (itemAfterDiscount * item.tax_rate) / 100
    }, 0)
    const total_amount = afterDiscount + tax_amount

    setTotals({
      subtotal,
      tax_amount,
      discount_amount,
      total_amount,
    })
  }, [items])

  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      const newItems = [...items]
      newItems[index] = {
        ...newItems[index],
        product_id: productId,
        description: product.name,
        unit_price: Number(product.unit_price),
        tax_rate: Number(product.tax_rate),
      }
      newItems[index].line_total = calculateLineTotal(newItems[index])
      setItems(newItems)
    }
  }

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    newItems[index].line_total = calculateLineTotal(newItems[index])
    setItems(newItems)
  }

  const addItem = () => {
    setItems([
      ...items,
      {
        product_id: null,
        description: "",
        quantity: 1,
        unit_price: 0,
        tax_rate: 0,
        discount: 0,
        line_total: 0,
      },
    ])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

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
      // Generate invoice number
      const invoiceNumber = `INV-${Date.now()}`

      // Insert invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          invoice_number: invoiceNumber,
          client_id: formData.client_id,
          issue_date: formData.issue_date,
          due_date: formData.due_date,
          status: "draft",
          subtotal: totals.subtotal,
          tax_amount: totals.tax_amount,
          discount_amount: totals.discount_amount,
          total_amount: totals.total_amount,
          amount_paid: 0,
          notes: formData.notes,
          created_by: user.id,
        })
        .select()
        .single()

      if (invoiceError) throw invoiceError

      // Insert invoice items
      const itemsToInsert = items.map((item) => ({
        invoice_id: invoice.id,
        product_id: item.product_id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate,
        discount: item.discount,
        line_total: item.line_total,
      }))

      const { error: itemsError } = await supabase.from("invoice_items").insert(itemsToInsert)

      if (itemsError) throw itemsError

      router.push(`/dashboard/invoices/${invoice.id}`)
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="client_id">
                Client <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.client_id}
                onValueChange={(value) => setFormData({ ...formData, client_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="issue_date">
                Issue Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="issue_date"
                type="date"
                required
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">
                Due Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="due_date"
                type="date"
                required
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes for this invoice..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Line Items</CardTitle>
          <Button type="button" onClick={addItem} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Product/Service</Label>
                      <Select
                        value={item.product_id || ""}
                        onValueChange={(value) => handleProductSelect(index, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - ${Number(product.unit_price).toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        required
                        value={item.description}
                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                        placeholder="Item description"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-5">
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Unit Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(index, "unit_price", Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tax Rate (%)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={item.tax_rate}
                        onChange={(e) => handleItemChange(index, "tax_rate", Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Discount (%)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={item.discount}
                        onChange={(e) => handleItemChange(index, "discount", Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Line Total</Label>
                      <Input value={`$${item.line_total.toFixed(2)}`} disabled />
                    </div>
                  </div>
                </div>

                {items.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount:</span>
              <span className="font-medium text-red-600">-${totals.discount_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax:</span>
              <span className="font-medium">${totals.tax_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>${totals.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading || !formData.client_id}>
          {isLoading ? "Creating..." : "Create Invoice"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
