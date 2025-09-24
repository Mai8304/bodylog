import {getRequestConfig} from 'next-intl/server'

const supportedLocales = ['zh', 'en', 'ja'] as const

export default getRequestConfig(async ({locale}) => {
  const resolvedLocale = supportedLocales.includes(locale as any) ? locale : 'zh'
  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default
  }
})
