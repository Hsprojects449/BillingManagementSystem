import { ClientForm } from "@/components/client-form"

export default function NewClientPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Add New Client</h1>
        <p className="text-muted-foreground mt-1">Create a new client record</p>
      </div>

      <div className="max-w-2xl">
        <ClientForm />
      </div>
    </div>
  )
}
