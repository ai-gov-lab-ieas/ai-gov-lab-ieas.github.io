# SEO

This site is built with Astro and the `@astrojs/sitemap` integration, which regenerates
`sitemap-index.xml` / `sitemap-0.xml` automatically from the page tree on every build.
Canonical URLs, hreflang alternates, Open Graph tags, and JSON-LD structured data are
generated per-page by `src/layouts/BaseLayout.astro` and `src/lib/seo.ts`.

## After each deploy

Nothing is needed. The sitemap regenerates automatically as part of `npm run build`,
which runs in CI on every push to `main` (see `.github/workflows/deploy.yml`). New event
and member pages are picked up automatically by the build-time content loaders in
`src/data/events/` and `src/data/members.ts` — no manual sitemap or search-engine step is
required for routine content updates.

## One-time setup (site owner)

This only needs to be done once, by whoever owns the Google Search Console / Bing
Webmaster Tools accounts for the site.

### Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console) and add a new
   property using the **URL-prefix** method with `https://ai-gov-lab-ieas.github.io/`.
2. Choose the **HTML tag** verification method. Search Console will give you a meta tag
   that looks like:

   ```html
   <meta name="google-site-verification" content="..." />
   ```

3. Paste that tag into the `<head>` of `src/layouts/BaseLayout.astro` (alongside the
   other `<meta>` tags).
4. Commit, push to `main`, and let the deploy workflow publish the change.
5. Back in Search Console, click **Verify**.
6. Once verified, go to **Sitemaps** in the left sidebar and submit:

   ```
   https://ai-gov-lab-ieas.github.io/sitemap-index.xml
   ```

### Bing Webmaster Tools

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters) and add the site. Bing
   supports importing verified properties directly from Google Search Console, which is
   the fastest path — otherwise repeat the HTML-tag verification steps above with Bing's
   own meta tag.
2. Submit the same sitemap URL, `https://ai-gov-lab-ieas.github.io/sitemap-index.xml`,
   under Bing's Sitemaps section.

## Validating structured data

To check that the JSON-LD emitted for a given page is well-formed and picked up
correctly, paste the page's full URL into Google's
[Rich Results Test](https://search.google.com/test/rich-results). This works for both
event pages (`Event` structured data) and member pages (`Person` structured data).

## How SEO metadata flows

| Page type | Title / description source | JSON-LD source |
|---|---|---|
| Home (`/`, `/en/`) | `PAGE_SEO` registry in `src/data/pageSeo.ts` (hand-tuned per locale) | `organizationLd()` in `src/lib/seo.ts`, called from `BaseLayout.astro` on every page |
| Event list (`/event/`, `/en/event/`) | `PAGE_SEO` registry in `src/data/pageSeo.ts` (hand-tuned per locale) | `organizationLd()` only |
| Event detail (`/event/:id/`, `/en/event/:id/`) | Derived from the event's `title_zh`/`title_en` and `content_zh`/`content_en` (via `metaDescription()`) in `src/data/events/*.ts`; optional `seo` override block on the event record (resolved by `resolvePageSeo()` in `src/lib/seo.ts`) | `eventLd()` in `src/lib/seo.ts`, built from the same event record plus any tagged `src/data/members.ts` speakers |
| People list (`/people/`, `/en/people/`) | `PAGE_SEO` registry in `src/data/pageSeo.ts` (hand-tuned per locale) | `organizationLd()` only |
| Member detail (`/people/:slug/`, `/en/people/:slug/`) | Derived from the member's `name_zh`/`name_en` and `role_zh`/`role_en` in `src/data/members.ts`; optional `seo` override block on the member record | `personLd()` in `src/lib/seo.ts`, built from the same member record |
| 404 (`/404/`) | `PAGE_SEO` registry in `src/data/pageSeo.ts` (hand-tuned per locale) | `organizationLd()` only, plus `<meta name="robots" content="noindex">` via the `head` slot |

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

## Backlink note

Academia Sinica already links to the site from its institutional pages, which helps the
site as a whole. As new member or event pages come online and start to matter (e.g. a
speaker's profile, a flagship event), it is worth asking IEAS or Academia Sinica to add
**deep links to those specific URLs** — not just to the homepage — from their own pages.
Search engines weight individual pages more strongly when they are linked to directly
from an authoritative, already-indexed domain.

## Non-HTML SEO / LLM surfaces

Alongside the HTML pages, the site emits four machine-readable surfaces per locale.
None of these are indexed in `sitemap-index.xml` (endpoints have `route.type ===
'endpoint'`, and `@astrojs/sitemap` filters those out automatically):

| Surface | ZH URL | EN URL | Content-Type |
|---|---|---|---|
| Atom feed | `/event/feed.xml` | `/en/event/feed.xml` | `application/atom+xml; charset=utf-8` |
| Event markdown mirror | `/event/<id>.md` | `/en/event/<id>.md` | `text/markdown; charset=utf-8` |
| Member markdown mirror | `/people/<slug>.md` | `/en/people/<slug>.md` | `text/markdown; charset=utf-8` |
| llms.txt index | `/llms.txt` | `/en/llms.txt` | `text/plain; charset=utf-8` |
| llms-full.txt (all content) | `/llms-full.txt` | `/en/llms-full.txt` | `text/plain; charset=utf-8` |

Extension endpoints (`.xml`, `.md`, `.txt`) are always served without a trailing
slash, regardless of the project's `trailingSlash: 'ignore'` config — internal
references to these URLs must omit the trailing slash. HTML page URLs keep their
trailing slash as before.

Feeds are auto-discovered from every page via two `<link rel="alternate"
type="application/atom+xml">` tags in `BaseLayout.astro`, one per locale, with
`hreflang` on the non-current locale. `llms.txt` is discovered by convention at
`/llms.txt` (llmstxt.org spec).
