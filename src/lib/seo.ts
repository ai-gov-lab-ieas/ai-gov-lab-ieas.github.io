import { SITE_URL, type Locale } from '../config';
import { absoluteUrl } from './i18n';
import type { Event } from '../data/events/types';
import type { Member } from '../data/members';
import { resolveSpeaker } from './render';

const ORG_NAME = { zh: 'AI 治理觀念實驗室', en: 'AI Governance Laboratory' } as const;
const IEAS_NAME = {
  zh: '中央研究院歐美研究所',
  en: 'Institute of European and American Studies, Academia Sinica',
} as const;

// Institutional suffix used on every EN sub-page <title>.
// Matches the pre-existing EN homepage title in src/data/content.ts.
// If either the ORG name, IEAS name, or Academia Sinica affiliation changes,
// update BOTH this constant AND the literal in content.ts.
export const SITE_SUFFIX_EN = 'AI Governance Laboratory, IEAS, Academia Sinica';

// Bilingual brand form used only by og:site_name on EN pages
// and by the 404 page's <title> (404 is one file for all visitors,
// noindex, so mixing scripts here is safe).
export const SITE_NAME_BILINGUAL_EN = 'AI Governance Laboratory | AI 治理觀念實驗室';

function toAbsolute(url: string): string {
  return url.startsWith('http') ? url : SITE_URL + url;
}

export function metaDescription(text: string, max = 155): string {
  const clean = text
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/^##+\s+/gm, '')
    .replace(/^-\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ') > 60 ? cut.lastIndexOf(' ') : max - 1) + '…';
}

// Optional hand-tuned SEO overrides for a single event or member page.
// Every field is optional; absent fields fall back to the derived value,
// so a new event/member still requires only its data file.
export interface SeoOverride {
  title_zh?: string;        // page-name part only — the brand suffix is still appended
  title_en?: string;
  description_zh?: string;  // replaces metaDescription(content/bio) in the meta description, JSON-LD, and Atom <summary>
  description_en?: string;
  ogImageAlt_zh?: string;
  ogImageAlt_en?: string;
}

export function resolvePageSeo(args: {
  seo?: SeoOverride;
  locale: Locale;
  fallbackTitle: string;
  fallbackDescription: string;
  fallbackOgImageAlt: string;
}): { title: string; description: string; ogImageAlt: string } {
  const { seo, locale, fallbackTitle, fallbackDescription, fallbackOgImageAlt } = args;
  const zh = locale === 'zh';
  return {
    title: (zh ? seo?.title_zh : seo?.title_en) ?? fallbackTitle,
    description: (zh ? seo?.description_zh : seo?.description_en) ?? fallbackDescription,
    ogImageAlt: (zh ? seo?.ogImageAlt_zh : seo?.ogImageAlt_en) ?? fallbackOgImageAlt,
  };
}

export function eventDescription(event: Event, locale: Locale, max: number): string {
  const override = locale === 'zh' ? event.seo?.description_zh : event.seo?.description_en;
  if (override) return override;
  return metaDescription(locale === 'zh' ? event.content_zh : event.content_en, max);
}

export function organizationLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: ORG_NAME[locale],
    alternateName: locale === 'zh' ? ORG_NAME.en : ORG_NAME.zh,
    url: `${SITE_URL}/`,
    parentOrganization: {
      '@type': 'Organization',
      name: IEAS_NAME[locale],
      url: 'https://www.ea.sinica.edu.tw/',
    },
  };
}

export function personLd(member: Member, locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: locale === 'zh' ? member.name_zh : member.name_en,
    alternateName: locale === 'zh' ? member.name_en : member.name_zh,
    jobTitle: locale === 'zh' ? member.role_zh : member.role_en,
    description: (locale === 'zh' ? member.seo?.description_zh : member.seo?.description_en) ?? (locale === 'zh' ? member.bio_zh : member.bio_en),
    image: toAbsolute(member.image),
    url: absoluteUrl(locale, `/people/${member.slug}/`),
    sameAs: [member.url],
    affiliation: { '@type': 'Organization', name: IEAS_NAME[locale], url: 'https://www.ea.sinica.edu.tw/' },
  };
}

export function eventLd(event: Event, locale: Locale) {
  const performer = (event.speakers ?? []).map((s) => {
    const r = resolveSpeaker(s, locale);
    if (r.kind === 'member') {
      return { '@type': 'Person', name: r.name, url: r.url };
    }
    return {
      '@type': 'Person',
      name: r.name,
      ...(r.affiliation ? { affiliation: { '@type': 'Organization', name: r.affiliation } } : {}),
    };
  });

  const locationName =
    (locale === 'zh' ? event.location_zh : event.location_en) ?? IEAS_NAME[locale];

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: locale === 'zh' ? event.title_zh : event.title_en,
    startDate: event.date,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: toAbsolute(event.image),
    description: eventDescription(event, locale, 300),
    inLanguage: locale === 'zh' ? 'zh-Hant' : 'en',
    url: absoluteUrl(locale, `/event/${event.id}/`),
    location: {
      '@type': 'Place',
      name: locationName,
      address: {
        '@type': 'PostalAddress',
        addressLocality: locale === 'zh' ? '台北' : 'Taipei',
        addressCountry: 'TW',
      },
    },
    organizer: { '@type': 'Organization', name: ORG_NAME[locale], url: `${SITE_URL}/` },
    ...(performer.length ? { performer } : {}),
  };
}

export function breadcrumbLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
