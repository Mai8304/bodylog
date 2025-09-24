'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTranslations } from 'next-intl'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { TrendSeries } from '@/lib/types'

const mockSeries: TrendSeries = {
  'blood_glucose.fpg': [
    { date: '2025-06-01', value: 5.2, flag: 'normal' },
    { date: '2025-07-10', value: 5.8, flag: 'normal' },
    { date: '2025-08-08', value: 6.4, flag: 'high' },
    { date: '2025-09-13', value: 6.1, flag: 'high' }
  ],
  'blood_lipids.tc': [
    { date: '2025-06-01', value: 4.8, flag: 'normal' },
    { date: '2025-07-10', value: 5.5, flag: 'high' },
    { date: '2025-08-08', value: 5.2, flag: 'high' },
    { date: '2025-09-13', value: 5.0, flag: 'normal' }
  ],
  'blood_lipids.ldl_c': [
    { date: '2025-06-01', value: 3.2, flag: 'high' },
    { date: '2025-07-10', value: 3.0, flag: 'high' },
    { date: '2025-08-08', value: 2.6, flag: 'normal' },
    { date: '2025-09-13', value: 2.8, flag: 'normal' }
  ],
  'blood_lipids.hdl_c': [
    { date: '2025-06-01', value: 1.2, flag: 'normal' },
    { date: '2025-07-10', value: 1.1, flag: 'low' },
    { date: '2025-08-08', value: 1.0, flag: 'low' },
    { date: '2025-09-13', value: 1.1, flag: 'low' }
  ],
  'blood_lipids.tg': [
    { date: '2025-06-01', value: 1.2, flag: 'normal' },
    { date: '2025-07-10', value: 1.5, flag: 'high' },
    { date: '2025-08-08', value: 1.4, flag: 'high' },
    { date: '2025-09-13', value: 1.3, flag: 'normal' }
  ],
  'blood_pressure.systolic': [
    { date: '2025-06-01', value: 118, flag: 'normal' },
    { date: '2025-07-10', value: 125, flag: 'high' },
    { date: '2025-08-08', value: 130, flag: 'high' },
    { date: '2025-09-13', value: 122, flag: 'normal' }
  ],
  'blood_pressure.diastolic': [
    { date: '2025-06-01', value: 75, flag: 'normal' },
    { date: '2025-07-10', value: 82, flag: 'high' },
    { date: '2025-08-08', value: 85, flag: 'high' },
    { date: '2025-09-13', value: 78, flag: 'normal' }
  ]
}

const rangeOptions = ['30d', '90d', '1y'] as const

type Range = (typeof rangeOptions)[number]

export default function AnalyticsPage() {
  const t = useTranslations('dashboard.analytics')
  const [series, setSeries] = useState<TrendSeries | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [range, setRange] = useState<Range>('90d')

  const loadTrends = useCallback(async (selectedRange: Range) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/analytics/series?range=${selectedRange}`)
      if (!response.ok) {
        setSeries(mockSeries)
        return
      }
      const payload = (await response.json()) as { series: TrendSeries }
      setSeries(payload.series)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setSeries(mockSeries)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadTrends(range)
  }, [loadTrends, range])

  const glucose = series?.['blood_glucose.fpg'] ?? mockSeries['blood_glucose.fpg']
  const lipids = useMemo(
    () =>
      ['blood_lipids.tc', 'blood_lipids.tg', 'blood_lipids.ldl_c', 'blood_lipids.hdl_c'].map((key) => ({
        key,
        data: series?.[key] ?? mockSeries[key as keyof typeof mockSeries]
      })),
    [series]
  )
  const pressures = useMemo(
    () =>
      ['blood_pressure.systolic', 'blood_pressure.diastolic'].map((key) => ({
        key,
        data: series?.[key] ?? mockSeries[key as keyof typeof mockSeries]
      })),
    [series]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="inline-flex h-10 items-center rounded-md border border-input bg-background px-3 text-sm"
            value={range}
            onChange={(event) => setRange(event.target.value as Range)}
          >
            {rangeOptions.map((value) => (
              <option key={value} value={value}>
                {t(`range.${value}`)}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm" onClick={() => loadTrends(range)} disabled={loading}>
            {t('reload')}
          </Button>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{t('error', { message: error })}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>{t('charts.glucose.title')}</CardTitle>
            <CardDescription>{t('charts.glucose.description')}</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={glucose} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('charts.lipids.title')}</CardTitle>
            <CardDescription>{t('charts.lipids.description')}</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} type="category" allowDuplicatedCategory={false} />
                <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                {lipids.map(({ key, data }) => (
                  <Line key={key} type="monotone" data={data} dataKey="value" name={key.split('.').pop()} strokeWidth={2} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('charts.bloodPressure.title')}</CardTitle>
            <CardDescription>{t('charts.bloodPressure.description')}</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="pressureHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pressureLow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} type="category" allowDuplicatedCategory={false} />
                <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                {pressures.map(({ key, data }) => (
                  <Area
                    key={key}
                    type="monotone"
                    data={data}
                    dataKey="value"
                    name={key.endsWith('systolic') ? 'SBP' : 'DBP'}
                    stroke={key.endsWith('systolic') ? '#ef4444' : '#3b82f6'}
                    fillOpacity={0.3}
                    fill={key.endsWith('systolic') ? 'url(#pressureHigh)' : 'url(#pressureLow)'}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
