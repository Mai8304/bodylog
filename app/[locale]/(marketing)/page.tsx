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
  CheckCircle2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

  const heroHighlights = [
    {
      icon: <FileUp className="h-4 w-4" />,
      title: t('value.items.upload.title'),
      desc: t('value.items.upload.desc')
    },
    {
      icon: <Brain className="h-4 w-4" />,
      title: t('value.items.ai.title'),
      desc: t('value.items.ai.desc')
    },
    {
      icon: <LineChart className="h-4 w-4" />,
      title: t('value.items.trend.title'),
      desc: t('value.items.trend.desc')
    }
  ]

  const featureTiles = [
    {
      icon: <CheckCircle2 className="h-5 w-5" />,
      title: t('features.items.ocrFree.title'),
      desc: t('features.items.ocrFree.desc')
    },
    {
      icon: <FileSpreadsheet className="h-5 w-5" />,
      title: t('features.items.multimodal.title'),
      desc: t('features.items.multimodal.desc')
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: t('features.items.privacy.title'),
      desc: t('features.items.privacy.desc')
    },
    {
      icon: <LineChart className="h-5 w-5" />,
      title: t('features.items.trendCharts.title'),
      desc: t('features.items.trendCharts.desc')
    },
    {
      icon: <Languages className="h-5 w-5" />,
      title: t('features.items.multilang.title'),
      desc: t('features.items.multilang.desc')
    },
    {
      icon: <FileSpreadsheet className="h-5 w-5" />,
      title: t('features.items.exportLater.title'),
      desc: t('features.items.exportLater.desc')
    }
  ]

  const howSteps = [
    { title: t('how.steps.upload.title'), desc: t('how.steps.upload.desc') },
    { title: t('how.steps.extract.title'), desc: t('how.steps.extract.desc') },
    { title: t('how.steps.insight.title'), desc: t('how.steps.insight.desc') },
    { title: t('how.steps.history.title'), desc: t('how.steps.history.desc') }
  ]

  const trustItems = [
    { icon: <Lock className="h-5 w-5" />, text: t('trust.items.storage') },
    { icon: <Shield className="h-5 w-5" />, text: t('trust.items.rls') },
    { icon: <FileSpreadsheet className="h-5 w-5" />, text: t('trust.items.exportDelete') },
    { icon: <Brain className="h-5 w-5" />, text: t('trust.items.aiDisclaimer') }
  ]

  return (
    <main className="relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 -top-52 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(56,_189,_248,_0.25),_transparent_60%)]" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(129,_140,_248,_0.22),_transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute -right-24 top-2/3 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(96,_165,_250,_0.18),_transparent_70%)] blur-2xl" />

      <section className="relative px-6 pb-20 pt-24 sm:pb-24 sm:pt-28">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-8 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-medium text-primary-foreground shadow-sm shadow-primary/10 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {t('badges.secure')}
              <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
              {t('badges.private')}
            </span>
            <h1 className="text-balance text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="mx-auto max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg lg:mx-0">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="w-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
              >
                <Link href={`/${params.locale}/auth/register`} className="inline-flex items-center gap-2">
                  {t('cta.primary')}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full border-border/60 bg-background/60 backdrop-blur sm:w-auto"
              >
                <Link href={`/${params.locale}/auth/login`}>{t('cta.secondary')}</Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {heroHighlights.map((item, index) => (
                <StatHighlight key={index} icon={item.icon} title={item.title} desc={item.desc} />
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground lg:justify-start">
              <BadgeLike icon={<Lock className="h-3.5 w-3.5" />} label={t('badges.private')} />
              <BadgeLike icon={<Shield className="h-3.5 w-3.5" />} label={t('badges.secure')} />
              <BadgeLike icon={<Brain className="h-3.5 w-3.5" />} label={t('badges.disclaimer')} />
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/5 p-6 shadow-2xl ring-1 ring-inset ring-white/10 backdrop-blur">
              <GradientGlow />
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <FileUp className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">report.pdf</p>
                  <p className="text-xs text-muted-foreground">{t('value.items.upload.desc')}</p>
                </div>
                <span className="text-xs">20 MB</span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <PreviewMetric title="GLU (FPG)" value="6.1" unit="mmol/L" flag="high" />
                <PreviewMetric title="LDL-C" value="2.8" unit="mmol/L" flag="normal" />
                <PreviewMetric title="SBP" value="125" unit="mmHg" flag="high" />
                <PreviewMetric title="DBP" value="78" unit="mmHg" flag="normal" />
              </div>
              <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm shadow-inner shadow-primary/10">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-primary">AI</p>
                <ul className="space-y-2 text-foreground opacity-90">
                  <li>• 建议 1：控制精制糖摄入，1 周后复测空腹血糖。</li>
                  <li>• 建议 2：每周 3 次有氧运动，每次 30 分钟。</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative px-6 py-20">
        <div className="mx-auto w-full max-w-6xl space-y-10">
          <div className="flex flex-col items-start gap-6 text-left sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">{t('value.title')}</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">{t('hero.subtitle')}</p>
            </div>
            <Button asChild variant="ghost" className="group inline-flex items-center gap-2 px-0 text-primary">
              <Link href={`/${params.locale}/auth/register`}>
                {t('cta.primary')}
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {heroHighlights.map((item, index) => (
              <FeatureTile key={index} icon={item.icon} title={item.title} desc={item.desc} highlight={index === 0} />
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="relative bg-muted/40 px-6 py-20">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-foreground sm:text-4xl">{t('how.title')}</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {howSteps.map((step, index) => (
              <TimelineStep key={step.title} index={index} total={howSteps.length} title={step.title} desc={step.desc} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 py-20">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-foreground sm:text-4xl">{t('features.title')}</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {featureTiles.map((item, index) => (
              <FeatureTile key={index} icon={item.icon} title={item.title} desc={item.desc} />
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="relative px-6 py-20">
        <div className="mx-auto w-full max-w-6xl rounded-3xl border border-border/60 bg-muted/30 p-8 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">{t('trust.title')}</h2>
              <p className="mt-3 max-w-xl text-muted-foreground">{t('trust.subtitle')}</p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {trustItems.map((item, index) => (
              <TrustItem key={index} icon={item.icon} text={item.text} />
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="relative px-6 py-20">
        <div className="mx-auto w-full max-w-3xl space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">{t('faq.title')}</h2>
            <p className="mt-3 text-muted-foreground">{t('badges.disclaimer')}</p>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="border border-border/60 bg-card bg-opacity-90 shadow-md backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-base font-medium text-foreground">{t(`faq.items.${index}.q`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground">{t(`faq.items.${index}.a`)}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 pb-28">
        <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-primary/20 bg-primary/10 p-10 text-center shadow-xl backdrop-blur">
          <div className="mx-auto max-w-2xl space-y-4">
            <h3 className="text-2xl font-semibold text-foreground sm:text-3xl">{t('hero.title')}</h3>
            <p className="text-muted-foreground">{t('hero.subtitle')}</p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="w-full bg-primary text-primary-foreground shadow-md shadow-primary/30 hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
              >
                <Link href={`/${params.locale}/auth/register`}>{t('cta.primary')}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full border-primary/30 bg-background/60 backdrop-blur sm:w-auto">
                <Link href={`/${params.locale}/auth/login`}>{t('cta.secondary')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function BadgeLike({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-background/70 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur">
      {icon}
      {label}
    </span>
  )
}

function StatHighlight({
  icon,
  title,
  desc
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/70 p-4 text-left shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </div>
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
  const badgeStyles =
    flag === 'high'
      ? 'bg-destructive/15 text-destructive'
      : flag === 'low'
        ? 'bg-secondary/20 text-secondary-foreground'
        : flag === 'normal'
          ? 'bg-emerald-500/15 text-emerald-600'
          : 'bg-muted/40 text-muted-foreground'

  const flagLabel = flag === 'high' ? 'HIGH' : flag === 'low' ? 'LOW' : flag === 'normal' ? 'OK' : String(flag).toUpperCase()

  return (
    <div className="rounded-2xl border border-white/10 bg-white/8 p-4 text-sm shadow-sm backdrop-blur">
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium text-foreground opacity-90">{title}</p>
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${badgeStyles}`}>{flagLabel}</span>
      </div>
      <p className="mt-3 text-xl font-semibold text-foreground">
        {value} <span className="text-xs font-normal text-muted-foreground">{unit}</span>
      </p>
    </div>
  )
}

function FeatureTile({
  icon,
  title,
  desc,
  highlight
}: {
  icon: React.ReactNode
  title: string
  desc: string
  highlight?: boolean
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border bg-background/80 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl ${highlight ? 'border-primary/40 bg-primary/5' : 'border-border/60'}`}
    >
      <div className={`mb-6 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${highlight ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
        {icon}
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      <span className="mt-5 inline-flex items-center gap-1 text-xs text-primary/80">
        {title}
        <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
      </span>
    </div>
  )
}

function TimelineStep({
  index,
  total,
  title,
  desc
}: {
  index: number
  total: number
  title: string
  desc: string
}) {
  const stepNumber = index + 1
  const isLast = stepNumber === total

  return (
    <div className="relative rounded-3xl border border-border/60 bg-background p-6 shadow-sm backdrop-blur">
      <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {stepNumber}
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      {!isLast && <span className="absolute -right-3 top-1/2 hidden h-px w-6 bg-border sm:block" />}
    </div>
  )
}

function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
      <div className="rounded-xl bg-primary/10 p-2 text-primary">{icon}</div>
      <p className="text-sm text-foreground opacity-90">{text}</p>
    </div>
  )
}

function GradientGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-x-6 top-6 h-32 rounded-full bg-[radial-gradient(circle,_rgba(59,_130,_246,_0.25),_transparent_70%)] blur-3xl" />
    </div>
  )
}
