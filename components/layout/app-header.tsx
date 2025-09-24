'use client'

import { LogOut, Menu, UserRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/layout/language-switcher'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

interface AppHeaderProps {
  onToggleSidebar?: () => void
}

export function AppHeader({ onToggleSidebar }: AppHeaderProps) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('header')
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    setLoading(true)
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    setLoading(false)
    router.push(`/${locale}/auth/login`)
  }

  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onToggleSidebar}>
          <Menu className="h-4 w-4" />
        </Button>
        <span className="text-lg font-semibold">{t('title')}</span>
      </div>
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <div className="hidden items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground sm:flex">
          <UserRound className="h-4 w-4" />
          <span>{t('account')}</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut} disabled={loading}>
          <LogOut className="mr-2 h-4 w-4" /> {t('signOut')}
        </Button>
      </div>
    </header>
  )
}
