# Per-Page Dedicated SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every page carries deliberately tuned SEO metadata — hand-optimized copy for static pages, optional per-event/member overrides, exhaustive OG/Twitter tags, a default share card, and a branded favicon — with all tag emission centralized in `BaseLayout.astro`.

**Architecture:** A `PAGE_SEO` registry (`src/data/pageSeo.ts`) holds tuned copy for static pages; an optional `seo` override block on `Event`/`Member` records feeds detail pages, JSON-LD, and Atom summaries via pure resolver functions in `src/lib/seo.ts`; `BaseLayout.astro` remains the single tag emitter, gaining `ogType`/`publishedTime`/`profileName`/`ogImageAlt` props and a site-wide default OG image fallback.

**Tech Stack:** Astro 5 (static output), TypeScript, Vitest (unit + built-`dist/` regex tests), sharp (already a dependency — used once by a throwaway asset-generation script).

**Spec:** `docs/superpowers/specs/2026-07-17-per-page-seo-design.md`

## Global Constraints

- CLAUDE.md invariants all hold; the load-bearing ones here:
  - #3: never derive feed/entry `<updated>` from build time.
  - #4: summaries go through `metaDescription()`; overrides replace its *output*, not its rule — markdown mirrors and Atom `<content>` are untouched by `seo` overrides.
  - #6: `SITE_SUFFIX_EN` / `SITE_NAME_BILINGUAL_EN` from `src/lib/seo.ts` are the only brand strings; never inline new EN brand literals.
  - #8: a new event/member requires only its data file — the `seo` block is optional everywhere.
  - #9: no new endpoint routes are added, so `README.md`'s route table does not change.
  - #10: every commit body ends with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- No `<meta name="keywords">`. No separate `<Seo>` component. No build-pipeline changes.
- `og:image:width`/`og:image:height` (1200/630) are emitted **only** when the default card is used — never assert dimensions for event/member photos.
- All new shared functions get Vitest coverage; `.astro` wrappers are covered by built-`dist/` tests in the existing `tests/baseLayout.test.ts` style.
- Test commands: `npx vitest run <file>` for a single file, `npm test` for the suite. Built-HTML tests read `dist/`; after changing any `.astro` file run `rm -rf dist && npm run build` before them.

---

### Task 1: `SeoOverride` type + resolver functions in `src/lib/seo.ts`

**Files:**
- Modify: `src/lib/seo.ts` (append after `metaDescription`, around line 38)
- Modify: `src/data/events/types.ts` (add `seo?` to `Event`)
- Modify: `src/data/members.ts` (add `seo?` to `Member` interface only — no member data changes)
- Test: `tests/seo.test.ts`

**Interfaces:**
- Consumes: existing `metaDescription(text, max)`, `Event`, `Member`, `Locale`.
- Produces:
  - `interface SeoOverride { title_zh?; title_en?; description_zh?; description_en?; ogImageAlt_zh?; ogImageAlt_en?: string }` (exported from `src/lib/seo.ts`)
  - `resolvePageSeo(args: { seo?: SeoOverride; locale: Locale; fallbackTitle: string; fallbackDescription: string; fallbackOgImageAlt: string }): { title: string; description: string; ogImageAlt: string }` — `title` is the page-name part only; callers append the brand suffix.
  - `eventDescription(event: Event, locale: Locale, max: number): string` — override verbatim if present, else `metaDescription(content, max)`.
  - `Event.seo?: SeoOverride`, `Member.seo?: SeoOverride`.

- [ ] **Step 1: Write the failing tests**

Append to `tests/seo.test.ts` (it already imports `metaDescription` and defines the `event` fixture at the top — extend the import line to add `resolvePageSeo, eventDescription`):

```ts
describe('resolvePageSeo', () => {
  const fallbacks = { fallbackTitle: 'T', fallbackDescription: 'D', fallbackOgImageAlt: 'A' };

  it('passes fallbacks through when no seo block exists', () => {
    expect(resolvePageSeo({ locale: 'zh', ...fallbacks }))
      .toEqual({ title: 'T', description: 'D', ogImageAlt: 'A' });
  });

  it('applies a full override per locale', () => {
    const seo = {
      title_zh: '標題', title_en: 'Title',
      description_zh: '描述', description_en: 'Desc',
      ogImageAlt_zh: '圖', ogImageAlt_en: 'Alt',
    };
    expect(resolvePageSeo({ seo, locale: 'en', ...fallbacks }))
      .toEqual({ title: 'Title', description: 'Desc', ogImageAlt: 'Alt' });
    expect(resolvePageSeo({ seo, locale: 'zh', ...fallbacks }))
      .toEqual({ title: '標題', description: '描述', ogImageAlt: '圖' });
  });

  it('mixes a partial override with fallbacks', () => {
    expect(resolvePageSeo({ seo: { description_en: 'Desc' }, locale: 'en', ...fallbacks }))
      .toEqual({ title: 'T', description: 'Desc', ogImageAlt: 'A' });
  });

  it('does not leak the other locale\'s override', () => {
    expect(resolvePageSeo({ seo: { title_en: 'Title' }, locale: 'zh', ...fallbacks }).title).toBe('T');
  });
});

describe('eventDescription', () => {
  it('falls back to truncated content', () => {
    expect(eventDescription(event, 'en', 300)).toBe(metaDescription('Content', 300));
  });

  it('uses the seo override verbatim, per locale', () => {
    const e = { ...event, seo: { description_en: 'Hand-tuned.' } };
    expect(eventDescription(e, 'en', 300)).toBe('Hand-tuned.');
    expect(eventDescription(e, 'zh', 300)).toBe(metaDescription('內容', 300));
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/seo.test.ts`
Expected: FAIL — `resolvePageSeo` / `eventDescription` are not exported.

- [ ] **Step 3: Implement**

Append to `src/lib/seo.ts` (after `metaDescription`):

```ts
// Optional hand-tuned SEO overrides for a single event or member page.
// Every field is optional; absent fields fall back to the derived value,
// so a new event/member still requires only its data file.
export interface SeoOverride {
  title_zh?: string;        // page-name part only — the brand suffix is still appended
  title_en?: string;
  description_zh?: string;  // replaces metaDescription(content/bio) everywhere summaries appear
  description_en?: string;
  ogImageAlt_zh?: string;
  ogImageAlt_en?: string;
}

export function resolvePageSeo(args: {
  seo?: SeoOverride;
  locale: Locale;
  fallbackTitle: string;
  fallbackDescription: string;
  fallbackOgImageAlt: string;
}): { title: string; description: string; ogImageAlt: string } {
  const { seo, locale, fallbackTitle, fallbackDescription, fallbackOgImageAlt } = args;
  const zh = locale === 'zh';
  return {
    title: (zh ? seo?.title_zh : seo?.title_en) ?? fallbackTitle,
    description: (zh ? seo?.description_zh : seo?.description_en) ?? fallbackDescription,
    ogImageAlt: (zh ? seo?.ogImageAlt_zh : seo?.ogImageAlt_en) ?? fallbackOgImageAlt,
  };
}

export function eventDescription(event: Event, locale: Locale, max: number): string {
  const override = locale === 'zh' ? event.seo?.description_zh : event.seo?.description_en;
  if (override) return override;
  return metaDescription(locale === 'zh' ? event.content_zh : event.content_en, max);
}
```

In `src/data/events/types.ts`, add at the top:

```ts
import type { SeoOverride } from '../../lib/seo';
```

and add to the `Event` interface (after `abstract_en?: string;`):

```ts
  seo?: SeoOverride;       // optional hand-tuned metadata (see src/lib/seo.ts)
```

In `src/data/members.ts`, add at the top (alongside existing imports if any, else as the first line):

```ts
import type { SeoOverride } from '../lib/seo';
```

and add to the `Member` interface (after `tags: string[];`):

```ts
  seo?: SeoOverride;   // optional hand-tuned metadata (see src/lib/seo.ts)
```

(These are type-only circular imports — `lib/seo.ts` already does `import type { Event }` from `events/types.ts`. `import type` is erased at compile time, so there is no runtime cycle.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/seo.test.ts`
Expected: PASS (all pre-existing cases in the file too).

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo.ts src/data/events/types.ts src/data/members.ts tests/seo.test.ts
git commit -m "$(cat <<'EOF'
feat(seo): SeoOverride type and resolver functions

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Route `seo` overrides through JSON-LD and the Atom feed

**Files:**
- Modify: `src/lib/seo.ts` — `eventLd` (line ~95: `description:` field) and `personLd` (line ~63: `description:` field)
- Modify: `src/lib/atom.ts` — `entryXml` (line ~43: `const summary = …`)
- Test: `tests/seo.test.ts`, `tests/atom.test.ts`

**Interfaces:**
- Consumes: `eventDescription(event, locale, max)` and `SeoOverride` from Task 1.
- Produces: no new exports — `eventLd`, `personLd`, `buildAtomFeed` now honor `seo.description_*`. Atom `<content type="html">` and the markdown mirrors intentionally keep rendering full content.

- [ ] **Step 1: Write the failing tests**

Append inside `tests/seo.test.ts`:

```ts
describe('seo description overrides in JSON-LD', () => {
  it('eventLd honors seo.description_en', () => {
    const e = { ...event, seo: { description_en: 'Tuned event.' } };
    expect((eventLd(e, 'en') as any).description).toBe('Tuned event.');
    expect((eventLd(event, 'en') as any).description).toBe(metaDescription('Content', 300));
  });

  it('personLd honors seo.description_zh', () => {
    const m = { ...MEMBERS[0], seo: { description_zh: '調校後簡介。' } };
    expect((personLd(m, 'zh') as any).description).toBe('調校後簡介。');
    expect((personLd(MEMBERS[0], 'zh') as any).description).toBe(MEMBERS[0].bio_zh);
  });
});
```

Append to `tests/atom.test.ts` (reuse that file's existing event fixture pattern — it already imports `buildAtomFeed`; add a minimal typed fixture if none is exported):

```ts
import type { Event } from '../src/data/events/types';

describe('seo override in feed summary', () => {
  const base: Event = {
    id: 'lecture-2099-02-02', date: '2099-02-02', year: '2099', type: 'Lecture',
    image: '/images/x.jpg', title_zh: '講題', title_en: 'Talk',
    content_zh: '內容', content_en: 'Content',
  };

  it('entry <summary> uses the override; <content> keeps full content', () => {
    const xml = buildAtomFeed('en', [{ ...base, seo: { description_en: 'Tuned summary.' } }]);
    expect(xml).toContain('<summary type="text">Tuned summary.</summary>');
    expect(xml).toContain('<content type="html">Content</content>');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/seo.test.ts tests/atom.test.ts`
Expected: FAIL — descriptions/summaries still come from `metaDescription(content)`.

- [ ] **Step 3: Implement**

In `src/lib/seo.ts`:

- `eventLd`: replace
  `description: metaDescription(locale === 'zh' ? event.content_zh : event.content_en, 300),`
  with
  `description: eventDescription(event, locale, 300),`
- `personLd`: replace
  `description: locale === 'zh' ? member.bio_zh : member.bio_en,`
  with
  `description: (locale === 'zh' ? member.seo?.description_zh : member.seo?.description_en) ?? (locale === 'zh' ? member.bio_zh : member.bio_en),`

In `src/lib/atom.ts`:

- Extend the import: `import { eventDescription, SITE_SUFFIX_EN } from './seo';` (drop `metaDescription` if now unused).
- In `entryXml`, replace `const summary = metaDescription(content, 200);` with `const summary = eventDescription(event, locale, 200);`

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/seo.test.ts tests/atom.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo.ts src/lib/atom.ts tests/seo.test.ts tests/atom.test.ts
git commit -m "$(cat <<'EOF'
feat(seo): honor seo description overrides in JSON-LD and Atom summaries

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: `PAGE_SEO` registry for static pages

**Files:**
- Create: `src/data/pageSeo.ts`
- Test: `tests/pageSeo.test.ts` (new)

**Interfaces:**
- Consumes: `SITE_SUFFIX_EN`, `SITE_NAME_BILINGUAL_EN` from `src/lib/seo.ts`; `Locale` from `src/config.ts`.
- Produces:
  - `interface StaticPageSeo { title: string; description: string; ogImageAlt: string }`
  - `interface EventListPageSeo { title: string; description: (count: number) => string; ogImageAlt: string }`
  - `PAGE_SEO: { home: Record<Locale, StaticPageSeo>; eventList: Record<Locale, EventListPageSeo>; peopleList: Record<Locale, StaticPageSeo>; notFound: Record<Locale, StaticPageSeo> }`
  - Titles are **full** titles (suffix already composed); Task 6 uses them as-is.

- [ ] **Step 1: Write the failing test**

Create `tests/pageSeo.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/pageSeo.test.ts`
Expected: FAIL — `src/data/pageSeo.ts` does not exist.

- [ ] **Step 3: Implement**

Create `src/data/pageSeo.ts`:

```ts
// Dedicated, hand-tuned SEO copy for every static page, per locale.
// Detail pages (events, people) derive their metadata from their data
// records instead — see resolvePageSeo() in src/lib/seo.ts.
//
// Copy rules: front-load primary keywords (AI 治理 / AI governance,
// 中央研究院 / Academia Sinica); descriptions ≤160 chars with a distinct
// value proposition per page; EN titles end with SITE_SUFFIX_EN
// (enforced by tests/pageSeo.test.ts).
import type { Locale } from '../config';
import { SITE_SUFFIX_EN, SITE_NAME_BILINGUAL_EN } from '../lib/seo';

export interface StaticPageSeo {
  title: string;        // full <title> — brand suffix already composed
  description: string;
  ogImageAlt: string;
}

export interface EventListPageSeo {
  title: string;
  description: (count: number) => string;  // keeps the live event count dynamic
  ogImageAlt: string;
}

export const PAGE_SEO: {
  home: Record<Locale, StaticPageSeo>;
  eventList: Record<Locale, EventListPageSeo>;
  peopleList: Record<Locale, StaticPageSeo>;
  notFound: Record<Locale, StaticPageSeo>;  // single bilingual page — zh entry is the one used
} = {
  home: {
    zh: {
      title: 'AI 治理觀念實驗室 - 中研院歐美所',
      description:
        'AI 治理觀念實驗室由中央研究院歐美研究所成立，聚焦生成式 AI 治理，結合法律、哲學、倫理學與資訊科學，透過全球規範與在地觀點的對話，豐富全球 AI 治理的討論。',
      ogImageAlt: 'AI 治理觀念實驗室',
    },
    en: {
      title: SITE_SUFFIX_EN,
      description:
        'AI governance research at IEAS, Academia Sinica: generative AI, law, philosophy, ethics, and computer science — bridging global norms and local contexts.',
      ogImageAlt: 'AI Governance Laboratory',
    },
  },
  eventList: {
    zh: {
      title: '學術活動 - AI 治理觀念實驗室',
      description: (count) =>
        `AI 治理觀念實驗室的專題演講、國際研討會與工作坊，共 ${count} 場學術活動，主題涵蓋 AI 治理、資料保護與 AI 倫理。`,
      ogImageAlt: 'AI 治理觀念實驗室學術活動',
    },
    en: {
      title: `Events - ${SITE_SUFFIX_EN}`,
      description: (count) =>
        `${count} lectures, conferences, and workshops on AI governance, data protection, and AI ethics at the AI Governance Laboratory, Academia Sinica.`,
      ogImageAlt: 'AI Governance Laboratory events',
    },
  },
  peopleList: {
    zh: {
      title: '參與成員 - AI 治理觀念實驗室',
      description:
        'AI 治理觀念實驗室成員：中央研究院跨領域研究人員，專長涵蓋法律、哲學、倫理學與資訊科學等 AI 治理相關領域。',
      ogImageAlt: 'AI 治理觀念實驗室參與成員',
    },
    en: {
      title: `Team - ${SITE_SUFFIX_EN}`,
      description:
        'Members of the AI Governance Laboratory — interdisciplinary researchers at Academia Sinica across law, philosophy, ethics, and computer science.',
      ogImageAlt: 'AI Governance Laboratory team',
    },
  },
  notFound: {
    zh: {
      title: `404 - ${SITE_NAME_BILINGUAL_EN}`,
      description: '找不到這個頁面 / Page not found',
      ogImageAlt: 'AI 治理觀念實驗室',
    },
    en: {
      title: `404 - ${SITE_NAME_BILINGUAL_EN}`,
      description: '找不到這個頁面 / Page not found',
      ogImageAlt: 'AI Governance Laboratory',
    },
  },
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/pageSeo.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/pageSeo.ts tests/pageSeo.test.ts
git commit -m "$(cat <<'EOF'
feat(seo): PAGE_SEO registry with tuned copy for static pages

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Brand assets — favicon, apple-touch-icon, default OG card

**Files:**
- Create: `public/favicon.svg` (hand-written, committed)
- Create: `public/apple-touch-icon.png` (generated, committed)
- Create: `public/images/og-default.png` (generated, committed)
- Throwaway script (NOT committed): `<scratchpad>/generate-brand-assets.mjs` — use the scratchpad directory listed in your system prompt.

**Interfaces:**
- Consumes: `sharp` (already in `package.json` dependencies).
- Produces: the three static assets at the exact paths above. Task 5 hard-codes `/favicon.svg`, `/apple-touch-icon.png`, `/images/og-default.png`.

**Design note:** the spec sketched a transparent-background favicon; use a solid slate-900 rounded square instead so the mark stays legible on both light and dark browser tabs. Same palette otherwise (slate-900 `#0f172a`, blue-500 `#3b82f6`).

- [ ] **Step 1: Write `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="13" fill="#0f172a"/>
  <text x="32" y="31" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="22" fill="#ffffff">AI</text>
  <text x="32" y="53" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="17" fill="#3b82f6">Gov</text>
</svg>
```

- [ ] **Step 2: Write the throwaway generation script**

Create `<scratchpad>/generate-brand-assets.mjs` (run from the repo root so `sharp` resolves and output paths are relative to the repo):

```js
import sharp from 'sharp';

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0f172a"/>
  <rect x="0" y="0" width="1200" height="10" fill="#3b82f6"/>
  <text x="600" y="265" text-anchor="middle" font-family="'Noto Sans', 'DejaVu Sans', sans-serif" font-weight="700" font-size="130" fill="#ffffff">AI·Gov</text>
  <text x="600" y="385" text-anchor="middle" font-family="'Noto Sans CJK TC', 'Noto Sans TC', sans-serif" font-weight="500" font-size="54" fill="#e2e8f0">AI 治理觀念實驗室</text>
  <text x="600" y="455" text-anchor="middle" font-family="'Noto Sans', 'DejaVu Sans', sans-serif" font-size="30" fill="#94a3b8">AI Governance Laboratory, IEAS, Academia Sinica</text>
</svg>`;
await sharp(Buffer.from(ogSvg)).png().toFile('public/images/og-default.png');

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
  <rect width="180" height="180" rx="36" fill="#0f172a"/>
  <text x="90" y="86" text-anchor="middle" font-family="'Noto Sans', 'DejaVu Sans', sans-serif" font-weight="700" font-size="62" fill="#ffffff">AI</text>
  <text x="90" y="148" text-anchor="middle" font-family="'Noto Sans', 'DejaVu Sans', sans-serif" font-weight="700" font-size="48" fill="#3b82f6">Gov</text>
</svg>`;
await sharp(Buffer.from(iconSvg)).png().toFile('public/apple-touch-icon.png');

const og = await sharp('public/images/og-default.png').metadata();
const icon = await sharp('public/apple-touch-icon.png').metadata();
console.log('og-default.png:', og.width, 'x', og.height);
console.log('apple-touch-icon.png:', icon.width, 'x', icon.height);
```

- [ ] **Step 3: Run the script and verify dimensions**

Run (from the repo root): `node <scratchpad>/generate-brand-assets.mjs`
Expected output:

```
og-default.png: 1200 x 630
apple-touch-icon.png: 180 x 180
```

- [ ] **Step 4: Visually verify the OG card**

Open `public/images/og-default.png` with the Read tool. Confirm: dark card, blue top bar, "AI·Gov" wordmark, the Chinese line 「AI 治理觀念實驗室」 renders as real glyphs (NOT hollow tofu boxes □□□), and the EN institutional line below. If the Chinese line shows tofu boxes, a CJK font is missing — install one (`sudo apt-get install -y fonts-noto-cjk` or ask the user) and re-run Step 3.

- [ ] **Step 5: Commit**

```bash
git add public/favicon.svg public/apple-touch-icon.png public/images/og-default.png
git commit -m "$(cat <<'EOF'
feat(brand): AI·Gov favicon, apple-touch-icon, and default OG card

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: `BaseLayout.astro` — full tag emission with defaults

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Test: `tests/seoTags.test.ts` (new, built-`dist/` regex style like `tests/baseLayout.test.ts`)

**Interfaces:**
- Consumes: assets from Task 4 at `/favicon.svg`, `/apple-touch-icon.png`, `/images/og-default.png`.
- Produces: new optional `BaseLayout` props used by Task 6 — `ogImageAlt?: string`, `ogType?: 'website' | 'article' | 'profile'` (default `'website'`), `publishedTime?: string`, `profileName?: { first?: string; last?: string }`. All existing pages compile unchanged.

- [ ] **Step 1: Write the failing tests**

Create `tests/seoTags.test.ts`:

```ts
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

const read = (p: string) => readFileSync(path.join(DIST, p), 'utf8');

describe('default OG/Twitter tags (pages without their own image)', () => {
  it('homepage falls back to the default OG card, with dimensions and alt', () => {
    const html = read('index.html');
    expect(html).toContain('property="og:image" content="https://ai-gov-lab-ieas.github.io/images/og-default.png"');
    expect(html).toContain('property="og:image:width" content="1200"');
    expect(html).toContain('property="og:image:height" content="630"');
    expect(html).toContain('property="og:image:alt"');
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
    expect(html).toContain('name="twitter:title"');
    expect(html).toContain('name="twitter:description"');
    expect(html).toContain('name="twitter:image" content="https://ai-gov-lab-ieas.github.io/images/og-default.png"');
    expect(html).toContain('name="theme-color" content="#FAFAFA"');
    expect(html).toContain('property="og:type" content="website"');
  });

  it('homepage links the branded favicon set', () => {
    const html = read('index.html');
    expect(html).toContain('href="/favicon.svg"');
    expect(html).toContain('rel="apple-touch-icon" href="/apple-touch-icon.png"');
    expect(html).not.toContain('vite.svg');
  });

  it('404 page also gets the default share card', () => {
    const html = read('404.html');
    expect(html).toContain('property="og:image" content="https://ai-gov-lab-ieas.github.io/images/og-default.png"');
  });
});
```

- [ ] **Step 2: Rebuild and run tests to verify they fail**

Run: `rm -rf dist && npx vitest run tests/seoTags.test.ts`
Expected: FAIL — no default `og:image`, no `twitter:title`, `vite.svg` still present. (The `beforeAll` triggers the build; allow ~1–2 min.)

- [ ] **Step 3: Implement in `src/layouts/BaseLayout.astro`**

Replace the `Props` interface and the const block with:

```astro
interface Props {
  locale: Locale;
  path: string;          // locale-neutral, leading + trailing slash
  title: string;
  description: string;
  ogImage?: string;      // absolute URL or site-relative path
  ogImageAlt?: string;   // defaults to title
  ogType?: 'website' | 'article' | 'profile';
  publishedTime?: string;                        // emitted only when ogType === 'article'
  profileName?: { first?: string; last?: string }; // emitted only when ogType === 'profile'
  jsonLd?: object[];
}

const {
  locale, path, title, description, ogImage, ogImageAlt,
  ogType = 'website', publishedTime, profileName, jsonLd = [],
} = Astro.props;
const canonical = SITE_URL + localePath(locale, path);
const allJsonLd = [organizationLd(locale), ...jsonLd];
const customOgImage = ogImage ? (ogImage.startsWith('http') ? ogImage : SITE_URL + ogImage) : undefined;
// Site-wide fallback share card: dimensions are asserted only for this
// known 1200×630 asset, never for event/member photos.
const ogImageUrl = customOgImage ?? `${SITE_URL}/images/og-default.png`;
const isDefaultOgImage = !customOgImage;
const ogAlt = ogImageAlt ?? title;
```

Replace `<link rel="icon" type="image/svg+xml" href="/vite.svg" />` with:

```astro
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

Replace the block from `<meta property="og:type" content="website" />` through `<meta name="twitter:card" …/>` with:

```astro
    <meta property="og:type" content={ogType} />
    {ogType === 'article' && publishedTime && (
      <meta property="article:published_time" content={publishedTime} />
    )}
    {ogType === 'profile' && profileName?.first && (
      <meta property="profile:first_name" content={profileName.first} />
    )}
    {ogType === 'profile' && profileName?.last && (
      <meta property="profile:last_name" content={profileName.last} />
    )}
    <meta property="og:site_name" content={locale === 'zh' ? 'AI 治理觀念實驗室' : SITE_NAME_BILINGUAL_EN} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:locale" content={locale === 'zh' ? 'zh_TW' : 'en_US'} />
    <meta property="og:image" content={ogImageUrl} />
    <meta property="og:image:alt" content={ogAlt} />
    {isDefaultOgImage && <meta property="og:image:width" content="1200" />}
    {isDefaultOgImage && <meta property="og:image:height" content="630" />}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImageUrl} />
    <meta name="twitter:image:alt" content={ogAlt} />
    <meta name="theme-color" content="#FAFAFA" />
```

(Every page now has an image, so `twitter:card` is always `summary_large_image`.)

- [ ] **Step 4: Rebuild and run the full suite**

Run: `rm -rf dist && npm test`
Expected: PASS — including the pre-existing `tests/baseLayout.test.ts` feed-link tests.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro tests/seoTags.test.ts
git commit -m "$(cat <<'EOF'
feat(seo): full OG/Twitter tag set, default share card, branded favicon

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Wire templates — PAGE_SEO for static pages, resolvePageSeo + og types for detail pages

**Files:**
- Modify: `src/templates/HomePage.astro`
- Modify: `src/templates/EventListPage.astro`
- Modify: `src/templates/PeopleListPage.astro`
- Modify: `src/pages/404.astro`
- Modify: `src/templates/EventDetailPage.astro`
- Modify: `src/templates/PersonPage.astro`
- Test: `tests/seoTags.test.ts` (extend)

**Interfaces:**
- Consumes: `PAGE_SEO` (Task 3), `resolvePageSeo` (Task 1), `BaseLayout` props `ogImageAlt`/`ogType`/`publishedTime`/`profileName` (Task 5).
- Produces: final rendered pages. No new exports.

- [ ] **Step 1: Extend `tests/seoTags.test.ts` with failing per-type tests**

Append inside the file (uses the existing `read` helper and `beforeAll`):

```ts
describe('per-type OG tags on detail pages', () => {
  it('event page is og:type article with article:published_time', () => {
    const html = read('event/lecture-2024-03-20/index.html');
    expect(html).toContain('property="og:type" content="article"');
    expect(html).toContain('property="article:published_time" content="2024-03-20"');
    // custom event image → no asserted dimensions
    expect(html).not.toContain('og:image:width');
  });

  it('person page is og:type profile with profile name parts', () => {
    const html = read('people/chih-hsing-ho/index.html');
    expect(html).toContain('property="og:type" content="profile"');
    expect(html).toContain('property="profile:first_name" content="Chih-Hsing"');
    expect(html).toContain('property="profile:last_name" content="Ho"');
  });
});

describe('static pages read PAGE_SEO copy', () => {
  it('EN homepage title is the institutional name', () => {
    const html = read('en/index.html');
    expect(html).toContain('<title>AI Governance Laboratory, IEAS, Academia Sinica</title>');
  });

  it('ZH event list description carries the live event count', () => {
    const html = read('event/index.html');
    expect(html).toMatch(/name="description" content="[^"]*共 \d+ 場學術活動[^"]*"/);
  });
});
```

- [ ] **Step 2: Rebuild and run to verify the new tests fail**

Run: `rm -rf dist && npx vitest run tests/seoTags.test.ts`
Expected: the Task 5 tests PASS; the four new tests FAIL (og:type still `website` on detail pages, old title/description copy on static pages).

- [ ] **Step 3: Wire the static pages**

`src/templates/HomePage.astro` — add `import { PAGE_SEO } from '../data/pageSeo';`, then replace the `<BaseLayout …>` opening tag with:

```astro
<BaseLayout
  locale={locale}
  path="/"
  title={PAGE_SEO.home[locale].title}
  description={PAGE_SEO.home[locale].description}
  ogImageAlt={PAGE_SEO.home[locale].ogImageAlt}
>
```

(`t.site.title` / `t.hero.desc` remain in use elsewhere on the page/site — do not delete them from `content.ts`.)

`src/templates/EventListPage.astro` — add `import { PAGE_SEO } from '../data/pageSeo';`, delete the local `const title = …` / `const description = …` block, and use:

```astro
<BaseLayout
  locale={locale}
  path="/event/"
  title={PAGE_SEO.eventList[locale].title}
  description={PAGE_SEO.eventList[locale].description(POSTS.length)}
  ogImageAlt={PAGE_SEO.eventList[locale].ogImageAlt}
  jsonLd={jsonLd}
>
```

`src/templates/PeopleListPage.astro` — same pattern: add the import, delete local `title`/`description` consts, and use `PAGE_SEO.peopleList[locale].title` / `.description` / `.ogImageAlt` in the `<BaseLayout>` tag (keep `path="/people/"` and `jsonLd={jsonLd}`).

`src/pages/404.astro` — replace the frontmatter and `<BaseLayout>` opening with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { PAGE_SEO } from '../data/pageSeo';
---
<BaseLayout
  locale="zh"
  path="/404/"
  title={PAGE_SEO.notFound.zh.title}
  description={PAGE_SEO.notFound.zh.description}
  ogImageAlt={PAGE_SEO.notFound.zh.ogImageAlt}
>
```

(The `SITE_NAME_BILINGUAL_EN` import in `404.astro` becomes unused — remove it. Keep the `<meta slot="head" name="robots" content="noindex" />` line and the rest of the body unchanged.)

- [ ] **Step 4: Wire `EventDetailPage.astro`**

Extend the seo import line to include `resolvePageSeo`, then replace:

```ts
const title = `${zh ? post.title_zh : post.title_en} - ${zh ? 'AI 治理觀念實驗室' : SITE_SUFFIX_EN}`;
const description = metaDescription(zh ? post.content_zh : post.content_en);
```

with:

```ts
const resolved = resolvePageSeo({
  seo: post.seo,
  locale,
  fallbackTitle: zh ? post.title_zh : post.title_en,
  fallbackDescription: metaDescription(zh ? post.content_zh : post.content_en),
  fallbackOgImageAlt: zh ? post.title_zh : post.title_en,
});
const title = `${resolved.title} - ${zh ? 'AI 治理觀念實驗室' : SITE_SUFFIX_EN}`;
const description = resolved.description;
```

and extend the `<BaseLayout>` opening tag with the three new props:

```astro
<BaseLayout
  locale={locale}
  path={`/event/${post.id}/`}
  title={title}
  description={description}
  ogImage={post.image}
  ogImageAlt={resolved.ogImageAlt}
  ogType="article"
  publishedTime={post.date}
  jsonLd={jsonLd}
>
```

- [ ] **Step 5: Wire `PersonPage.astro`**

Extend the seo import line to include `resolvePageSeo`, then replace:

```ts
const title = `${name} - ${zh ? 'AI 治理觀念實驗室' : SITE_SUFFIX_EN}`;
const description = metaDescription(bio);
```

with:

```ts
const resolved = resolvePageSeo({
  seo: member.seo,
  locale,
  fallbackTitle: name,
  fallbackDescription: metaDescription(bio),
  fallbackOgImageAlt: name,
});
const title = `${resolved.title} - ${zh ? 'AI 治理觀念實驗室' : SITE_SUFFIX_EN}`;
const description = resolved.description;
const nameParts = member.name_en.trim().split(/\s+/);
const profileName = {
  first: nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : undefined,
  last: nameParts[nameParts.length - 1],
};
```

and extend the `<BaseLayout>` opening tag:

```astro
<BaseLayout
  locale={locale}
  path={`/people/${member.slug}/`}
  title={title}
  description={description}
  ogImage={member.image}
  ogImageAlt={resolved.ogImageAlt}
  ogType="profile"
  profileName={profileName}
  jsonLd={jsonLd}
>
```

- [ ] **Step 6: Rebuild and run the full suite**

Run: `rm -rf dist && npm test`
Expected: PASS — all files, including the four new seoTags tests.

- [ ] **Step 7: Commit**

```bash
git add src/templates/HomePage.astro src/templates/EventListPage.astro src/templates/PeopleListPage.astro src/pages/404.astro src/templates/EventDetailPage.astro src/templates/PersonPage.astro tests/seoTags.test.ts
git commit -m "$(cat <<'EOF'
feat(seo): wire PAGE_SEO registry and per-type OG props into all templates

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Documentation

**Files:**
- Modify: `docs/SEO.md` (the "How SEO metadata flows" table and surrounding prose)
- Modify: `HOW_TO_ADD_EVENTS.md` (new short section on the optional `seo` block)

**Interfaces:**
- Consumes: everything shipped in Tasks 1–6. No code changes.

- [ ] **Step 1: Update `docs/SEO.md`**

In the "How SEO metadata flows" table, update the source column:

- Home / Event list / People list / 404 rows: change "Hard-coded in `src/pages/…`" to "`PAGE_SEO` registry in `src/data/pageSeo.ts` (hand-tuned per locale)".
- Event detail row: append "; optional `seo` override block on the event record (resolved by `resolvePageSeo()` in `src/lib/seo.ts`)".
- Member detail row: append "; optional `seo` override block on the member record".

After the table, replace the closing paragraph ("Every page also gets…") with:

```markdown
Every page also gets `organizationLd()` for free, plus canonical/hreflang/Open Graph tags,
from `BaseLayout.astro`.

## Social share tags

`BaseLayout.astro` emits the full Open Graph and Twitter card set on every page:
`og:type` (`website` by default; `article` on event pages with `article:published_time`,
`profile` on member pages with `profile:first_name`/`profile:last_name`), `og:image` with
`og:image:alt`, and `twitter:card`/`twitter:title`/`twitter:description`/`twitter:image`.

Pages without their own image (home, list pages, 404) fall back to the site-wide share
card `public/images/og-default.png` (1200×630 — the only image whose
`og:image:width`/`og:image:height` are asserted). Event and member pages use their own
`image` field. The favicon set is `public/favicon.svg` + `public/apple-touch-icon.png`.

## Overriding metadata for a single event or member

Add an optional `seo` block to the record in `src/data/events/*.ts` or
`src/data/members.ts`:

```ts
seo: {
  title_en: 'Hand-tuned page name',        // brand suffix is still appended
  description_en: 'Hand-tuned summary.',   // also feeds JSON-LD description and the Atom <summary>
  ogImageAlt_en: 'Alt text for the share image',
  // …and/or the _zh variants
},
```

Absent fields fall back to the derived values, so the block is never required. Overrides
do **not** change the markdown mirrors or the Atom `<content>` — those always render the
full content.
```

- [ ] **Step 2: Update `HOW_TO_ADD_EVENTS.md`**

Append a section (match the file's existing heading style):

```markdown
## Optional: hand-tuned SEO for one event

Events get their `<title>` and meta description derived automatically from
`title_zh`/`title_en` and `content_zh`/`content_en`. For an event that deserves crafted
copy (e.g., a flagship conference), add an optional `seo` block:

```ts
seo: {
  description_zh: '一句手工撰寫的摘要，會用於 meta description、JSON-LD 與 Atom 摘要。',
  description_en: 'A hand-written summary used for the meta description, JSON-LD, and Atom summary.',
},
```

All six fields (`title_zh/en`, `description_zh/en`, `ogImageAlt_zh/en`) are optional;
anything you omit falls back to the derived value. See `docs/SEO.md` for details.
```

- [ ] **Step 3: Run the full suite one last time**

Run: `npm test`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add docs/SEO.md HOW_TO_ADD_EVENTS.md
git commit -m "$(cat <<'EOF'
docs(seo): document PAGE_SEO registry, share tags, and per-record seo overrides

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
)"
```
