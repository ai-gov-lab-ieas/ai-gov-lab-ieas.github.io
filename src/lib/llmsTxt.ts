import { POSTS } from '../data/events/loader';
import { MEMBERS } from '../data/members';
import { CONTENT } from '../data/content';
import type { Locale } from '../config';
import { absoluteUrl } from './i18n';
import { metaDescription } from './seo';
import { renderEventMarkdown, renderMemberMarkdown } from './render';

const H1 = { zh: 'AI 治理觀念實驗室', en: 'AI Governance Laboratory' } as const;

const BLURB = {
  zh: '中央研究院歐美研究所 AI 治理觀念實驗室。研究、活動、成員。ZH-Hant 主站；English mirror at /en/.',
  en: 'AI Governance Laboratory at the Institute of European and American Studies, Academia Sinica. Research, events, and people. English mirror; ZH-Hant original at /.',
} as const;

const SECTIONS = {
  zh: { about: 'About', events: 'Events', people: 'People', feeds: 'Feeds', optional: 'Optional' },
  en: { about: 'About', events: 'Events', people: 'People', feeds: 'Feeds', optional: 'Optional' },
} as const;

const HOME_LABEL = { zh: '首頁', en: 'Home' } as const;
const IEAS_LABEL = { zh: '關於 IEAS', en: 'About IEAS' } as const;
const EVENTS_ARCHIVE_LABEL = { zh: '活動總覽', en: 'Events archive' } as const;
const PEOPLE_ARCHIVE_LABEL = { zh: '成員總覽', en: 'People' } as const;
const OTHER_LOCALE_LABEL = { zh: 'English mirror', en: 'ZH-Hant mirror' } as const;

export function buildLlmsTxt(locale: Locale): string {
  const s = SECTIONS[locale];
  const other: Locale = locale === 'zh' ? 'en' : 'zh';

  const lines: string[] = [];
  lines.push(`# ${H1[locale]}`, '');
  lines.push(`> ${BLURB[locale]}`, '');

  lines.push(`## ${s.about}`);
  lines.push(`- [${HOME_LABEL[locale]}](${absoluteUrl(locale, '/')}): ${locale === 'zh' ? '實驗室簡介與最新活動' : 'Lab overview and recent events'}`);
  lines.push(`- [${IEAS_LABEL[locale]}](https://www.ea.sinica.edu.tw/): ${locale === 'zh' ? '中央研究院歐美研究所' : 'Institute of European and American Studies, Academia Sinica'}`);
  lines.push('');

  lines.push(`## ${s.events}`);
  lines.push(`- [${EVENTS_ARCHIVE_LABEL[locale]}](${absoluteUrl(locale, '/event/')}): ${locale === 'zh' ? '所有講座、研討會、工作坊' : 'lectures, conferences, workshops'}`);
  for (const p of POSTS) {
    const title = locale === 'zh' ? p.title_zh : p.title_en;
    const content = locale === 'zh' ? p.content_zh : p.content_en;
    const summary = metaDescription(content, 120);
    // .md URL has no trailing slash — extension endpoints are extensionless in Astro.
    lines.push(`- [${title}](${absoluteUrl(locale, `/event/${p.id}.md`)}): ${summary}`);
  }
  lines.push('');

  lines.push(`## ${s.people}`);
  lines.push(`- [${PEOPLE_ARCHIVE_LABEL[locale]}](${absoluteUrl(locale, '/people/')}): ${locale === 'zh' ? '研究成員' : 'lab members'}`);
  for (const m of MEMBERS) {
    const name = locale === 'zh' ? m.name_zh : m.name_en;
    const role = locale === 'zh' ? m.role_zh : m.role_en;
    lines.push(`- [${name}](${absoluteUrl(locale, `/people/${m.slug}.md`)}): ${role}`);
  }
  lines.push('');

  lines.push(`## ${s.feeds}`);
  lines.push(`- [Events Atom feed (ZH)](${absoluteUrl('zh', '/event/feed.xml')}): application/atom+xml`);
  lines.push(`- [Events Atom feed (EN)](${absoluteUrl('en', '/event/feed.xml')}): application/atom+xml`);
  lines.push('');

  lines.push(`## ${s.optional}`);
  lines.push(`- [${OTHER_LOCALE_LABEL[locale]}](${absoluteUrl(other, '/')}): ${locale === 'zh' ? '完整英文版網站' : 'full ZH-Hant site'}`);
  lines.push(`- [llms-full.txt (${locale === 'zh' ? 'EN' : 'ZH'})](${absoluteUrl(other, '/llms-full.txt')}): ${locale === 'zh' ? '對側語言的全文匯出' : 'other-locale full-content dump'}`);
  lines.push(`- [llms-full.txt (${locale === 'zh' ? '本站' : 'this locale'})](${absoluteUrl(locale, '/llms-full.txt')}): ${locale === 'zh' ? '所有活動與成員的 markdown 匯出' : 'all events and people concatenated as markdown'}`);
  lines.push('');
  return lines.join('\n');
}

const FULL_ABOUT = {
  zh: [
    'ZH-Hant. Generated from src/data at build time. See /llms.txt for a navigable index.',
    '',
    CONTENT.zh.hero.desc,
    '',
    CONTENT.zh.mission.main_quote,
  ].join('\n'),
  en: [
    'English mirror. Generated from src/data at build time. See /en/llms.txt for a navigable index.',
    '',
    CONTENT.en.hero.desc,
    '',
    CONTENT.en.mission.main_quote,
  ].join('\n'),
} as const;

export function buildLlmsFull(locale: Locale): string {
  const SEP = '\n\n---\n\n';
  const parts: string[] = [];
  parts.push(`# ${H1[locale]} — Full site content`, '');
  parts.push(`> ${BLURB[locale]}`, '');
  parts.push(FULL_ABOUT[locale]);
  parts.push(SEP + `## ${SECTIONS[locale].events}\n`);
  parts.push(POSTS.map((p) => renderEventMarkdown(p, locale)).join(SEP));
  parts.push(SEP + `## ${SECTIONS[locale].people}\n`);
  parts.push(MEMBERS.map((m) => renderMemberMarkdown(m, locale)).join(SEP));
  parts.push('');
  return parts.join('\n');
}
