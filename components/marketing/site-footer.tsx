import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"

export function SiteFooter() {
  const locale = useLocale()
  const t = useTranslations("landing.footer")
  return (
    <footer className="border-t px-6 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
        <span>© {new Date().getFullYear()} BodyLog</span>
        <div className="flex items-center gap-4">
          <Link className="hover:text-foreground" href={`/${locale}#privacy`}>
            {t("privacy")}
          </Link>
          <Link className="hover:text-foreground" href={`/${locale}#terms`}>
            {t("terms")}
          </Link>
          <a className="hover:text-foreground" href="mailto:support@bodylog.ai">
            {t("contact")}
          </a>
        </div>
      </div>
    </footer>
  )
}

