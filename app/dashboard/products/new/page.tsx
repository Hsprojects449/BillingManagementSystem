import { ProductForm } from "@/components/product-form"

export default function NewProductPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
        <p className="text-muted-foreground mt-1">Create a new product or service</p>
      </div>

      <div className="max-w-2xl">
        <ProductForm />
      </div>
    </div>
  )
}
