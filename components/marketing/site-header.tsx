"use client"

import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/layout/language-switcher"

export function SiteHeader() {
  const locale = useLocale()
  const t = useTranslations("landing.nav")

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
        <Link href={`/${locale}`} className="text-base font-semibold text-foreground">
          BodyLog
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">
            {t("features")}
          </a>
          <a href="#how" className="hover:text-foreground">
            {t("how")}
          </a>
          <a href="#security" className="hover:text-foreground">
            {t("security")}
          </a>
          <a href="#faq" className="hover:text-foreground">
            {t("faq")}
          </a>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <Button asChild variant="ghost" size="sm">
            <Link href={`/${locale}/auth/login`}>{/* use landing.cta.secondary */}{useTranslations("landing.cta")("secondary")}</Link>
          </Button>
          <Button asChild size="sm" className="bg-primary text-primary-foreground shadow-md">
            <Link href={`/${locale}/auth/register`}>{useTranslations("landing.cta")("primary")}</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

