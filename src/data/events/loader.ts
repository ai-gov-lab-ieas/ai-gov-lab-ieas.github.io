import type { Event } from './types';
import { MEMBERS } from '../members';

export function validateEvent(event: Event, memberSlugs: Set<string>): void {
  if (!event.id) throw new Error('Event is missing an id');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
    throw new Error(`Event ${event.id}: date "${event.date}" must be YYYY-MM-DD`);
  }
  for (const s of event.speakers ?? []) {
    if (s.member) {
      if (!memberSlugs.has(s.member)) {
        throw new Error(
          `Event ${event.id} references unknown member slug "${s.member}". ` +
          `Valid slugs: ${[...memberSlugs].join(', ')}`
        );
      }
    } else if (!(s.name_zh && s.name_en)) {
      throw new Error(
        `Event ${event.id}: external speakers need both name_zh and name_en`
      );
    }
  }
}

const modules = import.meta.glob<{ default: Event }>(
  ['./*.ts', '!./types.ts', '!./_template.ts', '!./loader.ts'],
  { eager: true }
);

const memberSlugs = new Set(MEMBERS.map((m) => m.slug));

const events = Object.entries(modules).map(([file, mod]) => {
  const event = mod.default;
  if (!event) throw new Error(`Event file ${file} has no default export`);
  validateEvent(event, memberSlugs);
  return event;
});

const seen = new Set<string>();
for (const e of events) {
  if (seen.has(e.id)) throw new Error(`Duplicate event id: ${e.id}`);
  seen.add(e.id);
}

export const POSTS: Event[] = events.sort((a, b) => b.date.localeCompare(a.date));

export function eventsBySpeaker(slug: string): Event[] {
  return POSTS.filter((e) => e.speakers?.some((s) => s.member === slug));
}
