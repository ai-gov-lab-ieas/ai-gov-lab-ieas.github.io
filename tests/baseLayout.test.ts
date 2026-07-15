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

describe('BaseLayout Atom auto-discovery', () => {
  it('ZH homepage has both feed <link> tags, ZH primary and EN hreflang', () => {
    const html = readFileSync(path.join(DIST, 'index.html'), 'utf8');
    expect(html).toMatch(/<link rel="alternate" type="application\/atom\+xml" title="[^"]*" href="\/event\/feed\.xml"\s*\/?>/);
    expect(html).toMatch(/<link rel="alternate" type="application\/atom\+xml" hreflang="en" title="[^"]*" href="\/en\/event\/feed\.xml"\s*\/?>/);
  });

  it('EN homepage has both feed <link> tags, EN primary and ZH hreflang', () => {
    const html = readFileSync(path.join(DIST, 'en/index.html'), 'utf8');
    expect(html).toMatch(/<link rel="alternate" type="application\/atom\+xml" title="[^"]*" href="\/en\/event\/feed\.xml"\s*\/?>/);
    expect(html).toMatch(/<link rel="alternate" type="application\/atom\+xml" hreflang="zh-Hant" title="[^"]*" href="\/event\/feed\.xml"\s*\/?>/);
  });
});
