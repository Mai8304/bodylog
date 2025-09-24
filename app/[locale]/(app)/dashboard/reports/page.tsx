'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, RefreshCcw } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { ReportSummary } from '@/lib/types'

export default function ReportsPage() {
  const locale = useLocale()
  const t = useTranslations('dashboard.reports')
  const tStatus = useTranslations('dashboard.status')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reports, setReports] = useState<ReportSummary[]>([])
  const [query, setQuery] = useState('')

  const fetchReports = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/reports')
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.message ?? response.statusText)
      }
      const payload = (await response.json()) as { items: ReportSummary[] }
      setReports(payload.items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setReports([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchReports()
  }, [fetchReports])

  const statusLabel = useMemo(
    () =>
      (status: string) => {
        const key = status as Parameters<typeof tStatus>[0]
        try {
          return tStatus(key)
        } catch {
          return status
        }
      },
    [tStatus]
  )

  const filtered = reports.filter((report) => {
    if (!query) return true
    const statusText = statusLabel(report.status)
    return [report.collected_at, report.source ?? '', statusText]
      .join(' ')
      .toLowerCase()
      .includes(query.toLowerCase())
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/dashboard/upload`}>
            {t('uploadCta')}
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('tableTitle')}</CardTitle>
          <CardDescription>{t('tableSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder={t('searchPlaceholder')}
              className="w-full md:max-w-sm"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Button variant="outline" size="sm" onClick={fetchReports} disabled={loading}>
              <RefreshCcw className="mr-2 h-4 w-4" /> {t('refresh')}
            </Button>
          </div>

          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{t('error', { message: error })}</AlertDescription>
            </Alert>
          ) : null}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('table.date')}</TableHead>
                <TableHead>{t('table.status')}</TableHead>
                <TableHead>{t('table.abnormal')}</TableHead>
                <TableHead>{t('table.source')}</TableHead>
                <TableHead className="text-right">{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                    {loading ? t('loading') : t('empty')}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((report) => (
                  <TableRow key={report.id} className="text-sm">
                    <TableCell>{report.collected_at ? report.collected_at.slice(0, 10) : '-'}</TableCell>
                    <TableCell>
                      <Badge variant={report.status === 'completed' ? 'default' : 'secondary'}>
                        {statusLabel(report.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.abnormal_count ?? '-'}</TableCell>
                    <TableCell>{report.source ?? '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/${locale}/dashboard/reports/${report.id}`}>{t('table.view')}</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
