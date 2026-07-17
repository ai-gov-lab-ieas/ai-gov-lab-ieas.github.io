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
