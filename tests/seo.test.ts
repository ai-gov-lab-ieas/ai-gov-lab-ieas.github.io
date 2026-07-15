import { describe, it, expect } from 'vitest';
import { organizationLd, personLd, eventLd, breadcrumbLd, metaDescription } from '../src/lib/seo';
import { MEMBERS } from '../src/data/members';
import { SITE_URL } from '../src/config';
import type { Event } from '../src/data/events/types';

const event: Event = {
  id: 'lecture-2099-01-01', date: '2099-01-01', year: '2099', type: 'Lecture',
  image: '/images/x.jpg', title_zh: '講題', title_en: 'Talk',
  content_zh: '內容', content_en: 'Content',
  speakers: [{ member: MEMBERS[0].slug }, { name_zh: '外部講者', name_en: 'External Speaker' }],
};

describe('eventLd', () => {
  it('links lab-member performers to their member page', () => {
    const ld = eventLd(event, 'en') as any;
    expect(ld['@type']).toBe('Event');
    expect(ld.startDate).toBe('2099-01-01');
    expect(ld.performer[0].url).toBe(`${SITE_URL}/en/people/${MEMBERS[0].slug}/`);
    expect(ld.performer[1].name).toBe('External Speaker');
    expect(ld.image).toBe(`${SITE_URL}/images/x.jpg`);
  });
  it('defaults location to IEAS', () => {
    const ld = eventLd(event, 'zh') as any;
    expect(ld.location.name).toContain('歐美研究所');
  });
});

describe('personLd', () => {
  it('uses sameAs for the institutional profile', () => {
    const ld = personLd(MEMBERS[0], 'en') as any;
    expect(ld['@type']).toBe('Person');
    expect(ld.sameAs).toEqual([MEMBERS[0].url]);
    expect(ld.url).toBe(`${SITE_URL}/en/people/${MEMBERS[0].slug}/`);
  });
});

describe('organizationLd', () => {
  it('names the lab and its parent institute', () => {
    const ld = organizationLd('en') as any;
    expect(ld.name).toBe('AI Governance Laboratory');
    expect(ld.parentOrganization.url).toBe('https://www.ea.sinica.edu.tw/');
  });
});

describe('breadcrumbLd', () => {
  it('numbers items from 1', () => {
    const ld = breadcrumbLd([{ name: 'Home', url: 'u1' }, { name: 'Events', url: 'u2' }]) as any;
    expect(ld.itemListElement[1]).toMatchObject({ position: 2, name: 'Events', item: 'u2' });
  });
});

describe('metaDescription', () => {
  it('strips newlines and truncates at a word boundary', () => {
    const text = 'word '.repeat(60) + '\nline';
    const out = metaDescription(text);
    expect(out.length).toBeLessThanOrEqual(155);
    expect(out).not.toContain('\n');
  });
});
