import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

const DIST = path.resolve(__dirname, '../dist');

beforeAll(() => {
  if (!existsSync(path.join(DIST, 'index.html'))) {
    execSync('npm run build', { stdio: 'inherit' });
  }
}, 120_000);

const read = (p: string) => readFileSync(path.join(DIST, p), 'utf8');

describe('default OG/Twitter tags (pages without their own image)', () => {
  it('homepage falls back to the default OG card, with dimensions and alt', () => {
    const html = read('index.html');
    expect(html).toContain('property="og:image" content="https://ai-gov-lab-ieas.github.io/images/og-default.png"');
    expect(html).toContain('property="og:image:width" content="1200"');
    expect(html).toContain('property="og:image:height" content="630"');
    expect(html).toContain('property="og:image:alt"');
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
    expect(html).toContain('name="twitter:title"');
    expect(html).toContain('name="twitter:description"');
    expect(html).toContain('name="twitter:image" content="https://ai-gov-lab-ieas.github.io/images/og-default.png"');
    expect(html).toContain('name="theme-color" content="#FAFAFA"');
    expect(html).toContain('property="og:type" content="website"');
  });

  it('homepage links the branded favicon set', () => {
    const html = read('index.html');
    expect(html).toContain('href="/favicon.svg"');
    expect(html).toContain('rel="apple-touch-icon" href="/apple-touch-icon.png"');
    expect(html).not.toContain('vite.svg');
  });

  it('404 page also gets the default share card', () => {
    const html = read('404.html');
    expect(html).toContain('property="og:image" content="https://ai-gov-lab-ieas.github.io/images/og-default.png"');
  });
});

describe('per-type OG tags on detail pages', () => {
  it('event page is og:type article with article:published_time', () => {
    const html = read('event/lecture-2024-03-20/index.html');
    expect(html).toContain('property="og:type" content="article"');
    expect(html).toContain('property="article:published_time" content="2024-03-20"');
    // custom event image → no asserted dimensions
    expect(html).not.toContain('og:image:width');
  });

  it('person page is og:type profile with profile name parts', () => {
    const html = read('people/chih-hsing-ho/index.html');
    expect(html).toContain('property="og:type" content="profile"');
    expect(html).toContain('property="profile:first_name" content="Chih-Hsing"');
    expect(html).toContain('property="profile:last_name" content="Ho"');
  });
});

describe('static pages read PAGE_SEO copy', () => {
  it('EN homepage title is the institutional name', () => {
    const html = read('en/index.html');
    expect(html).toContain('<title>AI Governance Laboratory, IEAS, Academia Sinica</title>');
  });

  it('ZH event list description carries the live event count', () => {
    const html = read('event/index.html');
    expect(html).toMatch(/name="description" content="[^"]*共 \d+ 場學術活動[^"]*"/);
  });
});
