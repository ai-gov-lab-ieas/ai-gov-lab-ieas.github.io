import type { EventSpeaker } from '../data/events/types';
import { MEMBERS } from '../data/members';
import { absoluteUrl } from './i18n';
import type { Locale } from '../config';

export type ResolvedSpeaker =
  | { kind: 'member'; name: string; url: string; slug: string }
  | { kind: 'external'; name: string; affiliation?: string };

export function resolveSpeaker(speaker: EventSpeaker, locale: Locale): ResolvedSpeaker {
  if (speaker.member) {
    const m = MEMBERS.find((mm) => mm.slug === speaker.member);
    if (!m) throw new Error(`resolveSpeaker: unknown member slug ${speaker.member}`);
    return {
      kind: 'member',
      name: locale === 'zh' ? m.name_zh : m.name_en,
      url: absoluteUrl(locale, `/people/${m.slug}/`),
      slug: m.slug,
    };
  }
  const affiliation =
    locale === 'zh'
      ? (speaker.affiliation_zh ?? speaker.affiliation_en)
      : (speaker.affiliation_en ?? speaker.affiliation_zh);
  const name =
    (locale === 'zh' ? speaker.name_zh : speaker.name_en) ??
    speaker.name_en ??
    speaker.name_zh ??
    '';
  return affiliation ? { kind: 'external', name, affiliation } : { kind: 'external', name };
}
