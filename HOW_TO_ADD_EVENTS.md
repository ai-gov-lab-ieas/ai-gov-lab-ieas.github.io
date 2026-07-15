# How to Add New Events

This guide explains how to add new events to the 學術活動 (Activities) section of the website.

## Quick Start

**Each event is stored in its own `.ts` file** in the `src/data/events/` folder. Events are
discovered automatically at build time (via a glob import) — there is no index file to edit.

To add a new event:
1. Copy the template file `_template.ts`
2. Rename it (e.g., `lecture-2025-12-20.ts`)
3. Fill in your event details
4. Done! The event will automatically appear on the website

Adding a new event automatically produces, in addition to the HTML pages:
- an entry in `/event/feed.xml` and `/en/event/feed.xml` (Atom feed, newest first)
- markdown mirrors at `/event/<id>.md` and `/en/event/<id>.md`
- a bullet in `/llms.txt`, `/en/llms.txt`, and the full dumps `/llms-full.txt` /
  `/en/llms-full.txt`

No manual update to any index file is needed. See `docs/SEO.md` for the full list
of machine-readable surfaces.

## Step-by-Step Instructions

### Step 1: Copy the Template

Navigate to `src/data/events/` and copy the `_template.ts` file:

```bash
cd src/data/events
cp _template.ts lecture-2025-12-20.ts
```

**File naming convention:** `type-YYYY-MM-DD.ts`
- Examples: `lecture-2025-12-20.ts`, `conf-2025-11-15.ts`, `workshop-2025-10-08.ts`

### Step 2: Edit Your Event File

Open your new file (e.g., `lecture-2025-12-20.ts`) and fill in the details:

```typescript
import { Event } from './types';

export const event: Event = {
  // Match the filename (without .ts)
  id: "lecture-2025-12-20",

  // Event date
  date: "2025-12-20",

  // Year (for grouping)
  year: "2025",

  // Event type
  type: "Lecture",

  // Image (prefer a local file under public/images/events/ — see Image Guidelines below)
  image: "/images/events/2025/lecture-2025-12-20.jpg",

  // Chinese version
  title_zh: "AI 治理工作坊",
  content_zh: "本工作坊將探討人工智慧治理的最新議題...",

  // English version
  title_en: "AI Governance Workshop",
  content_en: "This workshop explores the latest issues in AI governance...",

  // OPTIONAL: see "Optional Fields" below
  // speakers: [...],
  // location_zh / location_en: "...",
  // abstract_zh / abstract_en: "...",
};

export default event;
```

That's it — creating the file is the only step. There is no `index.ts` to update; the event
loader (`src/data/events/loader.ts`) glob-imports every `.ts` file in the folder (except
`types.ts`, `_template.ts`, and itself), validates it, and sorts all events by date automatically.

### Step 3: Save and Verify

1. Save the file
2. Run `npm run dev` (or restart it) and confirm the event appears:
   - On the `/event` (and `/en/event`) list page
   - At `/event/<id>/` and `/en/event/<id>/` — e.g. `/event/lecture-2025-12-20/` and
     `/en/event/lecture-2025-12-20/`
3. Run `npx vitest run tests/events.test.ts && npm run build` — the build validates every
   event file and will fail with a clear error if something is wrong (see Validation below).

## Optional Fields

These three optional field groups can be added after `content_en` (see `_template.ts` for the
exact commented-out snippet to copy):

### Speakers

```typescript
speakers: [
  { member: "tzu-wei-hung" },
  { name_zh: "王小明", name_en: "Xiao-Ming Wang", affiliation_zh: "國立台灣大學", affiliation_en: "NTU" },
],
```

- Lab members are referenced **by slug**: `{ member: "<slug>" }`. Valid slugs are defined in
  `src/data/members.ts`. **A typo'd or unknown slug fails the build on purpose** — this is a
  guardrail, not a bug. If the build errors with "unknown member slug", check the spelling
  against `src/data/members.ts`.
- External (non-lab-member) speakers are referenced by name:
  `{ name_zh: "...", name_en: "...", affiliation_zh: "...", affiliation_en: "..." }`. Both
  `name_zh` and `name_en` are required for external speakers (affiliation fields are optional).
- If no individual speaker is named in the event content (e.g. a multi-speaker conference that
  doesn't credit anyone individually), omit `speakers` entirely rather than guessing.
- Speakers you add here are rendered as `performer` entries in the event's JSON-LD structured
  data, and lab-member speakers make the event show up on that member's page
  (`eventsBySpeaker` in `src/data/events/loader.ts`).

### Venue

```typescript
location_zh: "中央研究院歐美研究所",
location_en: "IEAS, Academia Sinica",
```

Omit these to fall back to the default venue (IEAS, Academia Sinica) in the page's structured
data.

### Abstract

```typescript
abstract_zh: "...",
abstract_en: "...",
```

Shown on the event detail page under the main description, when present.

## Validation

`npm run build` (and `npx vitest run tests/events.test.ts`) validate every event file:

- `id` must be present.
- `date` must match `YYYY-MM-DD`.
- Every `speakers[].member` must match a slug in `src/data/members.ts`.
- Every external speaker (`speakers[]` entry without `member`) must have both `name_zh` and
  `name_en`.
- Event `id`s must be unique across all files.

Fix the reported file/field and re-run the build.

## Image Guidelines

**Prefer local images over remote URLs.** Place event images under
`public/images/events/<year>/` (e.g. `public/images/events/2025/lecture-2025-12-20.jpg`) and
reference them with an absolute path, e.g. `image: "/images/events/2025/lecture-2025-12-20.jpg"`.
Local images are more reliable (no dependence on a third-party host staying up) and load faster.

If you don't have a suitable image yet, Unsplash (https://unsplash.com/) can be used as a
placeholder — search for "technology", "conference", "lecture", "research", and append
`?auto=format&fit=crop&q=80&w=800` to the image URL — but replace it with a local image before
publishing if possible.

### Image Requirements

- **Aspect Ratio**: 16:10 or 16:9 (landscape)
- **Minimum Width**: 800px
- **Format**: JPG or PNG
- **File Size**: Under 500KB

## Event Types

Use these standard types:

- `"Lecture"` - Single speaker
- `"Conference"` - Multi-day event
- `"Workshop"` - Hands-on session
- `"Seminar"` - Small group discussion
- `"Symposium"` - Panel discussion
- `"Talk"` - Casual presentation

## Tips for Writing Descriptions

### Chinese (content_zh)
- 2-4 sentences
- Include: speaker, topic, key points
- Formal academic language

### English (content_en)
- Match Chinese content
- Clear and professional
- Mention international aspects if applicable

## Project Structure

```
src/data/events/
├── _template.ts              # Copy this to create new events
├── types.ts                  # Event type definition
├── loader.ts                 # Glob-imports, validates, and sorts every event file
├── lecture-2025-12-09.ts     # Individual event files
├── lecture-2025-10-08.ts
└── conf-2025-07-03.ts
```

## Troubleshooting

### Event not appearing?

**Check:**
- ✅ File is in `src/data/events/` folder
- ✅ Filename matches the `id` field
- ✅ No syntax errors in the file
- ✅ `npm run build` succeeds (a failing build means an event didn't pass validation)

### Build fails with "unknown member slug"?

A `speakers[].member` value doesn't match any slug in `src/data/members.ts`. Fix the typo or
use an external-speaker entry (`name_zh`/`name_en`) instead if the person isn't a lab member.

### Build fails with "external speakers need both name_zh and name_en"?

An entry in `speakers` has neither a `member` slug nor both `name_zh` and `name_en`. Add the
missing field.

### Syntax error?

**Common issues:**
- Missing comma after a field
- Unclosed quotes in strings
- Wrong import path
- Typo in the `id` field

### Image not loading?

- Confirm the file exists under `public/images/events/...` and the `image` path matches exactly
  (case-sensitive)
- If using a remote URL, test it in a new browser tab and ensure it's publicly accessible

## Benefits of This Structure

✅ **Easy to Add**: Just copy a template and fill it in

✅ **Easy to Edit**: Each event in its own file

✅ **Version Control**: Clean git history (one file per change)

✅ **No Conflicts**: Multiple people can add events simultaneously

✅ **Auto-discovered**: No index file to update — new files are picked up automatically

✅ **Auto-sorted**: Events automatically sorted by date (newest first)

✅ **Type-safe**: TypeScript ensures all fields are correct, and the build validates speaker
slugs and other constraints

## Need Help?

1. Check the `_template.ts` file for guidance
2. Look at existing event files as examples
3. Verify JSON syntax at https://jsonlint.com/
4. Check browser console / build output for error messages
5. Contact the development team

---

**Remember**: Always use the `_template.ts` file as your starting point!
