# How to Add New Events

This guide explains how to add new events to the 學術活動 (Activities) section of the website.

## Quick Start

**Each event is stored in its own `.ts` file** in the `src/data/events/` folder.

To add a new event:
1. Copy the template file `_template.ts`
2. Rename it (e.g., `lecture-2025-12-20.ts`)
3. Fill in your event details
4. Add the import to `index.ts`
5. Done! The event will automatically appear on the website

## Step-by-Step Instructions

### Step 1: Copy the Template

Navigate to `src/data/events/` and copy the `_template.ts` file:

```bash
cd src/data/events
cp _template.ts lecture-2025-12-20.ts
```

**File naming convention:** `type-YYYY-MM-DD.ts`
- Examples: `lecture-2025-12-20.ts`, `conference-2025-11-15.ts`, `workshop-2025-10-08.ts`

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

  // Image URL
  image: "https://images.unsplash.com/photo-XXXXXXX?auto=format&fit=crop&q=80&w=800",

  // Chinese version
  title_zh: "AI 治理工作坊",
  content_zh: "本工作坊將探討人工智慧治理的最新議題...",

  // English version
  title_en: "AI Governance Workshop",
  content_en: "This workshop explores the latest issues in AI governance...",
};

export default event;
```

### Step 3: Add Import to Index File

Open `src/data/events/index.ts` and add your event:

```typescript
// 1. Add import at the top
import lecture20251220 from './lecture-2025-12-20';

// 2. Add to the array
const allEvents: Event[] = [
  lecture20251220,  // ← Add your event here
  lecture20251209,
  lecture20251008,
  conf20250703,
];
```

### Step 4: Save and Verify

1. Save all files
2. The dev server will automatically reload
3. Check that your event appears:
   - ✅ In the first 3 on homepage (if it's recent)
   - ✅ On `/event` page
   - ✅ At `/event/your-event-id`

## Event Fields Reference

| Field | Required | Type | Description | Example |
|-------|----------|------|-------------|---------|
| `id` | ✅ Yes | string | Unique identifier, matches filename | `"lecture-2025-12-20"` |
| `date` | ✅ Yes | string | Event date (YYYY-MM-DD) | `"2025-12-20"` |
| `year` | ✅ Yes | string | Year for grouping | `"2025"` |
| `type` | ✅ Yes | string | Event category | `"Lecture"`, `"Conference"` |
| `image` | ✅ Yes | string | Image URL (16:10 ratio) | Full URL |
| `title_zh` | ✅ Yes | string | Chinese title | Full title |
| `title_en` | ✅ Yes | string | English title | Full title |
| `content_zh` | ✅ Yes | string | Chinese description | Full description |
| `content_en` | ✅ Yes | string | English description | Full description |

## Complete Example

### File: `src/data/events/workshop-2025-12-20.ts`

```typescript
import { Event } from './types';

export const event: Event = {
  id: "workshop-2025-12-20",
  date: "2025-12-20",
  year: "2025",
  type: "Workshop",
  image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",

  title_zh: "AI 治理工作坊",
  content_zh: "本工作坊將探討人工智慧治理的最新議題，包括演算法透明度、資料保護與倫理規範。邀請國內外專家學者共同參與討論。",

  title_en: "AI Governance Workshop",
  content_en: "This workshop explores the latest issues in AI governance, including algorithmic transparency, data protection, and ethical standards. Featuring experts from Taiwan and abroad.",
};

export default event;
```

### Update: `src/data/events/index.ts`

```typescript
// Add import
import workshop20251220 from './workshop-2025-12-20';

// Add to array
const allEvents: Event[] = [
  workshop20251220,  // ← New event
  lecture20251209,
  lecture20251008,
  conf20250703,
];
```

## Image Guidelines

### Where to Get Images

1. **Unsplash** (Free): https://unsplash.com/
   - Search: "technology", "conference", "lecture", "research"
   - Add to URL: `?auto=format&fit=crop&q=80&w=800`

2. **Your Own Images**:
   - Upload to image hosting service
   - Use direct image URL

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
├── index.ts                  # Imports all events
├── lecture-2025-12-09.ts     # Individual event files
├── lecture-2025-10-08.ts
└── conf-2025-07-03.ts
```

## Troubleshooting

### Event not appearing?

**Check:**
- ✅ File is in `src/data/events/` folder
- ✅ Filename matches the `id` field
- ✅ Event is imported in `index.ts`
- ✅ Event is added to `allEvents` array
- ✅ No syntax errors in the file

### Syntax error?

**Common issues:**
- Missing comma after a field
- Unclosed quotes in strings
- Wrong import path
- Typo in the `id` field

### Image not loading?

- Test the URL in a new browser tab
- Ensure the URL is publicly accessible
- Try a different image

## Benefits of This Structure

✅ **Easy to Add**: Just copy a template and fill it in

✅ **Easy to Edit**: Each event in its own file

✅ **Version Control**: Clean git history (one file per change)

✅ **No Conflicts**: Multiple people can add events simultaneously

✅ **Auto-sorted**: Events automatically sorted by date (newest first)

✅ **Type-safe**: TypeScript ensures all fields are correct

## Need Help?

1. Check the `_template.ts` file for guidance
2. Look at existing event files as examples
3. Verify JSON syntax at https://jsonlint.com/
4. Check browser console for error messages
5. Contact the development team

---

**Remember**: Always use the `_template.ts` file as your starting point!
