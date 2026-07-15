import { describe, it, expect } from 'vitest';
import { buildLlmsTxt, buildLlmsFull } from '../src/lib/llmsTxt';
import { POSTS } from '../src/data/events/loader';
import { MEMBERS } from '../src/data/members';
import { SITE_URL } from '../src/config';

describe('buildLlmsTxt', () => {
  it('starts with a single H1 (site name)', () => {
    const s = buildLlmsTxt('zh');
    const h1Lines = s.split('\n').filter((l) => /^# [^#]/.test(l));
    expect(h1Lines.length).toBe(1);
    expect(h1Lines[0]).toBe('# AI 治理觀念實驗室');
  });

  it('has a blockquote line after the H1', () => {
    const s = buildLlmsTxt('en');
    const lines = s.split('\n');
    const h1Idx = lines.findIndex((l) => l.startsWith('# '));
    const nextNonEmpty = lines.slice(h1Idx + 1).find((l) => l.length > 0);
    expect(nextNonEmpty!.startsWith('> ')).toBe(true);
  });

  it('every H2 bullet is a markdown link with an absolute URL', () => {
    const s = buildLlmsTxt('zh');
    const lines = s.split('\n');
    let inH2 = false;
    for (const line of lines) {
      if (line.startsWith('## ')) { inH2 = true; continue; }
      if (line.startsWith('# ')) { inH2 = false; continue; }
      if (inH2 && line.startsWith('- ')) {
        expect(line).toMatch(new RegExp(`^- \\[[^\\]]+\\]\\(${SITE_URL}[^\\)]*\\)(?::.*)?$|^- \\[[^\\]]+\\]\\(https:\\/\\/www\\.ea\\.sinica\\.edu\\.tw[^\\)]*\\)(?::.*)?$`));
      }
    }
  });

  it('has an "Optional" H2 section spelled exactly that way', () => {
    const s = buildLlmsTxt('zh');
    expect(s).toMatch(/^## Optional$/m);
  });

  it('lists every event under ## Events, in POSTS order, pointing at .md mirrors', () => {
    const s = buildLlmsTxt('zh');
    const eventsBlock = s.split('## Events')[1].split('##')[0];
    let last = -1;
    for (const p of POSTS) {
      const idx = eventsBlock.indexOf(`(${SITE_URL}/event/${p.id}.md)`);
      expect(idx).toBeGreaterThan(last);
      last = idx;
    }
  });

  it('lists every member under ## People, pointing at .md mirrors', () => {
    const s = buildLlmsTxt('en');
    const peopleBlock = s.split('## People')[1].split('##')[0];
    for (const m of MEMBERS) {
      expect(peopleBlock).toContain(`(${SITE_URL}/en/people/${m.slug}.md)`);
    }
  });

  it('lists both Atom feed URLs under ## Feeds', () => {
    const s = buildLlmsTxt('zh');
    expect(s).toMatch(/## Feeds[\s\S]*\(https:\/\/ai-gov-lab-ieas\.github\.io\/event\/feed\.xml\)/);
    expect(s).toMatch(/## Feeds[\s\S]*\(https:\/\/ai-gov-lab-ieas\.github\.io\/en\/event\/feed\.xml\)/);
  });

  it('has no trailing slash on .md or .xml URLs; keeps trailing slash on /event/ and /people/', () => {
    const s = buildLlmsTxt('zh');
    expect(s).not.toMatch(/\.md\//);
    expect(s).not.toMatch(/\.xml\//);
    expect(s).toContain('/event/)');
    expect(s).toContain('/people/)');
  });
});

describe('buildLlmsFull', () => {
  it('mentions every event id and every member slug at least once', () => {
    const s = buildLlmsFull('zh');
    for (const p of POSTS) expect(s).toContain(p.id);
    for (const m of MEMBERS) expect(s).toContain(m.slug);
  });

  it('separates sections and items with CommonMark thematic break "---"', () => {
    const s = buildLlmsFull('zh');
    expect(s).toContain('\n\n---\n\n');
    const separatorCount = s.split('\n\n---\n\n').length - 1;
    // one before Events section, one between each event pair, one before People section, one between each member pair
    expect(separatorCount).toBeGreaterThanOrEqual(POSTS.length + MEMBERS.length);
  });

  it('emits events in POSTS order (newest first)', () => {
    const s = buildLlmsFull('zh');
    let last = -1;
    for (const p of POSTS) {
      const idx = s.indexOf(p.id);
      expect(idx).toBeGreaterThan(last);
      last = idx;
    }
  });
});
