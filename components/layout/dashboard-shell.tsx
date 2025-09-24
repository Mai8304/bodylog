'use client'

import { useState } from 'react'

import {
  ActivitySquare,
  BarChart3,
  FileBarChart2,
  Home,
  Upload,
  type LucideIcon
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { AppHeader } from '@/components/layout/app-header'
import { DashboardNav, type NavItem as ResolvedNavItem } from '@/components/layout/dashboard-nav'
import { cn } from '@/lib/utils'

type IconKey = 'overview' | 'upload' | 'reports' | 'analytics' | 'settings'

const iconMap: Record<IconKey, LucideIcon> = {
  overview: Home,
  upload: Upload,
  reports: FileBarChart2,
  analytics: BarChart3,
  settings: ActivitySquare
}

export interface DashboardNavConfigItem {
  titleKey: string
  href: string
  icon?: IconKey
}

interface DashboardShellProps {
  children: React.ReactNode
  navItems: DashboardNavConfigItem[]
}

export function DashboardShell({ children, navItems }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const locale = useLocale()
  const tNav = useTranslations('dashboard.nav')
  const tHeader = useTranslations('header')

  const resolvedNavItems: ResolvedNavItem[] = navItems.map((item) => ({
    title: tNav(item.titleKey),
    href: `/${locale}${item.href}`,
    icon: item.icon ? iconMap[item.icon] : undefined
  }))

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex flex-1">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-64 border-r bg-background p-4 transition-transform lg:static lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          <div className="mb-6 text-xl font-semibold">{tHeader('title')}</div>
          <DashboardNav items={resolvedNavItems} />
        </aside>
        <main className="flex-1 overflow-y-auto bg-muted/20 p-6 lg:ml-0">
          <div className="mx-auto w-full max-w-6xl space-y-6">{children}</div>
        </main>
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
