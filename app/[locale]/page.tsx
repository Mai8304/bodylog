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
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function LandingPage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
  const supabase = createSupabaseServerClient()
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
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <Link href={`/${params.locale}`} className="text-base font-semibold text-foreground">
            BodyLog
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">
              {t('nav.features')}
            </a>
            <a href="#how" className="hover:text-foreground">
              {t('nav.how')}
            </a>
            <a href="#security" className="hover:text-foreground">
              {t('nav.security')}
            </a>
            <a href="#faq" className="hover:text-foreground">
              {t('nav.faq')}
            </a>
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/${params.locale}/auth/login`}>{t('cta.secondary')}</Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-to-r from-[#146EF5] to-[#12B886] text-white shadow-md">
              <Link href={`/${params.locale}/auth/register`}>{t('cta.primary')}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-16 text-slate-100 md:py-24">
        <div className="absolute inset-0 -z-10 bg-[#0B1220]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_20%_-10%,rgba(20,110,245,0.35),transparent_55%),radial-gradient(50%_50%_at_80%_0%,rgba(13,148,136,0.35),transparent_60%)]" />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-2">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-balance text-3xl font-semibold leading-tight md:text-5xl">{t('hero.title')}</h1>
            <p className="text-pretty text-slate-300 md:text-lg">{t('hero.subtitle')}</p>
            <div className="flex flex-col items-center gap-3 md:flex-row md:justify-start">
              <Button
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-[#146EF5] to-[#12B886] text-white shadow-lg shadow-[#146EF5]/30 transition hover:shadow-xl md:w-auto"
              >
                <Link href={`/${params.locale}/auth/register`}>{t('cta.primary')}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20 md:w-auto"
              >
                <Link href={`/${params.locale}/auth/login`}>{t('cta.secondary')}</Link>
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <BadgeLike icon={<Lock className="h-4 w-4" />} label={t('badges.private')} />
              <BadgeLike icon={<Shield className="h-4 w-4" />} label={t('badges.secure')} />
              <BadgeLike icon={<Brain className="h-4 w-4" />} label={t('badges.disclaimer')} />
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_30px_80px_-40px_rgba(20,110,245,0.7)] backdrop-blur">
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <FileUp className="h-4 w-4" />
                <span>report.pdf</span>
                <span className="ml-auto text-xs text-slate-300">20 MB</span>
              </div>
              <Separator className="my-4 border-white/10" />
              <div className="grid gap-3 md:grid-cols-2">
                <PreviewMetric title="GLU (FPG)" value="6.1" unit="mmol/L" flag="high" />
                <PreviewMetric title="LDL-C" value="2.8" unit="mmol/L" flag="normal" />
                <PreviewMetric title="SBP" value="125" unit="mmHg" flag="high" />
                <PreviewMetric title="DBP" value="78" unit="mmHg" flag="normal" />
              </div>
              <Separator className="my-4 border-white/10" />
              <div className="space-y-2 text-sm text-slate-300">
                <p className="font-medium text-slate-100">AI</p>
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
      <section id="how" className="px-6 py-14">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="mb-6 text-center text-2xl font-semibold md:text-3xl">{t('how.title')}</h2>
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
          <h2 className="mb-6 text-center text-2xl font-semibold md:text-3xl">{t('features.title')}</h2>
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
              <Card key={index} className="border border-[#E5EAF0] bg-white shadow-sm">
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

      {/* CTA Banner */}
      <section className="px-6 pb-16">
        <div className="mx-auto w-full max-w-5xl rounded-2xl border bg-gradient-to-r from-[#EEF4FF] to-[#E9F9F4] p-8 text-center shadow-sm">
          <h3 className="text-xl font-semibold md:text-2xl">{t('value.title')}</h3>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 md:flex-row">
            <Button asChild size="lg" className="bg-gradient-to-r from-[#146EF5] to-[#12B886] text-white shadow-lg shadow-[#146EF5]/20">
              <Link href={`/${params.locale}/auth/register`}>{t('cta.primary')}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-[#146EF5]/40 text-[#146EF5]">
              <Link href={`/${params.locale}/auth/login`}>{t('cta.secondary')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} BodyLog</span>
          <div className="flex items-center gap-4">
            <a className="hover:text-foreground" href="#">
              {t('footer.privacy')}
            </a>
            <a className="hover:text-foreground" href="#">
              {t('footer.terms')}
            </a>
            <a className="hover:text-foreground" href="mailto:support@bodylog.ai">
              {t('footer.contact')}
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}

function BadgeLike({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs text-white/90 backdrop-blur">
      {icon}
      {label}
    </span>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="border border-[#E5EAF0] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0">
        <div className="rounded-md bg-[#EEF4FF] p-2 text-[#146EF5]">{icon}</div>
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
      ? 'bg-[#FEE2E2] text-[#B91C1C]'
      : flag === 'low'
        ? 'bg-[#FEF3C7] text-[#B45309]'
        : flag === 'normal'
          ? 'bg-[#DCFCE7] text-[#047857]'
          : 'bg-white/10 text-white/80'

  const flagLabel = flag === 'high' ? 'HIGH' : flag === 'low' ? 'LOW' : flag === 'normal' ? 'OK' : String(flag).toUpperCase()

  return (
    <div className="flex items-center justify-between rounded-lg border border-white/15 bg-white/5 p-3 text-slate-100">
      <div>
        <p className="text-sm font-medium">{title}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold">
          {value} {unit}
        </p>
        <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs ${flagClass}`}>{flagLabel}</span>
      </div>
    </div>
  )
}

function StepCard({ step, title, desc }: { step: number; title: string; desc: string }) {
  return (
    <Card className="border border-[#E5EAF0] bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">
          <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#EEF4FF] text-xs text-[#146EF5]">
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
    <div className="flex items-center gap-3 rounded-xl border border-[#E5EAF0] bg-white p-4 shadow-sm">
      <div className="rounded-md bg-[#EEF4FF] p-2 text-[#146EF5]">{icon}</div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
