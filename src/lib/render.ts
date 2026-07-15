import type { EventSpeaker } from '../data/events/types';
import { MEMBERS } from '../data/members';
import { absoluteUrl, alternateLocale } from './i18n';
import type { Locale } from '../config';
import type { Event } from '../data/events/types';
import type { Member } from '../data/members';
import { SITE_URL } from '../config';

export type ResolvedSpeaker =
  | { kind: 'member'; name: string; url: string; slug: string }
  | { kind: 'external'; name: string; affiliation?: string };

export function resolveSpeaker(speaker: EventSpeaker, locale: Locale): ResolvedSpeaker {
  if (speaker.member) {
    const m = MEMBERS.find((mm) => mm.slug === speaker.member);
    if (!m) throw new Error(`resolveSpeaker: unknown member slug ${speaker.member}`);
    return {
      kind: 'member',
      name: locale === 'zh' ? m.name_zh : m.name_en,
      url: absoluteUrl(locale, `/people/${m.slug}/`),
      slug: m.slug,
    };
  }
  const affiliation =
    locale === 'zh'
      ? (speaker.affiliation_zh ?? speaker.affiliation_en)
      : (speaker.affiliation_en ?? speaker.affiliation_zh);
  const name =
    (locale === 'zh' ? speaker.name_zh : speaker.name_en) ??
    speaker.name_en ??
    speaker.name_zh ??
    '';
  return affiliation ? { kind: 'external', name, affiliation } : { kind: 'external', name };
}

const EVENT_LABELS = {
  zh: { speakers: '講者', abstract: '摘要', content: '內容', altLocale: 'EN' },
  en: { speakers: 'Speakers', abstract: 'Abstract', content: 'Content', altLocale: 'ZH' },
} as const;

const MEMBER_LABELS = {
  zh: { bio: 'Bio', altLocale: 'EN' },
  en: { bio: 'Bio', altLocale: 'ZH' },
} as const;

export function renderEventMarkdown(event: Event, locale: Locale): string {
  const zh = locale === 'zh';
  const labels = EVENT_LABELS[locale];
  const title = zh ? event.title_zh : event.title_en;
  const location = zh ? event.location_zh : event.location_en;
  const abstract = zh ? event.abstract_zh : event.abstract_en;
  const content = zh ? event.content_zh : event.content_en;
  const alt = alternateLocale(locale);

  const header: string[] = [
    `- **ID:** ${event.id}`,
    `- **Type:** ${event.type}`,
    `- **Date:** ${event.date}`,
  ];
  if (location) header.push(`- **Location:** ${location}`);
  header.push(`- **Canonical:** ${absoluteUrl(locale, `/event/${event.id}/`)}`);
  header.push(`- **Alternate (${labels.altLocale}):** ${absoluteUrl(alt, `/event/${event.id}/`)}`);
  header.push(`- **Atom feed:** ${absoluteUrl(locale, '/event/feed.xml')}`);

  const parts: string[] = [`# ${title}`, '', header.join('\n')];

  const speakers = (event.speakers ?? []).map((s) => resolveSpeaker(s, locale));
  if (speakers.length > 0) {
    parts.push('', `## ${labels.speakers}`);
    for (const r of speakers) {
      if (r.kind === 'member') {
        parts.push(`- [${r.name}](${r.url})`);
      } else {
        parts.push(`- ${r.name}${r.affiliation ? ` — ${r.affiliation}` : ''}`);
      }
    }
  }

  if (abstract) {
    parts.push('', `## ${labels.abstract}`, '', abstract.trim());
  }

  parts.push('', `## ${labels.content}`, '', content.trim());
  parts.push('');
  return parts.join('\n');
}

export function renderMemberMarkdown(member: Member, locale: Locale): string {
  const zh = locale === 'zh';
  const labels = MEMBER_LABELS[locale];
  const name = zh ? member.name_zh : member.name_en;
  const role = zh ? member.role_zh : member.role_en;
  const bio = zh ? member.bio_zh : member.bio_en;
  const alt = alternateLocale(locale);

  const header: string[] = [
    `- **Slug:** ${member.slug}`,
    `- **Role:** ${role}`,
    `- **Canonical:** ${absoluteUrl(locale, `/people/${member.slug}/`)}`,
    `- **Alternate (${labels.altLocale}):** ${absoluteUrl(alt, `/people/${member.slug}/`)}`,
    `- **Institutional page:** ${member.url}`,
    `- **Image:** ${SITE_URL}${member.image}`,
  ];

  return `# ${name}\n\n${header.join('\n')}\n\n## ${labels.bio}\n\n${bio.trim()}\n`;
}
