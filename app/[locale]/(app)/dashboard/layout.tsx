import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { DashboardShell, type DashboardNavConfigItem } from '@/components/layout/dashboard-shell'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const navItems: DashboardNavConfigItem[] = [
  { titleKey: 'overview', href: '/dashboard', icon: 'overview' },
  { titleKey: 'upload', href: '/dashboard/upload', icon: 'upload' },
  { titleKey: 'reports', href: '/dashboard/reports', icon: 'reports' },
  { titleKey: 'analytics', href: '/dashboard/analytics', icon: 'analytics' },
  { titleKey: 'settings', href: '/dashboard/settings', icon: 'settings' }
]

export default async function DashboardLayout({
  children,
  params
}: {
  children: ReactNode
  params: { locale: string }
}) {
  const supabase = createSupabaseServerClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/${params.locale}/auth/login`)
  }

  return <DashboardShell navItems={navItems}>{children}</DashboardShell>
}
