"use client"

import { usePageTitle } from "@/app/dashboard/page-title-context"
import { ReactNode } from "react"

interface DashboardPageWrapperProps {
  title: string
  children: ReactNode
}

export function DashboardPageWrapper({ title, children }: DashboardPageWrapperProps) {
  usePageTitle(title)
  return <>{children}</>
}
