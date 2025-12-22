import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Users, DollarSign, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance">
            Professional Billing Made <span className="text-blue-600">Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl text-balance">
            Streamline your invoicing process with Invoice Pro. Create, track, and manage invoices with ease while
            keeping your business organized and professional.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Invoicing</h3>
            <p className="text-sm text-muted-foreground">
              Create professional invoices with automatic calculations and tax handling
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Client Management</h3>
            <p className="text-sm text-muted-foreground">
              Keep all your client information organized in one secure place
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Payment Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Monitor payments and outstanding balances with real-time updates
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p className="text-sm text-muted-foreground">Get insights into your business with comprehensive reports</p>
          </div>
        </div>
      </div>
    </div>
  )
}
