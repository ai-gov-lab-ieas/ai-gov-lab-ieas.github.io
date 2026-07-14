import { describe, it, expect } from 'vitest';
import { POSTS, validateEvent, eventsBySpeaker } from '../src/data/events/loader';
import type { Event } from '../src/data/events/types';

const base: Event = {
  id: 'lecture-2099-01-01', date: '2099-01-01', year: '2099', type: 'Lecture',
  image: 'x.jpg', title_zh: 't', title_en: 't', content_zh: 'c', content_en: 'c',
};
const slugs = new Set(['tzu-wei-hung']);

describe('validateEvent', () => {
  it('accepts an event without speakers', () => {
    expect(() => validateEvent(base, slugs)).not.toThrow();
  });
  it('rejects unknown member slugs', () => {
    expect(() => validateEvent({ ...base, speakers: [{ member: 'nobody' }] }, slugs))
      .toThrow(/unknown member slug "nobody"/);
  });
  it('rejects external speakers missing a name', () => {
    expect(() => validateEvent({ ...base, speakers: [{ name_zh: '只有中文' }] }, slugs))
      .toThrow(/name_zh and name_en/);
  });
  it('rejects malformed dates', () => {
    expect(() => validateEvent({ ...base, date: '2099/01/01' }, slugs))
      .toThrow(/date/);
  });
});

describe('POSTS', () => {
  it('discovers all event files (13 as of this plan)', () => {
    expect(POSTS.length).toBeGreaterThanOrEqual(13);
  });
  it('is sorted newest first with unique ids', () => {
    for (let i = 1; i < POSTS.length; i++) {
      expect(POSTS[i - 1].date >= POSTS[i].date).toBe(true);
    }
    expect(new Set(POSTS.map((p) => p.id)).size).toBe(POSTS.length);
  });
  it('does not include the template', () => {
    expect(POSTS.find((p) => p.id === 'TYPE-YYYY-MM-DD')).toBeUndefined();
  });
});

describe('eventsBySpeaker', () => {
  it('returns [] for a member with no tagged events yet', () => {
    expect(eventsBySpeaker('no-such-member')).toEqual([]);
  });
});
