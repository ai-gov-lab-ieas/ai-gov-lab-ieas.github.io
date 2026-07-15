import type { Event } from '../data/events/types';
import type { Locale } from '../config';
import { CONTENT } from '../data/content';
import { absoluteUrl } from './i18n';
import { metaDescription, SITE_SUFFIX_EN } from './seo';

const TAG_AUTHORITY = 'ai-gov-lab-ieas.github.io';
const TAG_YEAR = '2026'; // frozen forever — do not rotate

const FEED_TITLE = {
  zh: 'AI 治理觀念實驗室 — 活動',
  en: `${SITE_SUFFIX_EN} — Events`,
} as const;

const AUTHOR_NAME = {
  zh: 'AI 治理觀念實驗室',
  en: SITE_SUFFIX_EN,
} as const;

const XML_LANG = { zh: 'zh-Hant', en: 'en' } as const;

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function rfc3339(date: string): string {
  // date is guaranteed YYYY-MM-DD by validateEvent; +08:00 is Taiwan / IEAS.
  return `${date}T00:00:00+08:00`;
}

function maxDate(posts: Event[]): string {
  if (posts.length === 0) throw new Error('buildAtomFeed: posts must not be empty');
  return posts.map((p) => p.date).sort().pop()!;
}

function entryXml(event: Event, locale: Locale): string {
  const title = locale === 'zh' ? event.title_zh : event.title_en;
  const content = locale === 'zh' ? event.content_zh : event.content_en;
  const summary = metaDescription(content, 200);
  const contentHtml = content.replace(/\n/g, '<br />');
  const url = absoluteUrl(locale, `/event/${event.id}/`);
  const stamp = rfc3339(event.date);
  return [
    '  <entry>',
    `    <id>tag:${TAG_AUTHORITY},${TAG_YEAR}:events/${xmlEscape(event.id)}</id>`,
    `    <title>${xmlEscape(title)}</title>`,
    `    <updated>${stamp}</updated>`,
    `    <published>${stamp}</published>`,
    `    <link rel="alternate" type="text/html" href="${xmlEscape(url)}"/>`,
    `    <summary type="text">${xmlEscape(summary)}</summary>`,
    `    <content type="html">${xmlEscape(contentHtml)}</content>`,
    '  </entry>',
  ].join('\n');
}

export function buildAtomFeed(locale: Locale, posts: Event[]): string {
  const feedUrl = absoluteUrl(locale, '/event/feed.xml');
  const archiveUrl = absoluteUrl(locale, '/event/');
  const feedId = `tag:${TAG_AUTHORITY},${TAG_YEAR}:feed/events/${locale}`;
  const updated = rfc3339(maxDate(posts));
  const parts: string[] = [
    '<?xml version="1.0" encoding="utf-8"?>',
    `<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${XML_LANG[locale]}">`,
    `  <id>${feedId}</id>`,
    `  <title>${xmlEscape(FEED_TITLE[locale])}</title>`,
    `  <subtitle>${xmlEscape(CONTENT[locale].hero.desc)}</subtitle>`,
    `  <updated>${updated}</updated>`,
    `  <link rel="self" type="application/atom+xml" href="${xmlEscape(feedUrl)}"/>`,
    `  <link rel="alternate" type="text/html" href="${xmlEscape(archiveUrl)}"/>`,
    `  <author><name>${xmlEscape(AUTHOR_NAME[locale])}</name></author>`,
    '  <generator uri="https://astro.build" version="5">Astro</generator>',
  ];
  for (const p of posts) parts.push(entryXml(p, locale));
  parts.push('</feed>');
  return parts.join('\n');
}
