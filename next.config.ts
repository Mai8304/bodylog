import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: import('next').NextConfig = {
  /* config options here */
}

export default withNextIntl(nextConfig)
