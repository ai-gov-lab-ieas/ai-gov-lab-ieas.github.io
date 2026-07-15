# AI Governance Laboratory Website

A modern, bilingual website for the AI Governance Laboratory at Academia Sinica's Institute of European and American Studies.

## 📖 Overview

This project features a content-driven architecture with a modern, Apple/Google-inspired design aesthetic. Built with Astro, React, TypeScript, and TailwindCSS v4, it emphasizes:

- **Bilingual Support**: Statically-rendered ZH-TW and EN pages at parallel URLs
- **SEO-first**: Per-page canonical URLs, hreflang alternates, Open Graph tags, a build-time sitemap, and JSON-LD structured data (see `docs/SEO.md`)
- **Modern Design**: Bento grid layouts, scroll-driven animations, and dynamic navigation
- **Content-First Architecture**: Events and member bios centralized in typed data files for easy updates
- **Responsive**: Optimized for desktop and mobile devices

## 🎨 Design Features

- **Bento Grid Layouts**: Modern card-based sections inspired by Apple/Google design language
- **Scroll Animations**: Intersection Observer-based fade-in effects
- **Dynamic Navigation**: Floating language switcher with smooth transitions
- **Typography-First**: Large, bold headings with tight letter spacing
- **Glassmorphism**: Subtle backdrop blur and transparency effects

## 🏗️ Project Structure

```
ai-gov-lab-ieas.github.io/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── BentoBox.tsx       # Reusable Bento card component
│   │   ├── Navigation.tsx         # Header with language switcher
│   │   ├── Hero.astro             # Landing section
│   │   ├── Mission.tsx            # Mission statement with Bento grid
│   │   ├── Team.tsx               # Team members section
│   │   ├── Activities.tsx         # Events and news section (latest 3)
│   │   └── Footer.astro           # Footer with links
│   ├── pages/                     # Astro file-based routes (zh at /, en at /en/)
│   │   ├── index.astro            # Homepage (zh)
│   │   ├── en/index.astro         # Homepage (en)
│   │   ├── event/                 # Event list + [id] detail (zh)
│   │   ├── en/event/               # Event list + [id] detail (en)
│   │   ├── people/                 # People list + [slug] detail (zh)
│   │   ├── en/people/              # People list + [slug] detail (en)
│   │   └── 404.astro               # Not-found page
│   ├── layouts/
│   │   └── BaseLayout.astro       # Shared <head>, nav, footer, SEO tags
│   ├── lib/
│   │   ├── i18n.ts                # Locale-aware path helpers
│   │   └── seo.ts                 # JSON-LD builders, meta description helper
│   ├── data/
│   │   ├── events/                # Individual event files, glob-loaded and validated
│   │   │   ├── _template.ts       # Template for new events
│   │   │   ├── types.ts           # Event type definition
│   │   │   ├── index.ts           # Loads and validates all events
│   │   │   └── *.ts               # Individual event files
│   │   ├── members.ts             # Bilingual member/team data with slugs
│   │   └── content.ts             # Remaining bilingual site content
│   ├── hooks/
│   │   └── useIntersectionObserver.ts  # Scroll animation hook
│   └── styles/
│       └── global.css             # Global styles and Tailwind imports
├── public/
│   └── robots.txt                 # Crawler policy + sitemap pointer
├── HOW_TO_ADD_EVENTS.md           # Guide for adding new events
├── docs/
│   └── SEO.md                     # Search Console / Bing setup, SEO metadata reference
├── astro.config.mjs               # Astro configuration (site URL, integrations)
├── tsconfig.json                  # TypeScript configuration
└── tailwind.config.js             # TailwindCSS configuration
```

## 📦 Tech Stack

- **Framework**: Astro 5 (static output), with React 18 islands for interactive components
- **Language**: TypeScript 5
- **Styling**: TailwindCSS v4 via `@tailwindcss/vite`
- **Sitemap**: `@astrojs/sitemap`
- **Testing**: Vitest
- **Deployment**: GitHub Pages via GitHub Actions

## 🗺️ Routing Structure

The site is statically rendered by Astro using file-based routing under `src/pages/`.
Traditional Chinese is the default locale at the site root; English lives under `/en/`:

- `/` - Homepage (zh)
- `/en/` - Homepage (en)
- `/event/` - All events archive page (zh)
- `/en/event/` - All events archive page (en)
- `/event/:id/` - Individual event detail page (zh)
- `/en/event/:id/` - Individual event detail page (en)
- `/people/` - Team/people list page (zh)
- `/en/people/` - Team/people list page (en)
- `/people/:slug/` - Individual member detail page (zh)
- `/en/people/:slug/` - Individual member detail page (en)
- `/404/` - Not-found page (noindex)

The homepage displays the **latest 3 events** with a "View All Events" button linking to the full archive.

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.0.0 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/ai-gov-lab-ieas.github.io.git
cd ai-gov-lab-ieas.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:4321
```

### Run Tests

```bash
npm test
```

Runs the Vitest suite, including event/member data validation. This also runs in CI
before every build (see `.github/workflows/deploy.yml`).

### Build for Production

```bash
npm run build
```

The production-ready static files (including `sitemap-index.xml` and `robots.txt`) will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🛠️ Development Workflow

### Updating Content

Most non-event, non-member site content is still centralized in `src/data/content.ts`. To update text:

1. Navigate to `src/data/content.ts`
2. Locate the content you want to modify
3. Update the text for both `zh` (Chinese) and `en` (English) versions
4. Save the file - changes will reflect immediately via hot module reloading

Example:
```typescript
export const CONTENT = {
  zh: {
    hero: {
      title_line1: "治理",
      desc: "AI 治理觀念實驗室..."
    }
  },
  en: {
    hero: {
      title_line1: "Governance for the",
      desc: "Bridging the gap..."
    }
  }
};
```

### Adding Team Members

Team members live in `src/data/members.ts` as a typed, bilingual array with slugs (used
for each member's `/people/:slug/` detail page and JSON-LD `Person` data):

```typescript
export const MEMBERS: Member[] = [
  {
    slug: "jane-doe",
    name_zh: "中文名",
    name_en: "Jane Doe",
    role_zh: "職位",
    role_en: "Position",
    bio_zh: "...",
    bio_en: "...",
    image: "/images/members/jane-doe.jpg",
    url: "https://...",
  },
  // Add more members...
];
```

### Adding News/Events

**📖 See [HOW_TO_ADD_EVENTS.md](./HOW_TO_ADD_EVENTS.md) for a comprehensive guide!**

**Each event is stored in its own `.ts` file** for easy management, and is discovered and
validated automatically at build time by `src/data/events/index.ts`:

1. Copy `src/data/events/_template.ts`
2. Rename it (e.g., `lecture-2025-12-20.ts`)
3. Fill in the event details
4. Save — no import to register the file is needed, it is picked up by the glob loader

```typescript
// File: src/data/events/lecture-2025-12-20.ts
import { Event } from './types';

export const event: Event = {
  id: "lecture-2025-12-20",  // Format: type-YYYY-MM-DD
  date: "2025-12-20",
  year: "2025",
  type: "Lecture",
  image: "https://...",
  title_zh: "中文標題",
  title_en: "English Title",
  content_zh: "中文內容",
  content_en: "English Content"
};

export default event;
```

**Key Points:**
- The latest 3 events automatically appear on the homepage
- All events are viewable at `/event` (zh) and `/en/event` (en)
- Each event gets its own detail page at `/event/:id/` and `/en/event/:id/`
- Events are automatically organized by year on the archive page
- Tag speakers who are lab members (see `HOW_TO_ADD_EVENTS.md`) so they get linked to their `/people/:slug/` page and included in the event's JSON-LD

### Creating New Components

1. Create a new file in `src/components/` (or `src/components/ui/` for reusable UI elements)
2. Define your component with TypeScript interfaces:
```typescript
interface MyComponentProps {
  title: string;
  lang: Lang;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, lang }) => {
  return <div>{title}</div>;
};
```
3. Import and use it as a React island (`client:load`) from an `.astro` page, or compose it directly in an `.astro` file

### Adding Animations

The project uses Intersection Observer for scroll animations. The `BentoBox` component includes built-in fade-in animations. To add custom animations:

1. Use the existing `useIntersectionObserver` hook in `src/components/ui/BentoBox.tsx` as a reference
2. Or add custom CSS transitions/animations in your component's className

## 🌐 Bilingual Support

The website supports Traditional Chinese and English as two fully static, statically-rendered locales:

- Traditional Chinese at the site root (`/...`), English under `/en/...`
- Language switcher in the navigation bar links between the equivalent zh/en path
- Every page declares reciprocal `hreflang` alternates and a canonical URL (see `docs/SEO.md`)

## 🔍 SEO

**📖 See [docs/SEO.md](./docs/SEO.md)** for how metadata (titles, descriptions, JSON-LD)
flows from data files to rendered pages, the one-time Google Search Console / Bing
Webmaster Tools setup, and how to validate structured data.

## 🎯 Key Features

- ✅ Fully responsive design
- ✅ Bilingual (EN/ZH-TW) with easy content management
- ✅ Modern Bento grid layouts
- ✅ Smooth scroll animations
- ✅ SEO metadata, sitemap, and structured data out of the box
- ✅ Type-safe with TypeScript
- ✅ Hot module reloading for fast development
- ✅ Production-ready static build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Notes

- **TailwindCSS v4**: This project uses TailwindCSS v4 with the new `@tailwindcss/postcss`/`@tailwindcss/vite` plugin
- **Content Updates**: Non-developers can safely update `src/data/content.ts` without touching component code
- **Icon System**: Uses Lucide React for consistent, lightweight icons
- **Image Hosting**: Update image URLs in `content.ts` / `members.ts` / event files to use your preferred image hosting service

## 📄 License

Distributed under the MIT License.

## 🔗 Links

- Academia Sinica IEAS: [https://www.ea.sinica.edu.tw](https://www.ea.sinica.edu.tw)
- AI Governance Laboratory: [Your Lab URL]
