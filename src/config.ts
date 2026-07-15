export const SITE_URL = 'https://ai-gov-lab-ieas.github.io';
export const LOCALES = ['zh', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'zh';
