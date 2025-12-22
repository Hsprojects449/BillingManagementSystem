"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  DollarSign,
  BarChart3,
  LogOut,
  Menu,
  X,
  Settings,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

interface Profile {
  id: string
  email: string
  full_name: string
  role: string
}

interface DashboardNavProps {
  profile: Profile | null
}

export function DashboardNav({ profile }: DashboardNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const getNavItemsForRole = (role: string | undefined) => {
    const allNavItems = [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard, roles: ["super_admin", "admin", "accountant"] },
      { href: "/dashboard/users", label: "Users", icon: Users, roles: ["super_admin"] },
      { href: "/dashboard/clients", label: "Clients", icon: Users, roles: ["super_admin", "admin"] },
      { href: "/dashboard/products", label: "Products", icon: Package, roles: ["super_admin", "admin"] },
      { href: "/dashboard/invoices", label: "Invoices", icon: FileText, roles: ["super_admin", "admin", "accountant"] },
      {
        href: "/dashboard/payments",
        label: "Payments",
        icon: DollarSign,
        roles: ["super_admin", "admin", "accountant"],
      },
      { href: "/dashboard/reports", label: "Reports", icon: BarChart3, roles: ["super_admin", "admin", "accountant"] },
      { href: "/dashboard/settings", label: "Settings", icon: Settings, roles: ["super_admin"] },
    ]

    return allNavItems.filter((item) => item.roles.includes(role || "accountant"))
  }

  const navItems = getNavItemsForRole(profile?.role)

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">Invoice Pro</h1>
          <p className="text-sm text-slate-500 mt-1">{profile?.full_name}</p>
          <p className="text-xs text-slate-400 capitalize">{profile?.role?.replace("_", " ")}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <Button onClick={handleSignOut} variant="outline" className="w-full justify-start bg-transparent" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </>
  )
}
