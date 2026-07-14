import { describe, it, expect } from 'vitest';
import { localePath, absoluteUrl, alternateLocale } from '../src/lib/i18n';
import { SITE_URL } from '../src/config';

describe('localePath', () => {
  it('leaves zh paths unprefixed', () => {
    expect(localePath('zh', '/event/x/')).toBe('/event/x/');
    expect(localePath('zh', '/')).toBe('/');
  });
  it('prefixes en paths', () => {
    expect(localePath('en', '/event/x/')).toBe('/en/event/x/');
    expect(localePath('en', '/')).toBe('/en/');
  });
  it('normalizes a missing leading slash', () => {
    expect(localePath('en', 'people/')).toBe('/en/people/');
  });
});

describe('absoluteUrl', () => {
  it('joins SITE_URL and locale path', () => {
    expect(absoluteUrl('en', '/people/jay-jian/')).toBe(`${SITE_URL}/en/people/jay-jian/`);
  });
});

describe('alternateLocale', () => {
  it('flips locales', () => {
    expect(alternateLocale('zh')).toBe('en');
    expect(alternateLocale('en')).toBe('zh');
  });
});
