import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ProductsTable } from "@/components/products-table"
import { Suspense } from "react"
import { LoadingOverlay } from "@/components/loading-overlay"

async function ProductsContent() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select("*, profiles!products_created_by_fkey(full_name)")
    .order("created_at", { ascending: false })

  return <ProductsTable products={products || []} />
}

export default async function ProductsPage() {

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products & Services</h1>
          <p className="text-muted-foreground mt-1">Manage your product catalog and service offerings</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <Suspense fallback={<LoadingOverlay />}>
        <ProductsContent />
      </Suspense>
    </div>
  )
}
