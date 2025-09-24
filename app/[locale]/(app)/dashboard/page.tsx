'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardOverviewPage() {
  const locale = useLocale()
  const t = useTranslations('dashboard.overview')
  const tStatus = useTranslations('dashboard.status')

  const kpiCards = useMemo(
    () => [
      { key: 'reports', value: '12' },
      { key: 'abnormal', value: '5' },
      { key: 'latest', value: '2025-09-13' }
    ],
    []
  )

  const recentHighlight = (t.raw('recent.highlight') as string[]) ?? []
  const recentStatus = tStatus('completed')

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {kpiCards.map((item) => (
          <Card key={item.key}>
            <CardHeader>
              <CardTitle className="text-base">{t(`kpi.${item.key}.label`)}</CardTitle>
              <CardDescription>{t(`kpi.${item.key}.description`)}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t('recent.title')}</CardTitle>
            <CardDescription>
              {t('recent.description', {
                date: '2025-09-13',
                status: recentStatus
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">{t('recent.focusTitle')}</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                {recentHighlight.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {t('recent.abnormal', { count: 2 })}
              </p>
              <Button asChild size="sm">
                <Link href={`/${locale}/dashboard/reports`}>{t('recent.cta')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('recent.aiTitle')}</CardTitle>
            <CardDescription>{t('recent.aiDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">{t('recent.aiSummary')}</p>
            <Button variant="outline" asChild size="sm" className="mt-4">
              <Link href={`/${locale}/dashboard/upload`}>{t('recent.upload')}</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
