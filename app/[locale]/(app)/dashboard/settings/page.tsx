'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const languages = ['zh', 'en', 'ja'] as const
const unitOptions = ['metric', 'imperial'] as const

export default function SettingsPage() {
  const locale = useLocale()
  const t = useTranslations('dashboard.settings')
  const localeNames = useTranslations('header.localeName')
  const [language, setLanguage] = useState(locale)
  const [unit, setUnit] = useState<typeof unitOptions[number]>('metric')
  const [message, setMessage] = useState<string | null>(null)

  const unitLabels = useMemo(
    () => ({
      metric: t('metric'),
      imperial: t('imperial')
    }),
    [t]
  )

  function handleSave() {
    setMessage(t('saved'))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      {message ? (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('languageTitle')}</CardTitle>
            <CardDescription>{t('languageDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 md:grid-cols-3">
              {languages.map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant={language === value ? 'default' : 'outline'}
                  onClick={() => setLanguage(value)}
                >
                  {localeNames(value)}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">{t('unitTitle')}</p>
              <div className="flex gap-2">
                {unitOptions.map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant={unit === value ? 'default' : 'outline'}
                    onClick={() => setUnit(value)}
                  >
                    {unitLabels[value]}
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={handleSave}>{t('save')}</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('exportTitle')}</CardTitle>
            <CardDescription>{t('exportDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <Button variant="outline" size="sm" disabled>
              {t('exportButton')}
            </Button>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">{t('deleteTitle')}</p>
              <p>{t('deleteDescription')}</p>
              <Input disabled value="support@bodylog.ai" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
