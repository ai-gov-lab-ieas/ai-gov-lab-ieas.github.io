import { describe, it, expect } from 'vitest';
import { MEMBERS } from '../src/data/members';

describe('MEMBERS', () => {
  it('has unique kebab-case slugs', () => {
    const slugs = MEMBERS.map((m) => m.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('every member has non-empty bilingual bios', () => {
    for (const m of MEMBERS) {
      expect(m.bio_zh.length, `${m.slug} bio_zh`).toBeGreaterThan(40);
      expect(m.bio_en.length, `${m.slug} bio_en`).toBeGreaterThan(40);
    }
  });

  it('keeps all 7 current members', () => {
    expect(MEMBERS).toHaveLength(7);
  });
});
