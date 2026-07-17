import { describe, it, expect } from 'vitest';
import { PAGE_SEO } from '../src/data/pageSeo';
import { SITE_SUFFIX_EN } from '../src/lib/seo';
import { LOCALES } from '../src/config';

describe('PAGE_SEO shape', () => {
  it('every entry has both locales with non-empty title and ogImageAlt', () => {
    for (const key of ['home', 'eventList', 'peopleList', 'notFound'] as const) {
      for (const loc of LOCALES) {
        const entry = PAGE_SEO[key][loc];
        expect(entry.title.length, `${key}.${loc}.title`).toBeGreaterThan(0);
        expect(entry.ogImageAlt.length, `${key}.${loc}.ogImageAlt`).toBeGreaterThan(0);
      }
    }
  });

  it('descriptions stay within 160 characters', () => {
    for (const loc of LOCALES) {
      expect(PAGE_SEO.home[loc].description.length).toBeLessThanOrEqual(160);
      expect(PAGE_SEO.peopleList[loc].description.length).toBeLessThanOrEqual(160);
      expect(PAGE_SEO.notFound[loc].description.length).toBeLessThanOrEqual(160);
      expect(PAGE_SEO.eventList[loc].description(17).length).toBeLessThanOrEqual(160);
    }
  });

  it('EN titles of indexable pages end with the institutional suffix', () => {
    expect(PAGE_SEO.home.en.title.endsWith(SITE_SUFFIX_EN)).toBe(true);
    expect(PAGE_SEO.eventList.en.title.endsWith(SITE_SUFFIX_EN)).toBe(true);
    expect(PAGE_SEO.peopleList.en.title.endsWith(SITE_SUFFIX_EN)).toBe(true);
  });
});
