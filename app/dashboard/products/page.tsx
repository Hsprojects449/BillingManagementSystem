import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ProductsTable } from "@/components/products-table"
import { DashboardPageWrapper } from "@/components/dashboard-page-wrapper"
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
    <DashboardPageWrapper title="Products & Services">
      <div className="lg:p-8">
        <div className="px-6 pb-4 flex items-center justify-end">
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/dashboard/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>

        <Suspense fallback={<LoadingOverlay />}>
          <div className="px-6">
            <ProductsContent />
          </div>
        </Suspense>
      </div>
    </DashboardPageWrapper>
  )
}
