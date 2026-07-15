import { describe, it, expect } from 'vitest';
import { resolveSpeaker } from '../src/lib/render';
import { MEMBERS } from '../src/data/members';
import { SITE_URL } from '../src/config';

describe('resolveSpeaker', () => {
  it('resolves a lab-member speaker to a link', () => {
    const r = resolveSpeaker({ member: MEMBERS[0].slug }, 'en');
    expect(r).toEqual({
      kind: 'member',
      name: MEMBERS[0].name_en,
      url: `${SITE_URL}/en/people/${MEMBERS[0].slug}/`,
      slug: MEMBERS[0].slug,
    });
  });

  it('uses the ZH name and ZH people URL on ZH locale', () => {
    const r = resolveSpeaker({ member: MEMBERS[0].slug }, 'zh');
    expect(r).toMatchObject({ kind: 'member', name: MEMBERS[0].name_zh, url: `${SITE_URL}/people/${MEMBERS[0].slug}/` });
  });

  it('resolves an external speaker with affiliation', () => {
    const r = resolveSpeaker(
      { name_zh: '外部講者', name_en: 'External Speaker', affiliation_zh: '某大學', affiliation_en: 'Some University' },
      'en'
    );
    expect(r).toEqual({ kind: 'external', name: 'External Speaker', affiliation: 'Some University' });
  });

  it('omits affiliation when neither side is set', () => {
    const r = resolveSpeaker({ name_zh: '外部', name_en: 'External' }, 'en');
    expect(r).toEqual({ kind: 'external', name: 'External' });
  });

  it('falls back to the other locale name when the requested locale is missing', () => {
    const r = resolveSpeaker({ name_en: 'Only EN' }, 'zh');
    expect(r).toEqual({ kind: 'external', name: 'Only EN' });
  });

  it('throws with the guardrail prefix on unknown member slug', () => {
    expect(() => resolveSpeaker({ member: 'no-such-slug' }, 'en')).toThrow(
      /resolveSpeaker: unknown member slug no-such-slug/
    );
  });
});

import { renderEventMarkdown, renderMemberMarkdown } from '../src/lib/render';
import type { Event } from '../src/data/events/types';
import type { Member } from '../src/data/members';

const sampleEvent: Event = {
  id: 'lecture-2099-01-01',
  date: '2099-01-01',
  year: '2099',
  type: 'Lecture',
  image: '/images/x.jpg',
  title_zh: '講題',
  title_en: 'Talk',
  content_zh: 'line 1\nline 2',
  content_en: 'line 1\nline 2',
  location_zh: '會議室',
  location_en: 'Meeting Room',
  abstract_zh: '摘要一\n摘要二',
  abstract_en: 'Abstract 1\nAbstract 2',
  speakers: [{ member: MEMBERS[0].slug }, { name_zh: '外部', name_en: 'External', affiliation_en: 'Somewhere' }],
};

describe('renderEventMarkdown', () => {
  it('emits ZH mirror with H1 title, header block, and ZH section headings', () => {
    const md = renderEventMarkdown(sampleEvent, 'zh');
    expect(md).toMatch(/^# 講題\n/);
    expect(md).toContain('**ID:** lecture-2099-01-01');
    expect(md).toContain('**Date:** 2099-01-01');
    expect(md).toContain('**Type:** Lecture');
    expect(md).toContain('**Location:** 會議室');
    expect(md).toContain(`**Canonical:** ${SITE_URL}/event/lecture-2099-01-01/`);
    expect(md).toContain(`**Alternate (EN):** ${SITE_URL}/en/event/lecture-2099-01-01/`);
    expect(md).toContain(`**Atom feed:** ${SITE_URL}/event/feed.xml`);
    expect(md).toContain('## 講者');
    expect(md).toContain('## 摘要');
    expect(md).toContain('## 內容');
  });

  it('emits EN mirror with English section headings and EN URLs', () => {
    const md = renderEventMarkdown(sampleEvent, 'en');
    expect(md).toMatch(/^# Talk\n/);
    expect(md).toContain('**Location:** Meeting Room');
    expect(md).toContain(`**Canonical:** ${SITE_URL}/en/event/lecture-2099-01-01/`);
    expect(md).toContain(`**Alternate (ZH):** ${SITE_URL}/event/lecture-2099-01-01/`);
    expect(md).toContain(`**Atom feed:** ${SITE_URL}/en/event/feed.xml`);
    expect(md).toContain('## Speakers');
    expect(md).toContain('## Abstract');
    expect(md).toContain('## Content');
  });

  it('renders lab-member speakers as markdown links and external speakers with affiliation', () => {
    const md = renderEventMarkdown(sampleEvent, 'en');
    expect(md).toContain(`- [${MEMBERS[0].name_en}](${SITE_URL}/en/people/${MEMBERS[0].slug}/)`);
    expect(md).toContain('- External — Somewhere');
  });

  it('passes content newlines through raw (no <br />)', () => {
    const md = renderEventMarkdown(sampleEvent, 'zh');
    expect(md).toContain('line 1\nline 2');
    expect(md).not.toContain('<br />');
  });

  it('omits optional sections when the source fields are absent', () => {
    const minimal: Event = { ...sampleEvent, location_zh: undefined, location_en: undefined, abstract_zh: undefined, abstract_en: undefined };
    const md = renderEventMarkdown(minimal, 'en');
    expect(md).not.toContain('**Location:**');
    expect(md).not.toContain('## Abstract');
  });

  it('omits the speakers section when speakers is empty', () => {
    const noSpeakers: Event = { ...sampleEvent, speakers: undefined };
    const md = renderEventMarkdown(noSpeakers, 'en');
    expect(md).not.toContain('## Speakers');
  });
});

describe('renderMemberMarkdown', () => {
  const sampleMember: Member = MEMBERS[0];

  it('emits ZH mirror with slug/role/URLs header and ZH bio', () => {
    const md = renderMemberMarkdown(sampleMember, 'zh');
    expect(md).toMatch(new RegExp(`^# ${sampleMember.name_zh}\\n`));
    expect(md).toContain(`**Slug:** ${sampleMember.slug}`);
    expect(md).toContain(`**Role:** ${sampleMember.role_zh}`);
    expect(md).toContain(`**Canonical:** ${SITE_URL}/people/${sampleMember.slug}/`);
    expect(md).toContain(`**Alternate (EN):** ${SITE_URL}/en/people/${sampleMember.slug}/`);
    expect(md).toContain(`**Institutional page:** ${sampleMember.url}`);
    expect(md).toContain(`**Image:** ${SITE_URL}${sampleMember.image}`);
    expect(md).toContain('## Bio');
    expect(md).toContain(sampleMember.bio_zh);
  });

  it('emits EN mirror with EN bio', () => {
    const md = renderMemberMarkdown(sampleMember, 'en');
    expect(md).toMatch(new RegExp(`^# ${sampleMember.name_en}\\n`));
    expect(md).toContain(`**Role:** ${sampleMember.role_en}`);
    expect(md).toContain(sampleMember.bio_en);
  });
});
