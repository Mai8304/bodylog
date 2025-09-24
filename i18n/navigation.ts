
import {createNavigation} from 'next-intl/navigation';

export const locales = ['zh', 'en', 'ja'] as const;

export const {Link, redirect, usePathname, useRouter} =
  createNavigation({locales});
