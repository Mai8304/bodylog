import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import {
  Shield,
  Lock,
  FileUp,
  LineChart,
  Brain,
  Languages,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { createSupabaseRSCClient } from '@/lib/supabase/server'

export default async function LandingPage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
  const supabase = createSupabaseRSCClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()

  const params = await paramsPromise

  if (session) {
    redirect(`/${params.locale}/dashboard`)
  }

  const t = await getTranslations({ locale: params.locale, namespace: 'landing' })

  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-16 md:py-24">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-2">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-balance text-3xl font-semibold leading-tight text-foreground md:text-5xl">{t('hero.title')}</h1>
            <p className="text-pretty text-muted-foreground md:text-lg">{t('hero.subtitle')}</p>
            <div className="flex flex-col items-center gap-3 md:flex-row md:justify-start">
              <Button
                asChild
                size="lg"
                className="w-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition hover:shadow-xl md:w-auto"
              >
                <Link href={`/${params.locale}/auth/register`}>{t('cta.primary')}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full md:w-auto">
                <Link href={`/${params.locale}/auth/login`}>{t('cta.secondary')}</Link>
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <BadgeLike icon={<Lock className="h-4 w-4" />} label={t('badges.private')} />
              <BadgeLike icon={<Shield className="h-4 w-4" />} label={t('badges.secure')} />
              <BadgeLike icon={<Brain className="h-4 w-4" />} label={t('badges.disclaimer')} />
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-md">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileUp className="h-4 w-4" />
                <span>report.pdf</span>
                <span className="ml-auto text-xs">20 MB</span>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3 md:grid-cols-2">
                <PreviewMetric title="GLU (FPG)" value="6.1" unit="mmol/L" flag="high" />
                <PreviewMetric title="LDL-C" value="2.8" unit="mmol/L" flag="normal" />
                <PreviewMetric title="SBP" value="125" unit="mmHg" flag="high" />
                <PreviewMetric title="DBP" value="78" unit="mmHg" flag="normal" />
              </div>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">AI</p>
                <p>• 建议 1：控制精制糖摄入，1 周后复测空腹血糖。</p>
                <p>• 建议 2：每周 3 次有氧运动，每次 30 分钟。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 卖点三卡 */}
      <section id="features" className="px-6 py-14">
        <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-3">
          <FeatureCard icon={<FileUp className="h-5 w-5" />} title={t('value.items.upload.title')} desc={t('value.items.upload.desc')} />
          <FeatureCard icon={<Brain className="h-5 w-5" />} title={t('value.items.ai.title')} desc={t('value.items.ai.desc')} />
          <FeatureCard icon={<LineChart className="h-5 w-5" />} title={t('value.items.trend.title')} desc={t('value.items.trend.desc')} />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-muted/40 px-6 py-14">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="mb-6 text-center text-2xl font-semibold text-foreground md:text-3xl">{t('how.title')}</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <StepCard step={1} title={t('how.steps.upload.title')} desc={t('how.steps.upload.desc')} />
            <StepCard step={2} title={t('how.steps.extract.title')} desc={t('how.steps.extract.desc')} />
            <StepCard step={3} title={t('how.steps.insight.title')} desc={t('how.steps.insight.desc')} />
            <StepCard step={4} title={t('how.steps.history.title')} desc={t('how.steps.history.desc')} />
          </div>
        </div>
      </section>

      {/* 功能网格 */}
      <section className="px-6 py-14">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="mb-6 text-center text-2xl font-semibold text-foreground md:text-3xl">{t('features.title')}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <FeatureCard icon={<CheckCircle2 className="h-5 w-5" />} title={t('features.items.ocrFree.title')} desc={t('features.items.ocrFree.desc')} />
            <FeatureCard icon={<FileSpreadsheet className="h-5 w-5" />} title={t('features.items.multimodal.title')} desc={t('features.items.multimodal.desc')} />
            <FeatureCard icon={<Shield className="h-5 w-5" />} title={t('features.items.privacy.title')} desc={t('features.items.privacy.desc')} />
            <FeatureCard icon={<LineChart className="h-5 w-5" />} title={t('features.items.trendCharts.title')} desc={t('features.items.trendCharts.desc')} />
            <FeatureCard icon={<Languages className="h-5 w-5" />} title={t('features.items.multilang.title')} desc={t('features.items.multilang.desc')} />
            <FeatureCard icon={<FileSpreadsheet className="h-5 w-5" />} title={t('features.items.exportLater.title')} desc={t('features.items.exportLater.desc')} />
          </div>
        </div>
      </section>

      {/* 可信与安全 */}
      <section id="security" className="px-6 py-14">
        <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-4">
          <TrustItem icon={<Lock className="h-5 w-5" />} text={t('trust.items.storage')} />
          <TrustItem icon={<Shield className="h-5 w-5" />} text={t('trust.items.rls')} />
          <TrustItem icon={<FileSpreadsheet className="h-5 w-5" />} text={t('trust.items.exportDelete')} />
          <TrustItem icon={<Brain className="h-5 w-5" />} text={t('trust.items.aiDisclaimer')} />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-14">
        <div className="mx-auto w-full max-w-3xl">
          <h2 className="mb-6 text-center text-2xl font-semibold md:text-3xl">{t('faq.title')}</h2>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="border border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">{t(`faq.items.${index}.q`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{t(`faq.items.${index}.a`)}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function BadgeLike({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground">
      {icon}
      {label}
    </span>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0">
        <div className="rounded-md bg-secondary p-2 text-secondary-foreground">{icon}</div>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{desc}</CardDescription>
      </CardContent>
    </Card>
  )
}

function PreviewMetric({
  title,
  value,
  unit,
  flag
}: {
  title: string
  value: string
  unit: string
  flag: 'high' | 'normal' | 'low' | string
}) {
  const flagClass =
    flag === 'high'
      ? 'bg-destructive/15 text-destructive'
      : flag === 'low'
        ? 'bg-secondary text-secondary-foreground'
        : flag === 'normal'
          ? 'bg-primary/10 text-primary'
          : 'bg-muted text-muted-foreground'

  const flagLabel = flag === 'high' ? 'HIGH' : flag === 'low' ? 'LOW' : flag === 'normal' ? 'OK' : String(flag).toUpperCase()

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-foreground">
          {value} {unit}
        </p>
        <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs ${flagClass}`}>{flagLabel}</span>
      </div>
    </div>
  )
}

function StepCard({ step, title, desc }: { step: number; title: string; desc: string }) {
  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">
          <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs text-secondary-foreground">
            {step}
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{desc}</CardDescription>
      </CardContent>
    </Card>
  )
}

function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="rounded-md bg-secondary p-2 text-secondary-foreground">{icon}</div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

