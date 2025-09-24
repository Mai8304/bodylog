'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Mail, Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

interface LoginValues {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('auth.login')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const loginSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t('errors.email')),
        password: z.string().min(6, t('errors.password'))
      }),
    [t]
  )

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })

  async function onSubmit(values: LoginValues) {
    setErrorMessage(null)
    setLoading(true)

    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithPassword(values)

    setLoading(false)
    if (error) {
      setErrorMessage(error.message ?? t('alert.generic'))
      return
    }

    router.push(`/${locale}/dashboard`)
  }

  async function handleGoogleLogin() {
    setErrorMessage(null)
    setLoading(true)

    const supabase = createSupabaseBrowserClient()
    const redirectTo = `${window.location.origin}/api/auth/callback?locale=${locale}`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo
      }
    })

    if (error) {
      setErrorMessage(error.message ?? t('alert.generic'))
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-left">
        <h2 className="text-xl font-semibold">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('emailLabel')}</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('passwordLabel')}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••" autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
            {t('submit')}
          </Button>
        </form>
      </Form>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="h-px w-full bg-border" />
        <span>{t('or')}</span>
        <span className="h-px w-full bg-border" />
      </div>

      <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shield className="mr-2 h-4 w-4" />}
        {t('google')}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t('noAccount')}{' '}
        <Link href={`/${locale}/auth/register`} className="font-medium text-primary hover:underline">
          {t('registerLink')}
        </Link>
      </p>
    </div>
  )
}
