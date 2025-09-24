'use client'

import { useEffect, useMemo, useState } from 'react'
import { FileWarning, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ReportDetail } from '@/lib/types'

interface Props {
  params: { reportId: string }
}

export default function ReportDetailPage({ params }: Props) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [report, setReport] = useState<ReportDetail | null>(null)
  const locale = useLocale()
  const t = useTranslations('dashboard.detail')
  const tStatus = useTranslations('dashboard.status')

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/reports/${params.reportId}`)
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}))
          throw new Error(payload.message ?? t('errors.unavailable'))
        }
        const payload = (await response.json()) as { report: ReportDetail }
        setReport(payload.report)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('errors.generic'))
      } finally {
        setLoading(false)
      }
    }

    void fetchDetail()
  }, [params.reportId, t])

  const groupedMetrics = useMemo(() => {
    if (!report) return []
    const groups = new Map<string, typeof report.metrics>()
    for (const metric of report.metrics) {
      const label = t(`categories.${metric.category}`, { fallback: metric.category })
      const list = groups.get(label) ?? []
      list.push(metric)
      groups.set(label, list)
    }
    return Array.from(groups.entries())
  }, [report, t])

  function renderFlag(flag: ReportDetail['metrics'][number]['flag']) {
    switch (flag) {
      case 'high':
        return t('flag.high')
      case 'low':
        return t('flag.low')
      case 'normal':
        return t('flag.normal')
      default:
        return t('flag.unknown')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${locale}/dashboard/reports`}>{t('back')}</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 rounded-lg border bg-card p-6 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> {t('loading')}
        </div>
      ) : null}

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>{t('errorTitle')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {report ? (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <CardTitle>{t('summaryTitle')}</CardTitle>
                <CardDescription>
                  {t('summaryDescription', {
                    date: report.collected_at?.slice(0, 10) ?? '-',
                    status: tStatus(report.status as Parameters<typeof tStatus>[0])
                  })}
                </CardDescription>
              </div>
              <Badge variant={report.status === 'completed' ? 'default' : 'secondary'}>
                {tStatus(report.status as Parameters<typeof tStatus>[0])}
              </Badge>
            </CardHeader>
          </Card>

          <Tabs defaultValue="structured" className="xl:col-span-2">
            <TabsList>
              <TabsTrigger value="structured">{t('structuredTitle')}</TabsTrigger>
              <TabsTrigger value="ai">{t('aiTitle')}</TabsTrigger>
              <TabsTrigger value="original">{t('originalTitle')}</TabsTrigger>
            </TabsList>
            <TabsContent value="structured">
              <Card>
                <CardContent className="p-0">
                  {groupedMetrics.length === 0 ? (
                    <div className="p-6 text-sm text-muted-foreground">{t('structuredEmpty')}</div>
                  ) : (
                    <ScrollArea className="max-h-[520px]">
                      <div className="divide-y">
                        {groupedMetrics.map(([category, metrics]) => (
                          <div key={category} className="p-6">
                            <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">{category}</h3>
                            <div className="space-y-3">
                              {metrics.map((metric) => (
                                <div key={`${metric.canonical_key}-${metric.display_name}`} className="rounded-lg border p-3">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium">{metric.display_name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {t('originalValue', { value: metric.original_value_text ?? '-' })}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-lg font-semibold">
                                        {metric.value ?? '-'} {metric.unit}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {t('referenceRange', {
                                          low: metric.ref_low ?? '-'
                                        , high: metric.ref_high ?? '-'
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{t('confidence', { value: (metric.confidence ?? 0).toFixed(2) })}</span>
                                    <Badge variant={metric.flag === 'normal' ? 'secondary' : 'default'}>
                                      {renderFlag(metric.flag)}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai">
              <Card>
                <CardHeader>
                  <CardTitle>{t('aiTitle')}</CardTitle>
                  <CardDescription>{t('aiDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
                  {report.ai_summary ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-foreground">{t('aiSections.overview')}</h3>
                        <p>{report.ai_summary.summary}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{t('aiSections.risks')}</h3>
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                          {report.ai_summary.risks.map((risk) => (
                            <li key={risk}>{risk}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{t('aiSections.recommendations')}</h3>
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                          {report.ai_summary.recommendations.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-xs text-muted-foreground">{t('aiDisclaimer')}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileWarning className="h-4 w-4" /> {t('aiEmpty')}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="original">
              <Card>
                <CardHeader>
                  <CardTitle>{t('originalTitle')}</CardTitle>
                  <CardDescription>{t('originalDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  {report.file_url ? (
                    report.file_url.endsWith('.pdf') ? (
                      <iframe src={report.file_url} className="h-[600px] w-full rounded-lg border" title="report-pdf" />
                    ) : (
                      <img src={report.file_url} alt="report" className="w-full rounded-lg border" />
                    )
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileWarning className="h-4 w-4" /> {t('originalEmpty')}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : null}
    </div>
  )
}
