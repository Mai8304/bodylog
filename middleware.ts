import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['zh', 'en', 'ja'],
  defaultLocale: 'zh'
})

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
