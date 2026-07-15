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

// Bio strings follow a light convention:
//   `## Heading`  -> section heading
//   `- item`      -> list item (consecutive lines form one <ul>)
//   blank line    -> paragraph break
//   anything else -> prose (consecutive non-blank lines join with a space)
export function renderBioHtml(bio: string): string {
  const escape = (s: string): string =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const lines = bio.split('\n').map((l) => l.trimEnd());
  const out: string[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = (): void => {
    if (paragraph.length) {
      out.push(`<p>${escape(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };
  const flushList = (): void => {
    if (listItems.length) {
      out.push(`<ul>${listItems.map((i) => `<li>${escape(i)}</li>`).join('')}</ul>`);
      listItems = [];
    }
  };

  for (const line of lines) {
    if (line === '') {
      flushParagraph();
      flushList();
    } else if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      out.push(`<h2>${escape(line.slice(3).trim())}</h2>`);
    } else if (line.startsWith('- ')) {
      flushParagraph();
      listItems.push(line.slice(2).trim());
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();
  return out.join('');
}

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

  const attribution = zh
    ? `> 以上內容摘錄自中央研究院官方頁面，最新資訊請參見[官方個人頁面](${member.url})。`
    : `> Excerpted from Academia Sinica's official website. For the latest information, refer to the [institutional profile](${member.url}).`;

  // Bio strings use `## ` for their own section headings. Nested under the
  // outer `## Bio` heading in the markdown mirror, bump them one level deeper
  // so the document outline reads H1 → H2 (Bio) → H3 (bio subsections).
  const bioBody = bio.trim().replace(/^## /gm, '### ');

  return `# ${name}\n\n${header.join('\n')}\n\n## ${labels.bio}\n\n${bioBody}\n\n${attribution}\n`;
}
