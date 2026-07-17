# Per-Page Dedicated SEO — Design

**Date:** 2026-07-17
**Status:** Approved (brainstorming session)

## Goal

Every page on the site carries its own deliberately tuned SEO metadata — not just
derived strings — while keeping the repo's single-source-of-truth architecture:
all tag emission stays centralized in `BaseLayout.astro`, and adding an event or
member still requires only its data file (CLAUDE.md invariant #8).

## Context

The site already emits per-page `<title>`, meta description, canonical, zh/en/x-default
hreflang, Open Graph, and JSON-LD (Organization everywhere; Event/Person/Breadcrumb where
relevant). Audit findings this design closes:

1. No social-share image on home, event list, people list, 404 (no site-wide OG fallback).
2. No `og:image:alt` / `og:image:width` / `og:image:height` anywhere.
3. No `twitter:title` / `twitter:description` / `twitter:image` (X no longer reliably
   falls back to `og:*`).
4. Favicon is the leftover `vite.svg`.
5. Static-page titles/descriptions are hard-coded inside templates — no single place to
   review or tune them; copy is serviceable but not optimized.
6. No way to hand-tune the metadata of an individual event or member page.

## Design

### 1. Brand assets (new files in `public/`)

- `favicon.svg` — "AI·Gov" typographic mark: slate-900 (`#0f172a`) lettering,
  blue-500 (`#3b82f6`) accent dot, transparent background. Replaces `vite.svg` in
  `<link rel="icon">`.
- `apple-touch-icon.png` — 180×180 raster of the same mark on a solid background.
- `images/og-default.png` — 1200×630 share card: slate-900 background, white "AI·Gov"
  wordmark, 「AI 治理觀念實驗室」 and "AI Governance Laboratory, IEAS, Academia Sinica"
  beneath, blue-500 accent. Generated once by a throwaway script (sharp/resvg, run from
  the scratchpad) and committed as a static asset — no build-pipeline change.

### 2. Per-page SEO registry for static pages — new `src/data/seo.ts`

Move the static pages' hard-coded titles/descriptions out of the templates into one
dedicated registry with hand-optimized copy per page per locale:

```ts
export const PAGE_SEO = {
  home:       { zh: { title, description, ogImageAlt }, en: { title, description, ogImageAlt } },
  eventList:  { zh: { … }, en: { … } },
  peopleList: { zh: { … }, en: { … } },
  notFound:   { zh: { … }, en: { … } },  // 404 is a single bilingual page; zh entry is used
} as const;
```

Copy guidelines applied to every entry:

- Front-load primary keywords: 「AI 治理」、「中央研究院」 / "AI governance",
  "Academia Sinica".
- Descriptions in the 120–155-char sweet spot, each stating a distinct value
  proposition (no boilerplate shared across pages).
- EN titles keep the `… - AI Governance Laboratory, IEAS, Academia Sinica` suffix via
  `SITE_SUFFIX_EN` (invariant #6); ZH titles keep `… - AI 治理觀念實驗室`.
- Event-list description keeps the dynamic event count: its registry entry stores a
  function `(count: number) => string` instead of a static string, and the template
  passes `POSTS.length`. All other entries are static strings.

Templates (`HomePage`, `EventListPage`, `PeopleListPage`, `404.astro`) read from this
registry instead of inlining strings.

### 3. Per-event and per-member SEO overrides

`Event` (`src/data/events/types.ts`) and `Member` (`src/data/members.ts`) gain an
optional `seo` block:

```ts
seo?: {
  title_zh?: string;        title_en?: string;        // overrides derived <title> (page-name part only; suffix still appended)
  description_zh?: string;  description_en?: string;  // overrides metaDescription(content/bio)
  ogImageAlt_zh?: string;   ogImageAlt_en?: string;   // overrides default alt (title/name)
}
```

Resolution logic lives in `src/lib/seo.ts` as a pure function:

```ts
resolvePageSeo({ seo, locale, fallbackTitle, fallbackDescription, fallbackOgImageAlt })
  → { title, description, ogImageAlt }
```

Detail templates call it; when no `seo` block exists, behavior is byte-identical to
today's derivation. A new event/member still requires only its data file.

The `seo.description_*` override feeds the meta description, Atom `<summary>`, and
JSON-LD `description` (all already routed through the same summary rule — content-newline
rule 3 in CLAUDE.md). It does **not** change the markdown mirrors or feed `<content>`,
which continue to render full content.

### 4. `BaseLayout.astro` extensions

New optional props (all defaulted, so no page breaks):

- `ogType?: 'website' | 'article' | 'profile'` — default `'website'`.
- `publishedTime?: string` — emits `<meta property="article:published_time">` only when
  `ogType === 'article'`.
- `profileName?: { first?: string; last?: string }` — emits `profile:first_name` /
  `profile:last_name` only when `ogType === 'profile'`.
- `ogImageAlt?: string` — defaults to the page title whenever an image is emitted.

New emission rules:

- `og:image` falls back to `/images/og-default.png` when no `ogImage` prop is passed —
  home, event list, people list, and 404 all get a share card.
- `og:image:alt` always emitted alongside `og:image`. `og:image:width`/`og:image:height`
  (1200/630) emitted **only** for the default card — event/member photo dimensions vary
  and must not be asserted falsely.
- `twitter:title`, `twitter:description`, `twitter:image` mirroring the OG values
  (existing `twitter:card` logic stays: `summary_large_image` with image, `summary`
  without — with the default-image fallback, every page now has an image).
- `<meta name="theme-color" content="#FAFAFA">`.
- Favicon links: `icon` → `/favicon.svg`, plus `apple-touch-icon`.

### 5. Template touches (the only per-page edits)

- `EventDetailPage.astro`: `ogType="article"`, `publishedTime={post.date}`, and
  title/description/ogImageAlt via `resolvePageSeo`.
- `PersonPage.astro`: `ogType="profile"`, `profileName` split from the member's EN name,
  and title/description/ogImageAlt via `resolvePageSeo`.
- `HomePage` / `EventListPage` / `PeopleListPage` / `404.astro`: read copy from
  `PAGE_SEO`; no other changes — they inherit the new defaults.

### 6. Deliberate omissions

- `<meta name="keywords">` — ignored by every major engine; keyword optimization lives in
  title/description copy instead.
- No separate `<Seo>` component — `BaseLayout` remains the single emitter.
- No `article:*` / `profile:*` tags beyond the ones listed — JSON-LD already carries
  dates, names, and affiliations for crawlers that consume structured data.

### 7. Out of scope / untouched

Endpoints (`.xml` / `.md` / `.txt`), sitemap behavior, canonical/hreflang logic, Atom
feed structure, and all ten CLAUDE.md invariants. Google Search Console verification
remains a documented one-time owner step (`docs/SEO.md`).

## Error handling

- `resolvePageSeo` is pure fallback logic — no throw paths. `resolveSpeaker`'s
  unknown-slug throw (invariant #5) is unaffected.
- TypeScript enforces `PAGE_SEO` shape at compile time (`as const` + explicit type).

## Testing

Per the repo test contract (shared code must be tested; wrappers need not be):

- `resolvePageSeo` — Vitest cases: no `seo` block (fallback passthrough), full override,
  partial override (mix of override + fallback), both locales.
- `PAGE_SEO` shape test — every entry has both locales; every description ≤ 160 chars;
  every EN title ends with `SITE_SUFFIX_EN`.
- Existing suite must stay green (`npm test`).

## Documentation

- Update `docs/SEO.md`: metadata-flow table gains the new tags, the default-OG fallback
  rule, the `PAGE_SEO` registry, and the per-event/member `seo` override block.
- Update `README.md` only if any route changes (none expected — invariant #9 concerns
  endpoint routes, and this design adds no routes).
- `HOW_TO_ADD_EVENTS.md`: one short section documenting the optional `seo` block on
  events.
