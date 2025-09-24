'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CloudUpload, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ALLOWED_UPLOAD_MIME_TYPES, MAX_UPLOAD_SIZE_BYTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

interface UploadValues {
  file: File | null
  collectedAt?: string
}

export default function UploadPage() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('dashboard.upload')
  const [status, setStatus] = useState<'idle' | 'uploading' | 'queued' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const uploadSchema = useMemo(
    () =>
      z.object({
        file: z
          .instanceof(File, { message: t('errors.type') })
          .or(z.null().refine((value) => value !== null, t('errors.type'))),
        collectedAt: z.string().optional()
      }),
    [t]
  )

  const form = useForm<UploadValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: { collectedAt: new Date().toISOString().slice(0, 10), file: null }
  })

  const tips = t.raw<string[]>('tips') ?? []

  function resetStatusIndicators() {
    setStatus('idle')
    setStatusMessage(null)
    setProgress(0)
  }

  async function onSubmit(values: UploadValues) {
    const file = values.file
    if (!(file instanceof File)) {
      setStatus('error')
      setStatusMessage(t('errors.type'))
      return
    }

    if (!ALLOWED_UPLOAD_MIME_TYPES.includes(file.type)) {
      setStatus('error')
      setStatusMessage(t('errors.type'))
      return
    }
    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      setStatus('error')
      setStatusMessage(t('errors.size'))
      return
    }

    const supabase = createSupabaseBrowserClient()
    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (!session?.user) {
      setStatus('error')
      setStatusMessage(t('errors.auth'))
      router.push(`/${locale}/auth/login`)
      return
    }

    setStatus('uploading')
    setStatusMessage(t('status.uploading'))
    setProgress(10)

    const ext = file.name.split('.').pop() ?? 'dat'
    const objectPath = `${session.user.id}/${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabase.storage.from('reports').upload(objectPath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    })

    if (uploadError) {
      setStatus('error')
      setStatusMessage(`${t('status.error')} ${uploadError.message}`)
      return
    }

    setProgress(60)
    setStatusMessage(t('status.uploading'))

    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: objectPath,
        mime: file.type,
        size: file.size,
        collected_at: values.collectedAt ? new Date(values.collectedAt).toISOString() : null
      })
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}))
      setStatus('error')
      setStatusMessage(t('errors.create', { message: payload.message ?? response.statusText }))
      return
    }

    const payload = (await response.json().catch(() => ({}))) as { report_id?: string; message?: string }

    setProgress(100)
    setStatus('queued')
    setStatusMessage(payload.message ?? t('status.queued'))

    setTimeout(() => {
      router.push(`/${locale}/dashboard/reports`)
    }, 1200)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t('formTitle')}</CardTitle>
            <CardDescription>{t('formDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => {
                    const handleSelect = (file: File | null) => {
                      field.onChange(file)
                      form.clearErrors('file')
                      resetStatusIndicators()
                    }

                    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
                      event.preventDefault()
                      event.stopPropagation()
                      setIsDragging(false)
                      const file = event.dataTransfer.files?.[0] ?? null
                      handleSelect(file)
                    }

                    return (
                      <FormItem>
                        <FormLabel>{t('form.fileLabel')}</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div
                              role="button"
                              tabIndex={0}
                              className={cn(
                                'flex flex-col items-center justify-center rounded-md border border-dashed p-6 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                                isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/40 hover:border-primary'
                              )}
                              onClick={() => fileInputRef.current?.click()}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault()
                                  fileInputRef.current?.click()
                                }
                              }}
                              onDragEnter={(event) => {
                                event.preventDefault()
                                event.stopPropagation()
                                setIsDragging(true)
                              }}
                              onDragOver={(event) => {
                                event.preventDefault()
                                event.stopPropagation()
                                setIsDragging(true)
                              }}
                              onDragLeave={(event) => {
                                event.preventDefault()
                                event.stopPropagation()
                                setIsDragging(false)
                              }}
                              onDrop={handleDrop}
                            >
                              <p className="text-sm font-medium text-foreground">{t('form.dropHint')}</p>
                              <p className="mt-2 text-xs text-muted-foreground">
                                {field.value instanceof File
                                  ? t('form.selected', { name: field.value.name })
                                  : t('form.noFile')}
                              </p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={(event) => {
                                  event.preventDefault()
                                  event.stopPropagation()
                                  fileInputRef.current?.click()
                                }}
                              >
                                {t('form.choose')}
                              </Button>
                            </div>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept={ALLOWED_UPLOAD_MIME_TYPES.join(',')}
                              className="hidden"
                              onChange={(event) => {
                                const file = event.target.files?.[0] ?? null
                                handleSelect(file)
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />

                <FormField
                  control={form.control}
                  name="collectedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.dateLabel')}</FormLabel>
                      <FormControl>
                        <Input type="date" max={new Date().toISOString().slice(0, 10)} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={status === 'uploading'}>
                  {status === 'uploading' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CloudUpload className="mr-2 h-4 w-4" />}
                  {t('form.submit')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>{t('statusTitle')}</CardTitle>
            <CardDescription>{t('statusDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} />
            <Alert variant={status === 'error' ? 'destructive' : 'default'}>
              <AlertTitle>
                {status === 'idle' && t('status.idle')}
                {status === 'uploading' && t('status.uploading')}
                {status === 'queued' && t('status.queued')}
                {status === 'error' && t('status.error')}
              </AlertTitle>
              <AlertDescription>{statusMessage ?? t('status.idle')}</AlertDescription>
            </Alert>
            <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
              {tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
