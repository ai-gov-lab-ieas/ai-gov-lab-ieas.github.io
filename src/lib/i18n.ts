import { DEFAULT_LOCALE, SITE_URL, type Locale } from '../config';

export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return locale === DEFAULT_LOCALE ? clean : `/en${clean}`;
}

export function absoluteUrl(locale: Locale, path: string): string {
  return SITE_URL + localePath(locale, path);
}

export function alternateLocale(locale: Locale): Locale {
  return locale === 'zh' ? 'en' : 'zh';
}
