"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  const tAuth = useTranslations("auth.login")
  const tCta = useTranslations("landing.cta")
  const tValue = useTranslations("landing.value")

  return (
    <section className="px-6 pb-16">
      <div className="mx-auto w-full max-w-5xl rounded-2xl border bg-gradient-to-r from-secondary to-accent p-8 text-center shadow-sm">
        <h3 className="text-xl font-semibold text-foreground md:text-2xl">{tValue("title")}</h3>
        <form
          className="mt-4 flex flex-col items-center justify-center gap-3 md:flex-row"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <Input className="w-full md:w-80" type="email" placeholder={tAuth("emailLabel") as string} />
          <Button type="submit" className="bg-primary text-primary-foreground">
            {tCta("primary")}
          </Button>
        </form>
      </div>
    </section>
  )
}

