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
