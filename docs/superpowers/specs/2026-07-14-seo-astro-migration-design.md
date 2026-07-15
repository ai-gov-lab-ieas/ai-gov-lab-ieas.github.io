# SEO Overhaul: Astro Migration Design

**Date:** 2026-07-14
**Status:** Approved pending user review

## Problem

The site is a client-rendered React SPA (Vite + react-router) on GitHub Pages. Every URL serves the same `index.html` with an empty root div and a single fixed `<title>`. Consequences:

- Search engines see essentially no content on any route.
- Deep links (e.g. `/event/lecture-2026-04-14`) 404 on GitHub Pages — there is no `404.html` SPA fallback — so event URLs are uncrawlable and unshareable.
- The zh/en language toggle swaps content client-side on the same URL, so English content is invisible to search.
- Members have no individual URLs.
- No sitemap, robots.txt, structured data, per-page titles/descriptions, or Open Graph tags.

## Goal

Every event and every member gets a real, indexable URL in both languages, and the whole site follows technical-SEO best practice: static HTML, hreflang, canonicals, JSON-LD structured data, sitemap, OG cards, and strong Core Web Vitals.

## Decision: Migrate to Astro

Chosen over (a) prerendering the existing SPA and (b) React Router 7 framework mode. Astro outputs plain static HTML per page with near-zero JS, giving the best SEO ceiling and the simplest long-term mental model for a content site. This is a re-platforming, not a redesign — the visual design stays identical.

## URL structure

Chinese is the default locale; English mirrors under `/en/`.

| zh | en | Page |
|---|---|---|
| `/` | `/en/` | Home |
| `/event/` | `/en/event/` | Events list |
| `/event/<event-id>/` | `/en/event/<event-id>/` | Event detail (one per event file) |
| `/people/` | `/en/people/` | Members list |
| `/people/<slug>/` | `/en/people/<slug>/` | Member detail |

- Every zh/en pair cross-links via `hreflang` (`zh-Hant`, `en`, `x-default` → zh).
- Existing indexed SPA URLs (`/event/<id>` without trailing slash) resolve via Astro trailing-slash handling; `/#team`-style anchors keep working on the home page.
- The canonical site URL is a single config constant, `https://ai-gov-lab-ieas.github.io` for now, used by canonicals, sitemap, hreflang, and JSON-LD. Switching to a custom domain later is a one-line change.
- The nav language toggle becomes a link to the same page in the other locale (replacing client-side state).

## Data model changes

**Events** (`src/data/events/*.ts` — one file per event, format preserved) gain optional fields:

- `speakers`: array of member slugs or free-text names (for external speakers). Unknown member slugs **fail the build** with a clear error.
- `location_zh` / `location_en`
- `abstract_zh` / `abstract_en`

Event files are auto-discovered via `import.meta.glob` — the manually maintained `src/data/events/index.ts` is removed (eliminates the forgot-to-import failure mode). `_template.ts` and `HOW_TO_ADD_EVENTS.md` are updated accordingly.

**Members** move from `content.ts` to a dedicated `src/data/members.ts` module (single file — the roster is small and changes rarely) and gain:

- `slug` (e.g. `tzu-wei-hung`)
- `bio_zh` / `bio_en` (~100 words, drafted by Claude from public institutional profiles, reviewed by the user)
- optional `researchAreas`

Member pages auto-list the member's events by matching `speakers`. A one-time pass tags existing events with speakers (user reviews).

## Per-page SEO layer

A shared `BaseLayout` owns, for every page in both languages:

- Unique `<title>` and `<meta name="description">`
- Canonical URL + hreflang link pair
- Open Graph / Twitter Card tags (event image or member photo as the share card)
- JSON-LD structured data:
  - **Event pages:** `Event` — name, date, location, `organizer` (the lab), `performer` as `Person` objects linked by URL to member pages.
  - **Member pages:** `Person` — zh+en name, `jobTitle`, `affiliation` (IEAS, Academia Sinica), photo, `sameAs` → official Academia Sinica profile URL (consolidates identity rather than competing with it).
  - **All pages:** `Organization` for the lab; `BreadcrumbList`.

Future (only when the content exists, explicitly out of scope now): `VideoObject` for lecture recordings, `ScholarlyArticle` for publications.

## Site-wide SEO infrastructure

- `@astrojs/sitemap` generates the sitemap with hreflang annotations for all zh/en URLs.
- `robots.txt` in `public/` referencing the sitemap.
- Custom static 404 page (replaces the SPA-fallback problem — every real URL is now a real file).
- Post-deploy manual step (user's, with written instructions): submit the sitemap in Google Search Console.

## Performance / Core Web Vitals

- Local images (team photos, local event images) go through `astro:assets`: WebP/AVIF, responsive sizes, explicit dimensions (no layout shift), lazy loading.
- Remote Unsplash event images keep working; the event template encourages local images going forward.
- Static output removes the render-blocking JS bundle. Target: Lighthouse SEO ≈ 100 and strong performance scores on key pages, verified pre-merge.

## Migration mechanics

1. Scaffold Astro in the repo; Tailwind 4 carries over; icons via `@lucide/astro`.
2. Port components 1:1 visually: Hero, Mission, Activities, Team, Navigation, events list, event detail. Interactivity (mobile nav, events year filter) becomes small client-side islands or plain JS.
3. Build new pages: members list + member detail, zh and en.
4. Implement the SEO layer, sitemap, robots, 404.
5. Deploy: same GitHub Actions flow with Astro's official GitHub Pages build action; output remains static `dist/`.

## Verification before merge

- `astro build` + `astro preview`; check every route in both languages for correct content, title, meta, hreflang, and JSON-LD.
- Validate representative pages with Google's Rich Results test.
- Confirm previously indexed URL patterns resolve (no 404s for old event URLs).
- Lighthouse SEO and performance on home, one event page, one member page.

## Explicitly out of scope

- Visual redesign of any kind.
- Custom domain acquisition (design keeps it a one-line change).
- Publications/video schema (until that content exists).
- Off-site SEO (backlinks, Search Console monitoring) — noted as follow-up human work; recommend asking IEAS/Academia Sinica to link to the lab site and member pages.
