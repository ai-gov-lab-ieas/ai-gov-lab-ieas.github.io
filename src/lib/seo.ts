import { SITE_URL, type Locale } from '../config';
import { absoluteUrl } from './i18n';
import type { Event } from '../data/events/types';
import { MEMBERS, type Member } from '../data/members';

const ORG_NAME = { zh: 'AI 治理觀念實驗室', en: 'AI Governance Laboratory' } as const;
const IEAS_NAME = {
  zh: '中央研究院歐美研究所',
  en: 'Institute of European and American Studies, Academia Sinica',
} as const;

function toAbsolute(url: string): string {
  return url.startsWith('http') ? url : SITE_URL + url;
}

export function metaDescription(text: string, max = 155): string {
  const clean = text.replace(/<br\s*\/?>/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ') > 60 ? cut.lastIndexOf(' ') : max - 1) + '…';
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
    description: locale === 'zh' ? member.bio_zh : member.bio_en,
    image: toAbsolute(member.image),
    url: absoluteUrl(locale, `/people/${member.slug}/`),
    sameAs: [member.url],
    affiliation: { '@type': 'Organization', name: IEAS_NAME[locale], url: 'https://www.ea.sinica.edu.tw/' },
  };
}

export function eventLd(event: Event, locale: Locale) {
  const performer = (event.speakers ?? []).map((s) => {
    if (s.member) {
      const m = MEMBERS.find((mm) => mm.slug === s.member);
      if (!m) throw new Error(`eventLd: unknown member slug ${s.member}`);
      return {
        '@type': 'Person',
        name: locale === 'zh' ? m.name_zh : m.name_en,
        url: absoluteUrl(locale, `/people/${m.slug}/`),
      };
    }
    const affiliation = locale === 'zh' ? (s.affiliation_zh ?? s.affiliation_en) : (s.affiliation_en ?? s.affiliation_zh);
    return {
      '@type': 'Person',
      name: (locale === 'zh' ? s.name_zh : s.name_en) ?? s.name_en ?? s.name_zh,
      ...(affiliation ? { affiliation: { '@type': 'Organization', name: affiliation } } : {}),
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
    description: metaDescription(locale === 'zh' ? event.content_zh : event.content_en, 300),
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
