import {getRequestConfig} from 'next-intl/server';

const supportedLocales = ['zh', 'en', 'ja'] as const;
type SupportedLocale = typeof supportedLocales[number];

function isValidLocale(locale: any): locale is SupportedLocale {
  return supportedLocales.includes(locale);
}

export default getRequestConfig(async ({locale}) => {
  const finalLocale = isValidLocale(locale) ? locale : 'zh';

  return {
    locale: finalLocale,
    messages: (await import(`../messages/${finalLocale}.json`)).default
  };
});