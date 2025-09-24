import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function LandingPage({ params }: { params: { locale: string } }) {
  const supabase = createSupabaseServerClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (session) {
    redirect(`/${params.locale}/dashboard`)
  }

  const t = await getTranslations({ locale: params.locale, namespace: 'landing' })

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-10 text-center">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">{t('title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('subtitle')}</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href={`/${params.locale}/auth/login`}>{t('login')}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${params.locale}/auth/register`}>{t('register')}</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
