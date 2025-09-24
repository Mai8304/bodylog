import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/marketing/site-header'
import { Newsletter } from '@/components/marketing/newsletter'
import { SiteFooter } from '@/components/marketing/site-footer'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />
      <main className="min-h-[calc(100svh-var(--header-height,56px))]">{children}</main>
      <Newsletter />
      <SiteFooter />
    </div>
  )
}

