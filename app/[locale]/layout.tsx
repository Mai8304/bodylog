import '../globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { SessionProvider } from '@/components/providers/session-provider'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'BodyLog',
  description: 'AI-enabled health report assistant'
}

const supportedLocales = ['zh', 'en', 'ja'] as const

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!supportedLocales.includes(locale as (typeof supportedLocales)[number])) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages({ locale })
  const supabase = createSupabaseServerClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider key={locale} locale={locale} messages={messages}>
          <SessionProvider session={session}>{children}</SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
