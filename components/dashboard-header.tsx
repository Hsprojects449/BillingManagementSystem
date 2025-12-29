"use client"

import { usePageTitleContext } from "@/app/dashboard/page-title-context"
import { NotificationBell } from "@/components/notification-bell"

interface DashboardHeaderProps {
  userId: string
}

export function DashboardHeader({ userId }: DashboardHeaderProps) {
  const { title } = usePageTitleContext()

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {title && <h1 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight truncate">{title}</h1>}
      </div>
      <div className="flex-shrink-0">
        <NotificationBell userId={userId} />
      </div>
    </header>
  )
}
