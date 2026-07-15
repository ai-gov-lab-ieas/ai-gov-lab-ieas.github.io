# SEO Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-platform the site from a client-rendered React SPA to a fully static Astro site with per-language URLs, per-page meta, JSON-LD structured data, member pages, sitemap, and robots.txt — visual design unchanged.

**Architecture:** Astro 5 static output with `@astrojs/react`. Existing React components are kept (Team, Mission, BentoBox, MissionModal as hydrated islands; Activities server-rendered with zero client JS; Hero and Navigation get small rewrites). Chinese pages live at `/`, English mirrors at `/en/`, both generated from shared `.astro` templates that take a `locale` prop. All page HTML is rendered at build time.

**Tech Stack:** Astro 5, @astrojs/react (React 18), Tailwind CSS 4 via `@tailwindcss/vite`, @astrojs/sitemap, lucide-react, Vitest for data/lib unit tests, GitHub Pages via existing Actions workflow.

**Spec:** `docs/superpowers/specs/2026-07-14-seo-astro-migration-design.md`

## Global Constraints

- Canonical site URL is the single constant `SITE_URL = "https://ai-gov-lab-ieas.github.io"` in `src/config.ts`. Nothing else may hard-code the domain.
- Locales: `zh` (default, unprefixed URLs, `lang="zh-Hant"`) and `en` (under `/en/`, `lang="en"`). `x-default` hreflang points to the zh version.
- Visual design must not change. Ported markup keeps the exact Tailwind class strings from the React originals.
- The one-file-per-event authoring workflow in `src/data/events/*.ts` is preserved; existing event files must keep working without the new optional fields.
- Every task ends with `npm run build` succeeding (and `npm test` passing once Vitest exists in Task 2).
- Node 20 (matches the deploy workflow).
- All work happens on branch `astro-seo-migration`.

## Prep (before Task 1)

```bash
cd /Users/cheng/ai-gov-lab-ieas.github.io
git checkout -b astro-seo-migration
git add -A && git commit -m "wip: snapshot pending events index change before migration"
```

(The working tree has an uncommitted `src/data/events/index.ts` change; snapshot it — that file is deleted in Task 3 anyway.)

## File Structure (end state)

```
astro.config.mjs                     Astro config: site, integrations, tailwind vite plugin
src/config.ts                        SITE_URL, Locale type, DEFAULT_LOCALE
src/styles/global.css                moved from src/index.css, unchanged content
src/lib/i18n.ts                      localePath / absoluteUrl / alternateLocale
src/lib/seo.ts                       JSON-LD builders + description truncation
src/data/content.ts                  CONTENT + COLLABORATORS (MEMBERS moves out, POSTS re-export removed)
src/data/members.ts                  MEMBERS with slug + bios (new)
src/data/events/types.ts             Event + EventSpeaker (extended)
src/data/events/loader.ts            glob auto-discovery + validation (replaces index.ts)
src/data/events/*.ts                 event files, unchanged format + optional speakers
src/layouts/BaseLayout.astro         head/meta/hreflang/JSON-LD + nav + footer
src/components/Navigation.tsx        rewritten: props {locale, path}, <a> links (island)
src/components/Footer.astro          ported from App.tsx footer
src/components/Hero.astro            ported from Hero.tsx, CSS animations, zero JS
src/components/Activities.tsx        modified: <a> links, posts via props (static render)
src/components/Mission.tsx           unchanged (island)
src/components/Team.tsx              modified: cards link to member pages (island)
src/components/ui/*                  unchanged
src/templates/HomePage.astro         shared per-locale page bodies
src/templates/EventListPage.astro
src/templates/EventDetailPage.astro
src/templates/PeopleListPage.astro
src/templates/PersonPage.astro
src/pages/index.astro                thin locale wrappers
src/pages/event/index.astro
src/pages/event/[id].astro
src/pages/people/index.astro
src/pages/people/[slug].astro
src/pages/en/{index,event/index,event/[id],people/index,people/[slug]}.astro
src/pages/404.astro
public/robots.txt
tests/i18n.test.ts  tests/seo.test.ts  tests/members.test.ts  tests/events.test.ts
docs/SEO.md                          Search Console + maintenance instructions
DELETED: index.html, vite.config.ts, postcss.config.js, tailwind.config.js,
         tsconfig.node.json, src/main.tsx, src/App.tsx, src/index.css,
         src/pages/*.tsx, src/components/Hero.tsx, src/data/events/index.ts
```

---

### Task 1: Astro scaffold

Replace the Vite/React-SPA toolchain with Astro while keeping the repo buildable (placeholder home page; real pages come in Tasks 6–9).

**Files:**
- Modify: `package.json`, `tsconfig.json`
- Create: `astro.config.mjs`, `src/config.ts`, `src/styles/global.css` (move of `src/index.css`), `src/pages/index.astro` (placeholder), `src/env.d.ts`
- Delete: `index.html`, `vite.config.ts`, `postcss.config.js`, `tailwind.config.js`, `tsconfig.node.json`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/pages/HomePage.tsx`, `src/pages/EventsPage.tsx`, `src/pages/EventDetailPage.tsx`, `src/components/Hero.tsx`, `src/components/Navigation.tsx`

  (The deleted pages/components are re-created as Astro ports in Tasks 5–7 — their markup is reproduced verbatim in those tasks. `src/App.tsx`'s footer is reproduced in Task 5.)

**Interfaces:**
- Produces: `src/config.ts` exporting `SITE_URL: string`, `type Locale = 'zh' | 'en'`, `DEFAULT_LOCALE: Locale`, `LOCALES`. Every later task imports from here.

- [ ] **Step 1: Swap dependencies**

```bash
npm uninstall react-router-dom @vitejs/plugin-react vite autoprefixer postcss @tailwindcss/postcss
npm install astro @astrojs/react @astrojs/sitemap @tailwindcss/vite tailwindcss@^4 sharp
```

(`react`, `react-dom`, `lucide-react`, `typescript` stay.)

- [ ] **Step 2: Update package.json scripts**

Replace the `scripts` block with:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "test": "vitest run"
}
```

(Vitest is installed in Task 2; `npm test` is not run until then.)

- [ ] **Step 3: Create astro.config.mjs**

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://ai-gov-lab-ieas.github.io',
  trailingSlash: 'ignore',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

Note: `site` here must match `SITE_URL` in `src/config.ts` — it's the one place Astro requires its own copy (for the sitemap integration). A unit test in Task 4 can't reach this file; the final verification in Task 10 greps both for consistency.

- [ ] **Step 4: Create src/config.ts**

```ts
export const SITE_URL = 'https://ai-gov-lab-ieas.github.io';
export const LOCALES = ['zh', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'zh';
```

- [ ] **Step 5: Replace tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "strictNullChecks": true
  },
  "include": [".astro/types.d.ts", "src/**/*", "tests/**/*"],
  "exclude": ["dist", "node_modules"]
}
```

- [ ] **Step 6: Create src/env.d.ts**

```ts
/// <reference types="astro/client" />
```

- [ ] **Step 7: Move the stylesheet**

```bash
git mv src/index.css src/styles/global.css
```

Content unchanged (it already uses Tailwind 4's `@import "tailwindcss";`).

- [ ] **Step 8: Delete the SPA entry points and to-be-replaced files**

```bash
git rm index.html vite.config.ts postcss.config.js tailwind.config.js tsconfig.node.json \
  src/main.tsx src/App.tsx \
  src/pages/HomePage.tsx src/pages/EventsPage.tsx src/pages/EventDetailPage.tsx \
  src/components/Hero.tsx src/components/Navigation.tsx
```

- [ ] **Step 9: Create placeholder src/pages/index.astro**

```astro
---
import '../styles/global.css';
---
<!doctype html>
<html lang="zh-Hant">
  <head><meta charset="UTF-8" /><title>AI 治理觀念實驗室</title></head>
  <body><h1 class="text-4xl font-bold">Migration in progress</h1></body>
</html>
```

- [ ] **Step 10: Verify build**

Run: `npm run build`
Expected: `astro build` completes, `dist/index.html` exists.

Note: `src/components/Team.tsx`, `Activities.tsx`, `Mission.tsx` still exist and import from `react-router-dom` / `../data/content` — they are not imported by any page yet, so the build does not touch them. If Astro's type-check step complains, that is fixed when they're modified in Task 6; `astro build` alone does not type-check.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro, remove Vite SPA toolchain"
```

---

### Task 2: Members data module with slugs and bios

**Files:**
- Create: `src/data/members.ts`, `tests/members.test.ts`
- Modify: `src/data/content.ts` (remove `MEMBERS`), `src/components/Team.tsx` (import path only — full Team changes come in Task 6), `package.json` (add vitest)

**Interfaces:**
- Produces: `src/data/members.ts` exporting `interface Member { slug; name; name_en; name_zh; role_zh; role_en; image; bio_zh; bio_en; url; tags: string[] }` and `MEMBERS: Member[]`. Slugs (fixed, used by all later tasks): `chih-hsing-ho`, `cheng-hung-tsai`, `tzu-wei-hung`, `hung-ju-chen`, `jay-jian`, `bow-yaw-wang`, `tyng-ruey-chuang`.

- [ ] **Step 1: Install vitest**

```bash
npm install -D vitest
```

- [ ] **Step 2: Write failing test tests/members.test.ts**

```ts
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
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run tests/members.test.ts`
Expected: FAIL — cannot resolve `../src/data/members`.

- [ ] **Step 4: Draft the bios**

For each of the 7 members, fetch their institutional profile (the `url` field values are in `src/data/content.ts:127-205`) with WebFetch. Draft an 80–120 word `bio_zh` and `bio_en` **using only facts stated on the fetched page** (position, degrees, research areas, institution). Do not invent publications, awards, or dates. If a page cannot be fetched, write a two-sentence bio from the data we already have (name, role, institute) — e.g. zh: "何之行為中央研究院歐美研究所副研究員，並擔任 AI 治理觀念實驗室計畫主持人。研究領域涵蓋人工智慧治理、資料保護與科技法律。" / en: "Chih-Hsing Ho is an Associate Research Fellow at the Institute of European and American Studies, Academia Sinica, and coordinates the AI Governance Laboratory. Her work focuses on AI governance, data protection, and law and technology." — and note in the commit message which bios used the fallback. All bios are flagged for user review at the end of the plan regardless.

- [ ] **Step 5: Create src/data/members.ts**

```ts
export interface Member {
  slug: string;        // URL segment: /people/<slug>/
  name: string;        // "Chih-Hsing Ho (何之行)" — combined display name
  name_en: string;
  name_zh: string;
  role_zh: string;
  role_en: string;
  image: string;       // path under public/
  bio_zh: string;      // 80-120 words, drafted from institutional profile
  bio_en: string;
  url: string;         // official institutional profile (used as sameAs)
  tags: string[];
}

export const MEMBERS: Member[] = [
  {
    slug: 'chih-hsing-ho',
    name: 'Chih-Hsing Ho (何之行)',
    name_en: 'Chih-Hsing Ho',
    name_zh: '何之行',
    role_zh: '計畫主持人 / 副研究員',
    role_en: 'Project Coordinator / Associate Research Fellow',
    image: '/images/team/Chih-Hsing-Ho.jpg',
    bio_zh: '<drafted in Step 4>',
    bio_en: '<drafted in Step 4>',
    url: 'https://www.ea.sinica.edu.tw/people/Chih-hsing-Ho.aspx?lang=e',
    tags: [],
  },
  // ...same shape for the remaining 6 members, copying name/role/image/url
  // verbatim from the MEMBERS array currently in src/data/content.ts:127-205,
  // with slugs: cheng-hung-tsai, tzu-wei-hung, hung-ju-chen, jay-jian,
  // bow-yaw-wang, tyng-ruey-chuang
];
```

(`<drafted in Step 4>` markers must be replaced with the actual Step-4 bio text before this file is saved — the Step 2 test enforces this.)

- [ ] **Step 6: Remove MEMBERS from content.ts, fix the one importer**

In `src/data/content.ts`: delete the entire `export const MEMBERS = [...]` block (lines 127–205). Keep `CONTENT`, `Lang`, `COLLABORATORS`; also delete the last line `export { POSTS } from './events';` will happen in Task 3 — leave it for now.

In `src/components/Team.tsx` change:

```ts
import { Lang, CONTENT, MEMBERS, COLLABORATORS } from '../data/content';
```

to:

```ts
import { Lang, CONTENT, COLLABORATORS } from '../data/content';
import { MEMBERS } from '../data/members';
```

- [ ] **Step 7: Run tests and build**

Run: `npx vitest run tests/members.test.ts` → Expected: PASS (3 tests)
Run: `npm run build` → Expected: succeeds.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: dedicated members module with slugs and bilingual bios"
```

---

### Task 3: Event auto-discovery loader with validation

**Files:**
- Modify: `src/data/events/types.ts`, `src/data/content.ts` (drop POSTS re-export)
- Create: `src/data/events/loader.ts`, `tests/events.test.ts`
- Delete: `src/data/events/index.ts`

**Interfaces:**
- Consumes: `MEMBERS` from Task 2.
- Produces:
  - `src/data/events/types.ts`: `interface EventSpeaker { member?: string; name_zh?: string; name_en?: string; affiliation_zh?: string; affiliation_en?: string }` and `Event` gaining optional `speakers?: EventSpeaker[]`, `location_zh?`, `location_en?`, `abstract_zh?`, `abstract_en?`.
  - `src/data/events/loader.ts`: `POSTS: Event[]` (sorted newest first), `eventsBySpeaker(slug: string): Event[]`, `validateEvent(event: Event, memberSlugs: Set<string>): void` (throws on bad data).

- [ ] **Step 1: Extend types.ts**

Replace `src/data/events/types.ts` with:

```ts
// Event type definition
export interface EventSpeaker {
  member?: string;         // slug of a lab member (see src/data/members.ts)
  name_zh?: string;        // external speaker: both names required
  name_en?: string;
  affiliation_zh?: string;
  affiliation_en?: string;
}

export interface Event {
  id: string;              // Unique identifier (format: type-YYYY-MM-DD)
  date: string;            // Event date (format: YYYY-MM-DD)
  year: string;            // Year as string (for grouping)
  type: string;            // Event type: "Lecture", "Conference", "Workshop", etc.
  image: string;           // Event image URL
  title_zh: string;
  title_en: string;
  content_zh: string;
  content_en: string;
  speakers?: EventSpeaker[];
  location_zh?: string;    // defaults to IEAS, Academia Sinica when absent
  location_en?: string;
  abstract_zh?: string;    // optional talk abstract, shown on the event page
  abstract_en?: string;
}
```

- [ ] **Step 2: Write failing tests tests/events.test.ts**

```ts
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
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run tests/events.test.ts`
Expected: FAIL — cannot resolve `loader`.

- [ ] **Step 4: Create src/data/events/loader.ts**

```ts
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
```

- [ ] **Step 5: Delete index.ts and fix importers**

```bash
git rm src/data/events/index.ts
```

In `src/data/content.ts`: delete the trailing lines

```ts
// Import events from individual event files
// To add a new event: Create a new .ts file in src/data/events/ using _template.ts
export { POSTS } from './events';
```

In `src/components/Activities.tsx` change `import { Lang, CONTENT, POSTS } from '../data/content';` to `import { Lang, CONTENT } from '../data/content';` and add nothing (POSTS becomes a prop in Task 6; for now also remove the `POSTS.slice` line by replacing `const latestPosts = POSTS.slice(0, 3);` with `const latestPosts: never[] = [];` — Task 6 rewrites this file completely, this just keeps the module compiling).

- [ ] **Step 6: Run tests and build**

Run: `npx vitest run` → Expected: all tests PASS (members + events).
Run: `npm run build` → Expected: succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: glob-based event loader with build-time validation"
```

---

### Task 4: i18n and SEO libraries

**Files:**
- Create: `src/lib/i18n.ts`, `src/lib/seo.ts`, `tests/i18n.test.ts`, `tests/seo.test.ts`

**Interfaces:**
- Consumes: `SITE_URL`, `Locale`, `DEFAULT_LOCALE` (Task 1); `Member`, `MEMBERS` (Task 2); `Event` (Task 3).
- Produces (used by every template task):
  - `localePath(locale: Locale, path: string): string` — `('zh','/event/x/') → '/event/x/'`, `('en','/event/x/') → '/en/event/x/'`
  - `absoluteUrl(locale: Locale, path: string): string`
  - `alternateLocale(locale: Locale): Locale`
  - `metaDescription(text: string, max?: number): string` — strips newlines/HTML breaks, truncates at word boundary ≤155 chars
  - `organizationLd(locale)`, `personLd(member, locale)`, `eventLd(event, locale)`, `breadcrumbLd(items: {name, url}[])` — plain objects ready for `JSON.stringify`

- [ ] **Step 1: Write failing tests**

`tests/i18n.test.ts`:

```ts
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
```

`tests/seo.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/i18n.test.ts tests/seo.test.ts`
Expected: FAIL — modules not found.

- [ ] **Step 3: Create src/lib/i18n.ts**

```ts
import { DEFAULT_LOCALE, SITE_URL, type Locale } from '../config';

export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return locale === DEFAULT_LOCALE ? clean : `/en${clean}`;
}

export function absoluteUrl(locale: Locale, path: string): string {
  return SITE_URL + localePath(locale, path);
}

export function alternateLocale(locale: Locale): Locale {
  return locale === 'zh' ? 'en' : 'zh';
}
```

- [ ] **Step 4: Create src/lib/seo.ts**

```ts
import { SITE_URL, type Locale } from '../config';
import { absoluteUrl } from './i18n';
import type { Event } from '../data/events/types';
import { MEMBERS, type Member } from '../data/members';

const ORG_NAME = { zh: 'AI 治理觀念實驗室', en: 'AI Governance Laboratory' } as const;
const IEAS_NAME = {
  zh: '中央研究院歐美研究所',
  en: 'Institute of European and American Studies, Academia Sinica',
} as const;

function toAbsolute(url: string): string {
  return url.startsWith('http') ? url : SITE_URL + url;
}

export function metaDescription(text: string, max = 155): string {
  const clean = text.replace(/<br\s*\/?>/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ') > 60 ? cut.lastIndexOf(' ') : max - 1) + '…';
}

export function organizationLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: ORG_NAME[locale],
    alternateName: locale === 'zh' ? ORG_NAME.en : ORG_NAME.zh,
    url: `${SITE_URL}/`,
    parentOrganization: {
      '@type': 'Organization',
      name: IEAS_NAME[locale],
      url: 'https://www.ea.sinica.edu.tw/',
    },
  };
}

export function personLd(member: Member, locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: locale === 'zh' ? member.name_zh : member.name_en,
    alternateName: locale === 'zh' ? member.name_en : member.name_zh,
    jobTitle: locale === 'zh' ? member.role_zh : member.role_en,
    description: locale === 'zh' ? member.bio_zh : member.bio_en,
    image: toAbsolute(member.image),
    url: absoluteUrl(locale, `/people/${member.slug}/`),
    sameAs: [member.url],
    affiliation: { '@type': 'Organization', name: IEAS_NAME[locale], url: 'https://www.ea.sinica.edu.tw/' },
  };
}

export function eventLd(event: Event, locale: Locale) {
  const performer = (event.speakers ?? []).map((s) => {
    if (s.member) {
      const m = MEMBERS.find((mm) => mm.slug === s.member);
      if (!m) throw new Error(`eventLd: unknown member slug ${s.member}`);
      return {
        '@type': 'Person',
        name: locale === 'zh' ? m.name_zh : m.name_en,
        url: absoluteUrl(locale, `/people/${m.slug}/`),
      };
    }
    const affiliation = locale === 'zh' ? (s.affiliation_zh ?? s.affiliation_en) : (s.affiliation_en ?? s.affiliation_zh);
    return {
      '@type': 'Person',
      name: (locale === 'zh' ? s.name_zh : s.name_en) ?? s.name_en ?? s.name_zh,
      ...(affiliation ? { affiliation: { '@type': 'Organization', name: affiliation } } : {}),
    };
  });

  const locationName =
    (locale === 'zh' ? event.location_zh : event.location_en) ?? IEAS_NAME[locale];

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: locale === 'zh' ? event.title_zh : event.title_en,
    startDate: event.date,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: toAbsolute(event.image),
    description: metaDescription(locale === 'zh' ? event.content_zh : event.content_en, 300),
    inLanguage: locale === 'zh' ? 'zh-Hant' : 'en',
    url: absoluteUrl(locale, `/event/${event.id}/`),
    location: {
      '@type': 'Place',
      name: locationName,
      address: {
        '@type': 'PostalAddress',
        addressLocality: locale === 'zh' ? '台北' : 'Taipei',
        addressCountry: 'TW',
      },
    },
    organizer: { '@type': 'Organization', name: ORG_NAME[locale], url: `${SITE_URL}/` },
    ...(performer.length ? { performer } : {}),
  };
}

export function breadcrumbLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run` → Expected: all test files PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: i18n path helpers and JSON-LD builders"
```

---

### Task 5: BaseLayout, Navigation, Footer

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/components/Footer.astro`, `src/components/Navigation.tsx`
- Modify: `src/pages/index.astro` (use the layout)

**Interfaces:**
- Consumes: `localePath`, `alternateLocale` (Task 4), `organizationLd` (Task 4), `CONTENT` from `src/data/content.ts`.
- Produces: `BaseLayout.astro` with props `{ locale: Locale; path: string; title: string; description: string; ogImage?: string; jsonLd?: object[] }`. `path` is always the **locale-neutral** path with leading and trailing slash (e.g. `/event/lecture-2026-04-14/`); the layout derives canonical + both hreflang URLs from it. Every template task wraps its content in this layout.

- [ ] **Step 1: Create src/components/Navigation.tsx**

Rewrite of the deleted original (same visual classes; react-router replaced by plain anchors; language toggle links to the same `path` in the other locale):

```tsx
import { useState, useEffect } from 'react';
import { Brain, Globe } from 'lucide-react';
import { CONTENT } from '../data/content';
import { localePath, alternateLocale } from '../lib/i18n';
import type { Locale } from '../config';

interface NavigationProps {
  locale: Locale;
  path: string; // locale-neutral current path, e.g. "/" or "/event/x/"
}

export default function Navigation({ locale, path }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const t = CONTENT[locale].nav;
  const siteName = CONTENT[locale].site.name;
  const home = localePath(locale, '/');
  const isHome = path === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sectionHref = (id: string) => (isHome ? `#${id}` : `${home}#${id}`);
  const linkClass = 'px-3 py-1 text-xs sm:text-sm font-medium rounded-full hover:bg-white/10 transition-colors';

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        className={`
          pointer-events-auto flex items-center gap-2 sm:gap-6 px-4 py-3 sm:px-6 sm:py-4 rounded-full
          backdrop-blur-xl transition-all duration-500 ease-out border border-white/20 shadow-2xl
          ${scrolled ? 'bg-black/80 text-white scale-95' : 'bg-white/80 text-slate-900'}
        `}
      >
        <a href={home} className="flex items-center gap-2 font-bold tracking-tight cursor-pointer mr-2">
          <Brain size={20} className={scrolled ? 'text-blue-400' : 'text-blue-600'} />
          <span className="hidden sm:inline">{siteName}</span>
        </a>

        <div className="w-px h-4 bg-current opacity-20 mx-1 hidden sm:block" />

        <div className="flex gap-1 sm:gap-2">
          <a href={sectionHref('mission')} className={linkClass}>{t.mission}</a>
          <a href={sectionHref('team')} className={linkClass}>{t.team}</a>
          <a href={sectionHref('events')} className={linkClass}>{t.events}</a>
        </div>

        <a
          href={localePath(alternateLocale(locale), path)}
          className={`
            ml-2 p-2 rounded-full transition-transform hover:scale-110 flex items-center gap-1 text-xs font-bold
            ${scrolled ? 'bg-white text-black' : 'bg-black text-white'}
          `}
        >
          <Globe size={14} />
          {locale === 'zh' ? 'EN' : '中'}
        </a>
      </nav>
    </div>
  );
}
```

- [ ] **Step 2: Create src/components/Footer.astro**

Ported from the deleted `App.tsx` footer (markup identical):

```astro
---
import { Brain } from 'lucide-react';
import { CONTENT } from '../data/content';
import type { Locale } from '../config';

interface Props { locale: Locale }
const { locale } = Astro.props;
const t = CONTENT[locale].footer;
const year = new Date().getFullYear();
---
<footer class="bg-slate-900 text-white py-20 px-4 mt-12">
  <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
    <div>
      <div class="flex items-center gap-2 mb-6">
        <Brain className="text-blue-500" />
        <span class="text-xl font-bold">{t.name}</span>
      </div>
      <p class="text-slate-400 max-w-md leading-relaxed text-sm">
        {t.location}
      </p>
    </div>
    <div class="text-sm text-slate-500">
      © {year} IEAS. {t.rights}
    </div>
  </div>
</footer>
```

- [ ] **Step 3: Create src/layouts/BaseLayout.astro**

```astro
---
import '../styles/global.css';
import { SITE_URL, type Locale } from '../config';
import { localePath } from '../lib/i18n';
import { organizationLd } from '../lib/seo';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer.astro';

interface Props {
  locale: Locale;
  path: string;          // locale-neutral, leading + trailing slash
  title: string;
  description: string;
  ogImage?: string;      // absolute URL or site-relative path
  jsonLd?: object[];
}

const { locale, path, title, description, ogImage, jsonLd = [] } = Astro.props;
const canonical = SITE_URL + localePath(locale, path);
const allJsonLd = [organizationLd(locale), ...jsonLd];
const ogImageUrl = ogImage ? (ogImage.startsWith('http') ? ogImage : SITE_URL + ogImage) : undefined;
---
<!doctype html>
<html lang={locale === 'zh' ? 'zh-Hant' : 'en'}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="alternate" hreflang="zh-Hant" href={SITE_URL + localePath('zh', path)} />
    <link rel="alternate" hreflang="en" href={SITE_URL + localePath('en', path)} />
    <link rel="alternate" hreflang="x-default" href={SITE_URL + localePath('zh', path)} />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <link rel="sitemap" href="/sitemap-index.xml" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={locale === 'zh' ? 'AI 治理觀念實驗室' : 'AI Governance Laboratory'} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:locale" content={locale === 'zh' ? 'zh_TW' : 'en_US'} />
    {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
    <meta name="twitter:card" content={ogImageUrl ? 'summary_large_image' : 'summary'} />
    {allJsonLd.map((ld) => (
      <script type="application/ld+json" set:html={JSON.stringify(ld)} />
    ))}
    <meta name="generator" content={Astro.generator} />
  </head>
  <body class="bg-[#FAFAFA] min-h-screen selection:bg-blue-500 selection:text-white font-sans antialiased">
    <Navigation client:load locale={locale} path={path} />
    <slot />
    <Footer locale={locale} />
  </body>
</html>
```

- [ ] **Step 4: Point the placeholder home page at the layout**

Replace `src/pages/index.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { CONTENT } from '../data/content';
const t = CONTENT.zh;
---
<BaseLayout locale="zh" path="/" title={t.site.title} description={t.hero.desc}>
  <main class="pt-32 px-8"><h1 class="text-4xl font-bold">Migration in progress</h1></main>
</BaseLayout>
```

- [ ] **Step 5: Verify build output**

Run: `npm run build && grep -c 'application/ld+json' dist/index.html && grep 'hreflang' dist/index.html`
Expected: build succeeds; at least 1 JSON-LD script; three hreflang links (`zh-Hant`, `en`, `x-default`).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: BaseLayout with canonical/hreflang/OG/JSON-LD, nav and footer"
```

---

### Task 6: Home pages (zh + en)

**Files:**
- Create: `src/components/Hero.astro`, `src/templates/HomePage.astro`, `src/pages/en/index.astro`
- Modify: `src/pages/index.astro`, `src/components/Activities.tsx`, `src/components/Team.tsx`

**Interfaces:**
- Consumes: `BaseLayout` (Task 5), `POSTS` (Task 3), `MEMBERS` (Task 2), `localePath` (Task 4).
- Produces: `HomePage.astro` with props `{ locale: Locale }`. `Activities.tsx` becomes `Activities({ lang, posts })` where `posts` is the pre-sliced latest-3 events array. `Team.tsx` keeps `Team({ lang })`.

- [ ] **Step 1: Create src/components/Hero.astro**

Port of the deleted `Hero.tsx` — identical structure and classes, but the mount animation becomes pure CSS so the hero ships zero JS and is visible without JavaScript (better for crawlers and first paint):

```astro
---
import { ChevronDown } from 'lucide-react';
import { CONTENT } from '../data/content';
import type { Locale } from '../config';

interface Props { locale: Locale }
const { locale } = Astro.props;
const t = CONTENT[locale].hero;
---
<header class="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-20 px-4 overflow-hidden bg-[#FAFAFA]">
  <div class="hero-blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-blue-400/10 rounded-full blur-[120px]" />

  <div class="relative z-10 max-w-5xl text-center">
    <div class="hero-fade hero-delay-1 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-sm font-medium mb-8">
      <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
      {t.label}
    </div>

    <h1 class="hero-fade hero-delay-2 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-slate-900 mb-8">
      {t.title_line1} <br class="hidden md:block" />
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 px-2">
        {t.title_highlight}
      </span>
      {t.title_line2}
    </h1>

    <p class="hero-fade hero-delay-3 text-lg md:text-2xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
      {t.desc}
    </p>
  </div>

  <div class="hero-fade hero-delay-4 absolute bottom-10 flex flex-col items-center gap-2 animate-bounce">
    <span class="text-xs uppercase tracking-widest text-slate-400">{t.scroll}</span>
    <ChevronDown className="text-slate-400" />
  </div>
</header>

<style>
  .hero-blob { animation: blob-in 2s ease-out forwards; }
  @keyframes blob-in {
    from { scale: 0.5; opacity: 0; }
    to { scale: 1; opacity: 1; }
  }
  .hero-fade {
    opacity: 0;
    translate: 0 1rem;
    animation: hero-in 0.7s ease-out forwards;
  }
  .hero-delay-1 { animation-delay: 100ms; }
  .hero-delay-2 { animation-delay: 200ms; }
  .hero-delay-3 { animation-delay: 300ms; }
  .hero-delay-4 { animation-delay: 1000ms; }
  @keyframes hero-in {
    to { opacity: 1; translate: 0 0; }
  }
</style>
```

- [ ] **Step 2: Rewrite src/components/Activities.tsx**

Same markup; react-router `Link` → `<a>`; posts arrive as a prop; hrefs go through `localePath`:

```tsx
import { ArrowRight, Calendar, ChevronRight } from 'lucide-react';
import { CONTENT } from '../data/content';
import type { Locale } from '../config';
import type { Event } from '../data/events/types';
import { localePath } from '../lib/i18n';
import { formatDate } from '../utils/dateFormat';

interface ActivitiesProps {
  lang: Locale;
  posts: Event[]; // latest 3, pre-sliced by the caller
}

export const Activities = ({ lang, posts }: ActivitiesProps) => {
  const t = CONTENT[lang].activities;

  return (
    <section id="events" className="py-24 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-16 text-center">
          {t.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <a
              key={post.id}
              href={localePath(lang, `/event/${post.id}/`)}
              className="group cursor-pointer bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="aspect-square overflow-hidden bg-slate-100 relative">
                <img
                  src={post.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-60"
                  aria-hidden="true"
                />
                <img
                  src={post.image}
                  alt={lang === 'zh' ? post.title_zh : post.title_en}
                  loading="lazy"
                  className="relative w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm uppercase tracking-wide">
                  {post.type}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400">
                  <Calendar size={12} />
                  {formatDate(post.date)}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                  {lang === 'zh' ? post.title_zh : post.title_en}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                  {lang === 'zh' ? post.content_zh : post.content_en}
                </p>
                <div className="flex items-center text-blue-600 text-sm font-bold mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                  {t.read_more} <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={localePath(lang, '/event/')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full hover:bg-blue-600 transition-all duration-300 font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105"
          >
            {lang === 'zh' ? '查看所有活動' : 'View All Events'}
            <ChevronRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 3: Modify src/components/Team.tsx**

Three changes, everything else (modal, observer, collaborators) untouched:

1. Add imports: `import { localePath } from '../lib/i18n';` and `import type { Locale } from '../config';`. Change the content import to `import { CONTENT, COLLABORATORS } from '../data/content';` (drop `Lang`) and replace `lang: Lang` with `lang: Locale` in the component signature (the types are identical string unions).
2. Member cards link internally instead of to the external profile. Replace the card's `<a>` opening attributes:

```tsx
<a
  key={member.id}   // ← change to key={member.slug}
  href={member.url}
  target="_blank"
  rel="noopener noreferrer"
```

with:

```tsx
<a
  key={member.slug}
  href={localePath(lang, `/people/${member.slug}/`)}
```

(Remove `target`/`rel`. Keep the `ExternalLink` icon import — it is still used in the collaborators modal; the small `<ExternalLink size={12} …/>` next to the member name in the hover overlay should be removed since the link is now internal.)

3. After the closing `</div>` of the members grid (after the "Join Us" card `</div>` and the grid's `</div>`), add a view-all link so `/people/` is linked from the home page:

```tsx
<div className="mt-8 text-center">
  <a
    href={localePath(lang, '/people/')}
    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
  >
    {lang === 'zh' ? '查看所有成員 →' : 'View all members →'}
  </a>
</div>
```

Also in `src/components/Mission.tsx` and `src/components/ui/*`: change nothing except, in `Mission.tsx`, replace `import { Lang, CONTENT } from '../data/content';` + `React.FC<{ lang: Lang }>` with the same `Locale` treatment only **if** the build complains about `React` namespace; otherwise leave `Mission.tsx` completely untouched.

- [ ] **Step 4: Create src/templates/HomePage.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import { Activities } from '../components/Activities';
import { Mission } from '../components/Mission';
import { Team } from '../components/Team';
import { CONTENT } from '../data/content';
import { POSTS } from '../data/events/loader';
import type { Locale } from '../config';

interface Props { locale: Locale }
const { locale } = Astro.props;
const t = CONTENT[locale];
const latest = POSTS.slice(0, 3);
---
<BaseLayout
  locale={locale}
  path="/"
  title={t.site.title}
  description={t.hero.desc}
>
  <main>
    <Hero locale={locale} />
    <Activities lang={locale} posts={latest} />
    <Mission client:visible lang={locale} />
    <Team client:visible lang={locale} />
  </main>
</BaseLayout>
```

(`Activities` has no `client:` directive — it renders to static HTML with zero JS. `Mission` and `Team` hydrate on scroll for their modals/animations.)

- [ ] **Step 5: Create the two home pages**

`src/pages/index.astro`:

```astro
---
import HomePage from '../templates/HomePage.astro';
---
<HomePage locale="zh" />
```

`src/pages/en/index.astro`:

```astro
---
import HomePage from '../../templates/HomePage.astro';
---
<HomePage locale="en" />
```

- [ ] **Step 6: Verify build output**

Run:

```bash
npm run build
grep -o '<title>[^<]*</title>' dist/index.html dist/en/index.html
grep -c 'id="team"' dist/index.html
grep -c '/people/' dist/index.html
```

Expected: zh title `AI 治理觀念實驗室 - 中研院歐美所` and en title `AI Governance Laboratory - IEAS, Academia Sinica`; team section present in static HTML (proves the island server-renders); at least 8 `/people/` links (7 member cards + view-all).

- [ ] **Step 7: Run tests**

Run: `npx vitest run` → Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: static home pages in zh and en"
```

---

### Task 7: Event list and detail pages (zh + en)

**Files:**
- Create: `src/templates/EventListPage.astro`, `src/templates/EventDetailPage.astro`, `src/pages/event/index.astro`, `src/pages/event/[id].astro`, `src/pages/en/event/index.astro`, `src/pages/en/event/[id].astro`

**Interfaces:**
- Consumes: `BaseLayout`, `POSTS`, `eventLd`, `breadcrumbLd`, `metaDescription`, `localePath`, `absoluteUrl`, `MEMBERS`, `formatDate`.
- Produces: URLs `/event/`, `/event/<id>/`, `/en/event/`, `/en/event/<id>/` for every event in `POSTS`.

- [ ] **Step 1: Create src/templates/EventListPage.astro**

Port of the deleted `EventsPage.tsx` (identical classes, `Link`→`<a>`, lucide icons rendered statically):

```astro
---
import { ArrowLeft, Calendar } from 'lucide-react';
import BaseLayout from '../layouts/BaseLayout.astro';
import { CONTENT } from '../data/content';
import { POSTS } from '../data/events/loader';
import { localePath, absoluteUrl } from '../lib/i18n';
import { breadcrumbLd } from '../lib/seo';
import { formatDate } from '../utils/dateFormat';
import type { Locale } from '../config';

interface Props { locale: Locale }
const { locale } = Astro.props;
const t = CONTENT[locale].activities;
const zh = locale === 'zh';

const postsByYear = POSTS.reduce<Record<string, typeof POSTS>>((acc, post) => {
  (acc[post.year] ??= []).push(post);
  return acc;
}, {});
const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

const title = zh
  ? `學術活動 - AI 治理觀念實驗室`
  : `Events - AI Governance Laboratory`;
const description = zh
  ? `AI 治理觀念實驗室的演講、研討會與工作坊，共 ${POSTS.length} 場活動。`
  : `Lectures, conferences, and workshops of the AI Governance Laboratory — ${POSTS.length} events.`;
const jsonLd = [
  breadcrumbLd([
    { name: zh ? '首頁' : 'Home', url: absoluteUrl(locale, '/') },
    { name: t.title, url: absoluteUrl(locale, '/event/') },
  ]),
];
---
<BaseLayout locale={locale} path="/event/" title={title} description={description} jsonLd={jsonLd}>
  <div class="min-h-screen bg-[#FAFAFA] pt-24">
    <div class="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <div class="mb-12">
        <a
          href={localePath(locale, '/') + '#events'}
          class="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span class="text-sm font-medium">{zh ? '返回首頁' : 'Back to Home'}</span>
        </a>
        <h1 class="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-4">
          {t.title}
        </h1>
        <p class="text-slate-500 text-lg">
          {zh ? `共 ${POSTS.length} 場活動` : `${POSTS.length} Events`}
        </p>
      </div>

      <div class="space-y-16">
        {years.map((year) => (
          <div>
            <div class="sticky top-20 bg-[#FAFAFA]/90 backdrop-blur-sm py-3 mb-8 border-b border-slate-200 z-10">
              <h2 class="text-2xl font-bold text-slate-900">{year}</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {postsByYear[year].map((post) => (
                <a
                  href={localePath(locale, `/event/${post.id}/`)}
                  class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
                >
                  <div class="aspect-square overflow-hidden bg-slate-100 relative">
                    <img
                      src={post.image}
                      alt=""
                      loading="lazy"
                      class="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-60"
                      aria-hidden="true"
                    />
                    <img
                      src={post.image}
                      alt={zh ? post.title_zh : post.title_en}
                      loading="lazy"
                      class="relative w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div class="p-6">
                    <div class="flex items-center gap-3 mb-3">
                      <span class="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                        {post.type}
                      </span>
                      <div class="flex items-center gap-1 text-slate-500 text-xs">
                        <Calendar size={14} />
                        <span>{formatDate(post.date)}</span>
                      </div>
                    </div>
                    <h3 class="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                      {zh ? post.title_zh : post.title_en}
                    </h3>
                    <p class="text-sm text-slate-600 line-clamp-2">
                      {zh ? post.content_zh : post.content_en}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Create src/templates/EventDetailPage.astro**

Port of the deleted `EventDetailPage.tsx`, plus speakers / location / abstract rendering and Event JSON-LD:

```astro
---
import { ArrowLeft, Calendar, MapPin, User } from 'lucide-react';
import BaseLayout from '../layouts/BaseLayout.astro';
import { POSTS } from '../data/events/loader';
import { MEMBERS } from '../data/members';
import { localePath, absoluteUrl } from '../lib/i18n';
import { eventLd, breadcrumbLd, metaDescription } from '../lib/seo';
import { formatDate } from '../utils/dateFormat';
import type { Locale } from '../config';
import type { Event } from '../data/events/types';

interface Props { locale: Locale; post: Event }
const { locale, post } = Astro.props;
const zh = locale === 'zh';

const title = `${zh ? post.title_zh : post.title_en} - ${zh ? 'AI 治理觀念實驗室' : 'AI Governance Laboratory'}`;
const description = metaDescription(zh ? post.content_zh : post.content_en);
const relatedPosts = POSTS.filter((p) => p.year === post.year && p.id !== post.id).slice(0, 3);

const speakers = (post.speakers ?? []).map((s) => {
  if (s.member) {
    const m = MEMBERS.find((mm) => mm.slug === s.member)!;
    return { name: zh ? m.name_zh : m.name_en, href: localePath(locale, `/people/${m.slug}/`), affiliation: undefined as string | undefined };
  }
  return {
    name: (zh ? s.name_zh : s.name_en) ?? s.name_en ?? s.name_zh ?? '',
    href: undefined as string | undefined,
    affiliation: zh ? (s.affiliation_zh ?? s.affiliation_en) : (s.affiliation_en ?? s.affiliation_zh),
  };
});
const location = zh ? post.location_zh : post.location_en;
const abstract = zh ? post.abstract_zh : post.abstract_en;

const jsonLd = [
  eventLd(post, locale),
  breadcrumbLd([
    { name: zh ? '首頁' : 'Home', url: absoluteUrl(locale, '/') },
    { name: zh ? '學術活動' : 'Events', url: absoluteUrl(locale, '/event/') },
    { name: zh ? post.title_zh : post.title_en, url: absoluteUrl(locale, `/event/${post.id}/`) },
  ]),
];
---
<BaseLayout
  locale={locale}
  path={`/event/${post.id}/`}
  title={title}
  description={description}
  ogImage={post.image}
  jsonLd={jsonLd}
>
  <div class="min-h-screen bg-[#FAFAFA] pt-24">
    <div class="max-w-4xl mx-auto px-4 md:px-8 py-12">
      <a
        href={localePath(locale, '/event/')}
        class="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-8"
      >
        <ArrowLeft size={20} />
        <span class="text-sm font-medium">{zh ? '返回活動列表' : 'Back to Events'}</span>
      </a>

      <div class="bg-white rounded-3xl overflow-hidden shadow-lg mb-8">
        <div class="aspect-[21/9] overflow-hidden bg-slate-100 relative">
          <img
            src={post.image}
            alt=""
            class="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-60"
            aria-hidden="true"
          />
          <img
            src={post.image}
            alt={zh ? post.title_zh : post.title_en}
            class="relative w-full h-full object-contain"
          />
        </div>

        <div class="p-8 md:p-12">
          <div class="flex flex-wrap items-center gap-4 mb-6">
            <span class="px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold">
              {post.type}
            </span>
            <div class="flex items-center gap-2 text-slate-500 text-sm">
              <Calendar size={16} />
              <span>{formatDate(post.date)}</span>
            </div>
            {location && (
              <div class="flex items-center gap-2 text-slate-500 text-sm">
                <MapPin size={16} />
                <span>{location}</span>
              </div>
            )}
          </div>

          <h1 class="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
            {zh ? post.title_zh : post.title_en}
          </h1>

          {speakers.length > 0 && (
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 text-sm text-slate-600">
              <User size={16} className="text-slate-400" />
              {speakers.map((s) => (
                s.href
                  ? <a href={s.href} class="font-semibold text-blue-600 hover:text-blue-700 transition-colors">{s.name}</a>
                  : <span class="font-semibold">{s.name}{s.affiliation ? `（${s.affiliation}）` : ''}</span>
              ))}
            </div>
          )}

          <div class="prose prose-slate max-w-none">
            <p
              class="text-lg text-slate-700 leading-relaxed"
              set:html={(zh ? post.content_zh : post.content_en).replace(/\n/g, '<br />')}
            />
          </div>

          {abstract && (
            <div class="mt-8 pt-8 border-t border-slate-100">
              <h2 class="text-xl font-bold text-slate-900 mb-4">{zh ? '摘要' : 'Abstract'}</h2>
              <p
                class="text-slate-700 leading-relaxed"
                set:html={abstract.replace(/\n/g, '<br />')}
              />
            </div>
          )}
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <div class="mt-16">
          <h2 class="text-2xl font-bold text-slate-900 mb-6">
            {zh ? '其他活動' : 'Other Events'}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <a
                href={localePath(locale, `/event/${relatedPost.id}/`)}
                class="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100"
              >
                <div class="aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={relatedPost.image}
                    alt={zh ? relatedPost.title_zh : relatedPost.title_en}
                    loading="lazy"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div class="p-4">
                  <span class="px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                    {relatedPost.type}
                  </span>
                  <h3 class="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-2 line-clamp-2">
                    {zh ? relatedPost.title_zh : relatedPost.title_en}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Create the four page files**

`src/pages/event/index.astro`:

```astro
---
import EventListPage from '../../templates/EventListPage.astro';
---
<EventListPage locale="zh" />
```

`src/pages/en/event/index.astro`:

```astro
---
import EventListPage from '../../../templates/EventListPage.astro';
---
<EventListPage locale="en" />
```

`src/pages/event/[id].astro`:

```astro
---
import { POSTS } from '../../data/events/loader';
import EventDetailPage from '../../templates/EventDetailPage.astro';

export function getStaticPaths() {
  return POSTS.map((post) => ({ params: { id: post.id }, props: { post } }));
}
const { post } = Astro.props;
---
<EventDetailPage locale="zh" post={post} />
```

`src/pages/en/event/[id].astro`:

```astro
---
import { POSTS } from '../../../data/events/loader';
import EventDetailPage from '../../../templates/EventDetailPage.astro';

export function getStaticPaths() {
  return POSTS.map((post) => ({ params: { id: post.id }, props: { post } }));
}
const { post } = Astro.props;
---
<EventDetailPage locale="en" post={post} />
```

- [ ] **Step 4: Verify build output**

Run:

```bash
npm run build
ls dist/event | head -20
test -f dist/event/lecture-2026-04-14/index.html && echo zh-ok
test -f dist/en/event/lecture-2026-04-14/index.html && echo en-ok
grep -o '"@type":"Event"' dist/event/lecture-2026-04-14/index.html
grep -o '<link rel="canonical"[^>]*>' dist/en/event/lecture-2026-04-14/index.html
```

Expected: a directory per event id in both `dist/event/` and `dist/en/event/`; `zh-ok` and `en-ok`; Event JSON-LD present; en canonical is `https://ai-gov-lab-ieas.github.io/en/event/lecture-2026-04-14/`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: static event list and detail pages in zh and en"
```

---

### Task 8: Tag existing events with speakers; update authoring docs

**Files:**
- Modify: all 13 files `src/data/events/{lecture,conf,workshop}-*.ts`, `src/data/events/_template.ts`, `HOW_TO_ADD_EVENTS.md`

**Interfaces:**
- Consumes: `EventSpeaker` shape (Task 3), member slugs (Task 2).
- Produces: `speakers` arrays on existing events, which Task 9's member pages list via `eventsBySpeaker`.

- [ ] **Step 1: Extract speakers from each event's content**

For each of the 13 event files: read `content_zh`/`content_en`, identify named speakers/hosts (look for 主講人, 講者, 主持人, "speaker", "lecture by", "presented by", and names in titles). Apply these rules:

- Speaker is one of the 7 lab members (match against `name_zh`/`name_en` in `src/data/members.ts`) → `{ member: '<slug>' }`.
- External speaker with an identifiable name → `{ name_zh: '...', name_en: '...' }` plus `affiliation_zh`/`affiliation_en` when the content states one. If only one language's name appears, use it for both fields.
- No individual speaker identifiable (e.g. multi-speaker conferences where the content names no one) → leave `speakers` out entirely. Do not guess.

Add the `speakers` field after `content_en` in each file that gets one. Example shape:

```ts
  content_en: "…",

  speakers: [
    { member: "tzu-wei-hung" },
    { name_zh: "李韶曼", name_en: "Shao-Man Lee", affiliation_zh: "國立成功大學", affiliation_en: "National Cheng Kung University" },
  ],
```

- [ ] **Step 2: Verify validation catches mistakes**

Run: `npx vitest run tests/events.test.ts && npm run build`
Expected: PASS / build succeeds. (A typo'd slug fails the build with the "unknown member slug" error — that's the guardrail working.)

- [ ] **Step 3: Check the rendered output**

Run: `npm run build && grep -l 'performer' dist/event/*/index.html | head`
Expected: every event that got a `speakers` array lists a `performer` in its JSON-LD.

- [ ] **Step 4: Update _template.ts**

After the `content_en` entry in `src/data/events/_template.ts`, add:

```ts
  // OPTIONAL: Speakers. Lab members by slug (see src/data/members.ts),
  // external speakers by name. A wrong slug fails the build on purpose.
  // speakers: [
  //   { member: "tzu-wei-hung" },
  //   { name_zh: "王小明", name_en: "Xiao-Ming Wang", affiliation_en: "NTU" },
  // ],

  // OPTIONAL: Venue (defaults to IEAS, Academia Sinica in structured data)
  // location_zh: "中央研究院歐美研究所",
  // location_en: "IEAS, Academia Sinica",

  // OPTIONAL: Talk abstract, shown on the event page under the description
  // abstract_zh: "...",
  // abstract_en: "...",
```

- [ ] **Step 5: Update HOW_TO_ADD_EVENTS.md**

Rewrite the "add the event" steps: creating the file from `_template.ts` is now the **only** step (auto-discovery; no index.ts). Document the three optional field groups from Step 4, note that member slugs are validated at build time, and note the event page appears at `/event/<id>/` and `/en/event/<id>/`. Also state: prefer local images in `public/images/events/` over remote Unsplash URLs.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: tag existing events with speakers, update authoring docs"
```

---

### Task 9: People pages (zh + en)

**Files:**
- Create: `src/templates/PeopleListPage.astro`, `src/templates/PersonPage.astro`, `src/pages/people/index.astro`, `src/pages/people/[slug].astro`, `src/pages/en/people/index.astro`, `src/pages/en/people/[slug].astro`

**Interfaces:**
- Consumes: `MEMBERS`, `eventsBySpeaker` (Task 3), `personLd`, `breadcrumbLd` (Task 4), `BaseLayout`.
- Produces: URLs `/people/`, `/people/<slug>/` and en mirrors for all 7 members.

- [ ] **Step 1: Create src/templates/PeopleListPage.astro**

Card design reuses the Team-section card idiom (photo, name, role):

```astro
---
import { ArrowLeft } from 'lucide-react';
import BaseLayout from '../layouts/BaseLayout.astro';
import { CONTENT } from '../data/content';
import { MEMBERS } from '../data/members';
import { localePath, absoluteUrl } from '../lib/i18n';
import { breadcrumbLd } from '../lib/seo';
import type { Locale } from '../config';

interface Props { locale: Locale }
const { locale } = Astro.props;
const zh = locale === 'zh';
const t = CONTENT[locale].team;

const title = zh ? '參與成員 - AI 治理觀念實驗室' : 'Team - AI Governance Laboratory';
const description = zh
  ? 'AI 治理觀念實驗室成員：中央研究院跨領域研究人員，涵蓋法律、哲學、倫理學與資訊科學。'
  : 'Members of the AI Governance Laboratory — interdisciplinary researchers at Academia Sinica across law, philosophy, ethics, and computer science.';
const jsonLd = [
  breadcrumbLd([
    { name: zh ? '首頁' : 'Home', url: absoluteUrl(locale, '/') },
    { name: t.title, url: absoluteUrl(locale, '/people/') },
  ]),
];
---
<BaseLayout locale={locale} path="/people/" title={title} description={description} jsonLd={jsonLd}>
  <div class="min-h-screen bg-[#FAFAFA] pt-24">
    <div class="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <div class="mb-12">
        <a
          href={localePath(locale, '/') + '#team'}
          class="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span class="text-sm font-medium">{zh ? '返回首頁' : 'Back to Home'}</span>
        </a>
        <h1 class="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-4">{t.title}</h1>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {MEMBERS.map((member) => (
          <a
            href={localePath(locale, `/people/${member.slug}/`)}
            class="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 block"
          >
            <div class="aspect-[3/4] overflow-hidden relative">
              <div class="absolute inset-0">
                <img src={member.image} alt="" loading="lazy" class="w-full h-full object-cover blur-2xl scale-110" />
              </div>
              <img
                src={member.image}
                alt={zh ? member.name_zh : member.name_en}
                loading="lazy"
                class="w-full h-full object-contain relative z-10 transition-all duration-700 group-hover:scale-105"
              />
            </div>
            <div class="p-4">
              <h2 class="text-slate-900 font-bold text-sm leading-tight group-hover:text-blue-600 transition-colors">
                {zh ? member.name_zh : member.name_en}
              </h2>
              <p class="text-slate-500 text-xs mt-1">{zh ? member.role_zh : member.role_en}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Create src/templates/PersonPage.astro**

```astro
---
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react';
import BaseLayout from '../layouts/BaseLayout.astro';
import { MEMBERS, type Member } from '../data/members';
import { eventsBySpeaker } from '../data/events/loader';
import { localePath, absoluteUrl } from '../lib/i18n';
import { personLd, breadcrumbLd, metaDescription } from '../lib/seo';
import { formatDate } from '../utils/dateFormat';
import type { Locale } from '../config';

interface Props { locale: Locale; member: Member }
const { locale, member } = Astro.props;
const zh = locale === 'zh';

const name = zh ? member.name_zh : member.name_en;
const role = zh ? member.role_zh : member.role_en;
const bio = zh ? member.bio_zh : member.bio_en;
const events = eventsBySpeaker(member.slug);

const title = `${name} - ${zh ? 'AI 治理觀念實驗室' : 'AI Governance Laboratory'}`;
const description = metaDescription(bio);
const jsonLd = [
  personLd(member, locale),
  breadcrumbLd([
    { name: zh ? '首頁' : 'Home', url: absoluteUrl(locale, '/') },
    { name: zh ? '參與成員' : 'Team', url: absoluteUrl(locale, '/people/') },
    { name, url: absoluteUrl(locale, `/people/${member.slug}/`) },
  ]),
];
---
<BaseLayout
  locale={locale}
  path={`/people/${member.slug}/`}
  title={title}
  description={description}
  ogImage={member.image}
  jsonLd={jsonLd}
>
  <div class="min-h-screen bg-[#FAFAFA] pt-24">
    <div class="max-w-4xl mx-auto px-4 md:px-8 py-12">
      <a
        href={localePath(locale, '/people/')}
        class="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-8"
      >
        <ArrowLeft size={20} />
        <span class="text-sm font-medium">{zh ? '返回成員列表' : 'Back to Team'}</span>
      </a>

      <div class="bg-white rounded-3xl overflow-hidden shadow-lg mb-8">
        <div class="p-8 md:p-12 flex flex-col sm:flex-row gap-8">
          <div class="w-40 sm:w-48 flex-shrink-0">
            <div class="aspect-[3/4] rounded-2xl overflow-hidden relative bg-slate-100">
              <img src={member.image} alt="" class="absolute inset-0 w-full h-full object-cover blur-2xl scale-110" />
              <img src={member.image} alt={name} class="relative z-10 w-full h-full object-contain" />
            </div>
          </div>
          <div class="flex-1">
            <h1 class="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-1">{name}</h1>
            <p class="text-slate-400 text-lg mb-2">{zh ? member.name_en : member.name_zh}</p>
            <p class="text-blue-600 font-medium mb-6">{role}</p>
            <p class="text-slate-700 leading-relaxed mb-6">{bio}</p>
            <a
              href={member.url}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ExternalLink size={16} />
              {zh ? '官方個人頁面' : 'Official profile'}
            </a>
          </div>
        </div>
      </div>

      {events.length > 0 && (
        <div class="mt-16">
          <h2 class="text-2xl font-bold text-slate-900 mb-6">
            {zh ? '相關活動' : 'Events'}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((post) => (
              <a
                href={localePath(locale, `/event/${post.id}/`)}
                class="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100"
              >
                <div class="aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={post.image}
                    alt={zh ? post.title_zh : post.title_en}
                    loading="lazy"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div class="p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">{post.type}</span>
                    <span class="flex items-center gap-1 text-slate-500 text-xs">
                      <Calendar size={12} />
                      {formatDate(post.date)}
                    </span>
                  </div>
                  <h3 class="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {zh ? post.title_zh : post.title_en}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
</BaseLayout>
```

Note on `astro:assets`: member photos live in `public/images/team/` and are referenced by string paths shared with the Team React island, so they are served as-is. Optimizing them via `astro:assets` would require moving them into `src/assets/` and threading `getImage()` URLs into the island as props — deferred as YAGNI for 7 small photos; `loading="lazy"` and static HTML already cover the Core Web Vitals goal. If Lighthouse in Task 10 flags image weight, revisit then.

- [ ] **Step 3: Create the four page files**

`src/pages/people/index.astro`:

```astro
---
import PeopleListPage from '../../templates/PeopleListPage.astro';
---
<PeopleListPage locale="zh" />
```

`src/pages/en/people/index.astro`:

```astro
---
import PeopleListPage from '../../../templates/PeopleListPage.astro';
---
<PeopleListPage locale="en" />
```

`src/pages/people/[slug].astro`:

```astro
---
import { MEMBERS } from '../../data/members';
import PersonPage from '../../templates/PersonPage.astro';

export function getStaticPaths() {
  return MEMBERS.map((member) => ({ params: { slug: member.slug }, props: { member } }));
}
const { member } = Astro.props;
---
<PersonPage locale="zh" member={member} />
```

`src/pages/en/people/[slug].astro`:

```astro
---
import { MEMBERS } from '../../../data/members';
import PersonPage from '../../../templates/PersonPage.astro';

export function getStaticPaths() {
  return MEMBERS.map((member) => ({ params: { slug: member.slug }, props: { member } }));
}
const { member } = Astro.props;
---
<PersonPage locale="en" member={member} />
```

- [ ] **Step 4: Verify build output**

Run:

```bash
npm run build
ls dist/people dist/en/people
grep -o '"@type":"Person"' dist/people/tzu-wei-hung/index.html
grep -o 'sameAs' dist/en/people/chih-hsing-ho/index.html
```

Expected: 7 member directories + index in both locales; Person JSON-LD with sameAs present.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: member profile pages with Person structured data"
```

---

### Task 10: 404, robots.txt, deploy workflow, final verification

**Files:**
- Create: `src/pages/404.astro`, `public/robots.txt`, `docs/SEO.md`
- Modify: `.github/workflows/deploy.yml`, `README.md`

- [ ] **Step 1: Create src/pages/404.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  locale="zh"
  path="/404/"
  title="404 - AI 治理觀念實驗室"
  description="Page not found"
>
  <meta slot="head" name="robots" content="noindex" />
  <main class="min-h-screen bg-[#FAFAFA] pt-24 flex items-center justify-center px-4">
    <div class="text-center">
      <h1 class="text-7xl font-bold text-slate-900 tracking-tight mb-4">404</h1>
      <p class="text-slate-500 mb-2">找不到這個頁面。</p>
      <p class="text-slate-500 mb-8">This page could not be found.</p>
      <div class="flex items-center justify-center gap-4">
        <a href="/" class="px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-blue-600 transition-colors font-bold text-sm">回首頁 / Home</a>
        <a href="/event/" class="px-6 py-3 border border-slate-300 text-slate-700 rounded-full hover:border-blue-600 hover:text-blue-600 transition-colors font-bold text-sm">學術活動 / Events</a>
      </div>
    </div>
  </main>
</BaseLayout>
```

BaseLayout has no named `head` slot — add one line to `src/layouts/BaseLayout.astro` inside `<head>`, just before `</head>`:

```astro
    <slot name="head" />
```

- [ ] **Step 2: Create public/robots.txt**

```
User-agent: *
Allow: /

Sitemap: https://ai-gov-lab-ieas.github.io/sitemap-index.xml
```

- [ ] **Step 3: Update .github/workflows/deploy.yml**

In the `build` job, after the "Install dependencies" step, insert a test step, and the Build step stays `npm run build` (now Astro):

```yaml
      - name: Test
        run: npm test

      - name: Build
        run: npm run build
```

(Remove the now-meaningless `env: NODE_ENV: production` from the Build step. Everything else — Pages setup, artifact upload of `./dist`, deploy job — is unchanged.)

- [ ] **Step 4: Write docs/SEO.md**

Contents (write it out in full):

- **After each deploy nothing is needed** — the sitemap regenerates automatically.
- **One-time setup (site owner):** verify the site in Google Search Console (URL-prefix property `https://ai-gov-lab-ieas.github.io/`, verification via the HTML-tag method: paste the given meta tag into `src/layouts/BaseLayout.astro`'s head, deploy, verify). Then submit `https://ai-gov-lab-ieas.github.io/sitemap-index.xml` under Sitemaps. Repeat in Bing Webmaster Tools (can import from Search Console).
- **Validating structured data:** paste any event or member URL into https://search.google.com/test/rich-results.
- **How SEO metadata flows:** one table — page type → title/description/JSON-LD source file.
- **Backlink note:** Academia Sinica already links to the site; when new member or event pages matter, deep links to those specific URLs from institutional pages help them rank individually.

- [ ] **Step 5: Update README.md**

Replace stack references (Vite SPA → Astro): dev/build/test commands, note the URL scheme (`/` zh, `/en/` en), pointer to `HOW_TO_ADD_EVENTS.md` and `docs/SEO.md`.

- [ ] **Step 6: Full verification pass**

```bash
npm test
npm run build
# config consistency
grep -o "https://ai-gov-lab-ieas.github.io" astro.config.mjs src/config.ts
# sitemap covers all page types in both locales
test -f dist/sitemap-index.xml && echo sitemap-ok
grep -o '<loc>[^<]*</loc>' dist/sitemap-0.xml | grep -c '/en/'
grep -o '<loc>[^<]*</loc>' dist/sitemap-0.xml | wc -l
# expected total: 2 × (1 home + 1 events + 13 event details + 1 people + 7 members) = 46 (+404)
# robots + 404
test -f dist/robots.txt && test -f dist/404.html && echo infra-ok
grep -c 'noindex' dist/404.html
# hreflang reciprocity spot-check
grep 'hreflang' dist/event/lecture-2026-04-14/index.html
grep 'hreflang' dist/en/event/lecture-2026-04-14/index.html   # must reference the same pair
# old URL shape still resolves (directory index exists for the un-trailing-slash path)
test -d dist/event/lecture-2025-12-09 && echo old-urls-ok
```

Then run the preview server and click through:

```bash
npm run preview &
sleep 2
for p in / /en/ /event/ /en/event/ /event/lecture-2026-04-14/ /people/ /people/tzu-wei-hung/ /en/people/tzu-wei-hung/ /nonexistent; do
  echo "$p -> $(curl -s -o /dev/null -w '%{http_code}' http://localhost:4321$p)"; done
kill %1
```

Expected: 200 for all real pages, 404 for `/nonexistent`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: 404 page, robots.txt, sitemap docs, CI test step"
```

- [ ] **Step 8: Human review checklist (present to the user)**

Flag for the user before merge:

1. Review the 7 drafted bios in `src/data/members.ts` (accuracy is theirs to confirm).
2. Review the speaker tags added to the 13 event files.
3. Visually compare `npm run preview` against the live site (design must be unchanged).
4. Optional but recommended: run Lighthouse against the preview (`npx lighthouse http://localhost:4321/ --only-categories=seo,performance --chrome-flags="--headless"` — or Chrome DevTools > Lighthouse) on `/`, one event page, and one member page. Expect SEO ≈ 100; if performance flags image weight, revisit the `astro:assets` deferral noted in Task 9.
5. After merge + deploy: do the one-time Search Console setup in `docs/SEO.md`, and validate one event URL and one member URL at https://search.google.com/test/rich-results.
