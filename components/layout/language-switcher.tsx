'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { ChangeEvent, useTransition } from 'react'

export function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('header.localeName')

  function onChange(e: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = e.target.value
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale })
    })
  }

  return (
    <select
      aria-label="language"
      className="inline-flex h-9 items-center rounded-md border border-input bg-background px-2 text-sm"
      defaultValue={locale}
      onChange={onChange}
      disabled={isPending}
    >
      {['zh', 'en', 'ja'].map((value) => (
        <option key={value} value={value}>
          {t(value)}
        </option>
      ))}
    </select>
  )
}
