import { describe, it, expect } from 'vitest';
import { XMLParser } from 'fast-xml-parser';
import { buildAtomFeed } from '../src/lib/atom';
import { POSTS } from '../src/data/events/loader';
import { SITE_URL } from '../src/config';
import { CONTENT } from '../src/data/content';
import type { Event } from '../src/data/events/types';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  isArray: (name) => name === 'entry' || name === 'link',
});

describe('buildAtomFeed', () => {
  it('emits a well-formed XML document that parses back', () => {
    const xml = buildAtomFeed('zh', POSTS);
    expect(xml.startsWith('<?xml version="1.0" encoding="utf-8"?>')).toBe(true);
    const parsed = parser.parse(xml);
    expect(parsed.feed).toBeDefined();
    expect(parsed.feed['@_xmlns']).toBe('http://www.w3.org/2005/Atom');
    expect(parsed.feed['@_xml:lang']).toBe('zh-Hant');
  });

  it('emits xml:lang="en" on the EN feed', () => {
    const xml = buildAtomFeed('en', POSTS);
    const parsed = parser.parse(xml);
    expect(parsed.feed['@_xml:lang']).toBe('en');
  });

  it('uses a frozen tag: URI (year 2026) for the feed <id>', () => {
    const xml = buildAtomFeed('zh', POSTS);
    const parsed = parser.parse(xml);
    expect(parsed.feed.id).toBe('tag:ai-gov-lab-ieas.github.io,2026:feed/events/zh');
  });

  it('sets feed <updated> to max(POSTS[*].date) with +08:00 offset — not build time', () => {
    const maxDate = POSTS.map((p) => p.date).sort().pop();
    const xml = buildAtomFeed('zh', POSTS);
    const parsed = parser.parse(xml);
    expect(parsed.feed.updated).toBe(`${maxDate}T00:00:00+08:00`);
    // stable across calls in the same process
    const xml2 = buildAtomFeed('zh', POSTS);
    const parsed2 = parser.parse(xml2);
    expect(parsed2.feed.updated).toBe(parsed.feed.updated);
  });

  it('includes rel="self" and rel="alternate" feed-level links with correct hrefs', () => {
    const xml = buildAtomFeed('zh', POSTS);
    const parsed = parser.parse(xml);
    const links = parsed.feed.link as any[];
    const self = links.find((l) => l['@_rel'] === 'self');
    const alt = links.find((l) => l['@_rel'] === 'alternate');
    expect(self['@_type']).toBe('application/atom+xml');
    expect(self['@_href']).toBe(`${SITE_URL}/event/feed.xml`);
    expect(alt['@_type']).toBe('text/html');
    expect(alt['@_href']).toBe(`${SITE_URL}/event/`);
  });

  it('has a <subtitle> equal to CONTENT[locale].hero.desc for both locales', () => {
    for (const locale of ['zh', 'en'] as const) {
      const xml = buildAtomFeed(locale, POSTS);
      const parsed = parser.parse(xml);
      expect(parsed.feed.subtitle).toBe(CONTENT[locale].hero.desc);
    }
  });

  it('has a feed-level <author> and no per-entry <author>', () => {
    const xml = buildAtomFeed('en', POSTS);
    const parsed = parser.parse(xml);
    expect(parsed.feed.author.name).toBe('AI Governance Laboratory, IEAS, Academia Sinica');
    const entries = parsed.feed.entry as any[];
    for (const e of entries) {
      expect(e.author).toBeUndefined();
    }
  });

  it('has one entry per POSTS item, in POSTS order', () => {
    const xml = buildAtomFeed('zh', POSTS);
    const parsed = parser.parse(xml);
    const entries = parsed.feed.entry as any[];
    expect(entries.length).toBe(POSTS.length);
    for (let i = 0; i < POSTS.length; i++) {
      expect(entries[i].id).toBe(`tag:ai-gov-lab-ieas.github.io,2026:events/${POSTS[i].id}`);
      expect(entries[i].title).toBe(POSTS[i].title_zh);
    }
  });

  it('sets entry <updated> and <published> to event.date with +08:00 offset', () => {
    const xml = buildAtomFeed('en', POSTS);
    const parsed = parser.parse(xml);
    const entries = parsed.feed.entry as any[];
    expect(entries[0].updated).toBe(`${POSTS[0].date}T00:00:00+08:00`);
    expect(entries[0].published).toBe(`${POSTS[0].date}T00:00:00+08:00`);
  });

  it('emits <content type="html"> with <br /> substituted for source newlines', () => {
    const xml = buildAtomFeed('en', POSTS);
    const withNewline = POSTS.find((p) => p.content_en.includes('\n'));
    if (!withNewline) throw new Error('test fixture assumption failed: at least one post has a newline');
    const parsed = parser.parse(xml);
    const entry = (parsed.feed.entry as any[]).find((e: any) => e.id.endsWith(withNewline.id));
    expect(entry.content['@_type']).toBe('html');
    expect(String(entry.content['#text'])).toContain('<br />');
  });

  it('XML-escapes ampersand, less-than, greater-than, and double-quote in titles and content', () => {
    const evil: Event = {
      id: 'lecture-2099-12-31',
      date: '2099-12-31',
      year: '2099',
      type: 'Lecture',
      image: '/images/x.jpg',
      title_zh: 'A & B <c> "d"',
      title_en: 'A & B <c> "d"',
      content_zh: 'a & b',
      content_en: 'a & b',
    };
    const xml = buildAtomFeed('en', [evil]);
    expect(xml).toContain('A &amp; B &lt;c&gt; &quot;d&quot;');
    expect(xml).toContain('a &amp; b');
    expect(xml).not.toContain('A & B <c>');
  });
});
