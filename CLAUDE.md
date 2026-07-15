# CLAUDE.md

Guidance for AI assistants working in this repository. Human contributors should read
`README.md`, `HOW_TO_ADD_EVENTS.md`, and `docs/SEO.md` first — this file documents
invariants that break silently if violated.

## Invariants

1. **Trailing-slash split.** HTML page URLs (`/`, `/event/`, `/event/<id>/`,
   `/people/<slug>/`, `/en/…`) always carry a trailing slash. Extension endpoints
   (`.xml`, `.md`, `.txt`) never do. Astro serves extension endpoints extensionless
   regardless of `trailingSlash: 'ignore'`; every internal reference (canonical URL,
   Atom `rel="self"`, `llms.txt` bullet, auto-discovery `<link href>`) must match the
   emitted path exactly.

2. **`atom:id` tag-URI mint year is frozen at 2026.** Both the feed-level
   `<id>tag:ai-gov-lab-ieas.github.io,2026:feed/events/<locale></id>` and the
   per-entry `<id>tag:ai-gov-lab-ieas.github.io,2026:events/<event.id></id>` keep
   the same authority date forever. Never rotate on new years, slug renames, or
   URL moves — the `tag:` URI is designed to be permanent.

3. **Feed `<updated>` derives from event dates, never build time.** `buildAtomFeed`
   sets both feed-level and entry-level `<updated>` from `event.date` (`+08:00`).
   Never `Date.now()` or `new Date().toISOString()` — that churns the feed on every
   rebuild and defeats conditional-GET clients.

4. **Content-newline rules — three destinations, three rules.**
   - HTML output (`EventDetailPage.astro`, Atom `<content type="html">`):
     `\n` → `<br />`, then XML-escape.
   - Markdown mirrors (`.md.ts` endpoints, `llms-full.txt`): raw `\n` passthrough,
     **no** `<br />`.
   - Summaries (`<meta description>`, JSON-LD `description`, Atom `<summary>`):
     `metaDescription()` from `src/lib/seo.ts` (strips `<br />`, collapses
     whitespace).
   Do not invent a fourth rule.

5. **Unknown speaker slug must throw** with prefix
   `resolveSpeaker: unknown member slug` — the guardrail-not-a-bug convention from
   `HOW_TO_ADD_EVENTS.md`. `eventLd`, the markdown mirrors, and any future consumer
   share the same throw via `src/lib/render.ts::resolveSpeaker`.

6. **Brand strings are single-source-of-truth.** `SITE_SUFFIX_EN` and
   `SITE_NAME_BILINGUAL_EN` in `src/lib/seo.ts` are canonical; every EN
   `<title>`, `og:site_name`, feed `<title>`, and feed `<author>` reuses them.
   `src/data/content.ts:68-70` has a mirror comment — rename in both places or
   neither.

7. **Endpoints are auto-excluded from the sitemap by design.** `@astrojs/sitemap`
   filters routes to `route.type === 'page'`; `.xml.ts`, `.md.ts`, `.txt.ts` files
   register as `type === 'endpoint'` and never appear in `sitemap-index.xml`. If a
   future contributor renames a `.md.ts` to `.md.astro`, the file becomes a page
   and the sitemap will silently start indexing markdown mirrors, creating
   duplicate-content signals against the canonical HTML pages. Don't.

8. **Adding an event / member requires only the data file.** The glob loader in
   `src/data/events/loader.ts` picks up new events; `MEMBERS` in
   `src/data/members.ts` is a plain typed array. HTML pages, JSON-LD, sitemap,
   Atom feed, `.md` mirrors, `llms.txt`, and `llms-full.txt` all pick up the change
   automatically. Do not add manual entries to any index — if you find yourself
   editing a hand-written index, the change is wrong.

9. **New endpoint routes must be added to the `README.md` route table.** It is
   maintained as a human-facing map of the site's surface area.

10. **Commit body ends with the Co-Authored-By line** for Claude (see any commit
    in `git log` for the exact format).

## Repo layout at a glance

- `src/data/events/*.ts` — one event per file; discovered by the glob loader.
- `src/data/members.ts` — the `MEMBERS` array.
- `src/data/content.ts` — bilingual page/section copy that isn't per-event.
- `src/lib/seo.ts` — JSON-LD builders, brand-string constants, `metaDescription`.
- `src/lib/render.ts` — shared `resolveSpeaker`, `renderEventMarkdown`,
  `renderMemberMarkdown` (used by both HTML templates, the Atom feed, and the
  markdown mirrors).
- `src/lib/atom.ts` — `buildAtomFeed`.
- `src/lib/llmsTxt.ts` — `buildLlmsTxt`, `buildLlmsFull`.
- `src/pages/**` — routes; `src/pages/en/**` mirrors ZH under `/en/`.
- `src/templates/*.astro` — locale-neutral page bodies consumed by both
  `src/pages/<route>.astro` and `src/pages/en/<route>.astro`. Endpoints
  (`.xml.ts` / `.md.ts` / `.txt.ts`) do **not** use templates — they live twice,
  once per locale directory.
- `tests/*.test.ts` — Vitest suite. Tests import source modules directly (no
  build step, no mocks); fixtures are typed literals inline.

## Test contract

`npm test` runs `vitest run` before every build (see
`.github/workflows/deploy.yml`). New shared code must be tested; endpoint
wrappers do not need dedicated tests but their builder functions do.
