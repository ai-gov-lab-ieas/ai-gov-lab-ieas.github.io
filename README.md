# AI Governance Concepts Lab Website

A modern, bilingual website for the AI Governance Concepts Laboratory at Academia Sinica's Institute of European and American Studies.

## 📖 Overview

This project features a content-driven architecture with a modern, Apple/Google-inspired design aesthetic. Built with React, TypeScript, and TailwindCSS v4, it emphasizes:

- **Bilingual Support**: Seamless EN/ZH-TW language switching
- **Modern Design**: Bento grid layouts, scroll-driven animations, and dynamic navigation
- **Content-First Architecture**: All text content centralized in a single data file for easy updates
- **Responsive**: Optimized for desktop and mobile devices

## 🎨 Design Features

- **Bento Grid Layouts**: Modern card-based sections inspired by Apple/Google design language
- **Scroll Animations**: Intersection Observer-based fade-in effects
- **Dynamic Navigation**: Floating language switcher with smooth transitions
- **Typography-First**: Large, bold headings with tight letter spacing
- **Glassmorphism**: Subtle backdrop blur and transparency effects

## 🏗️ Project Structure

```
dec-ai-lab/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── BentoBox.tsx       # Reusable Bento card component
│   │   ├── Navigation.tsx         # Header with language switcher
│   │   ├── Hero.tsx               # Landing section
│   │   ├── Mission.tsx            # Mission statement with Bento grid
│   │   ├── Team.tsx               # Team members section
│   │   └── Activities.tsx         # Events and news section
│   ├── data/
│   │   └── content.ts             # All bilingual content (single source of truth)
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global styles and Tailwind imports
├── index.html                     # HTML entry point
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.js             # TailwindCSS configuration
└── postcss.config.js              # PostCSS configuration
```

## 📦 Tech Stack

- **Framework**: React 18
- **Language**: TypeScript 5
- **Build Tool**: Vite 5
- **Styling**: TailwindCSS v4 with PostCSS
- **Icons**: Lucide React
- **Deployment**: GitHub Pages Ready

## 🚀 Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/dec-ai-lab.git
cd dec-ai-lab
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
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🛠️ Development Workflow

### Updating Content

All website content is centralized in `src/data/content.ts`. To update text:

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

Update the `MEMBERS` array in `src/data/content.ts`:

```typescript
export const MEMBERS = [
  {
    id: 1,
    name: "Name (中文名)",
    role_zh: "職位",
    role_en: "Position",
    image: "https://...",
    tags: ["Tag1", "Tag2"]
  },
  // Add more members...
];
```

### Adding News/Events

Update the `POSTS` array in `src/data/content.ts`:

```typescript
export const POSTS = [
  {
    id: "unique-id",
    date: "2025-12-09",
    year: "2025",
    type: "Lecture",
    image: "https://...",
    title_zh: "中文標題",
    title_en: "English Title",
    content_zh: "中文內容",
    content_en: "English Content"
  },
  // Add more posts...
];
```

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
3. Import and use it in `App.tsx` or other components

### Adding Animations

The project uses Intersection Observer for scroll animations. The `BentoBox` component includes built-in fade-in animations. To add custom animations:

1. Use the existing `useIntersectionObserver` hook in `src/components/ui/BentoBox.tsx` as a reference
2. Or add custom CSS transitions/animations in your component's className

## 🌐 Bilingual Support

The website supports seamless language switching between English and Traditional Chinese:

- Language switcher in the navigation bar
- All content managed through a centralized `Lang` type system
- URL hash-based navigation works in both languages

## 🎯 Key Features

- ✅ Fully responsive design
- ✅ Bilingual (EN/ZH-TW) with easy content management
- ✅ Modern Bento grid layouts
- ✅ Smooth scroll animations
- ✅ Optimized for performance
- ✅ Type-safe with TypeScript
- ✅ Hot module reloading for fast development
- ✅ Production-ready build system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Notes

- **TailwindCSS v4**: This project uses TailwindCSS v4 with the new `@tailwindcss/postcss` plugin
- **Content Updates**: Non-developers can safely update `src/data/content.ts` without touching component code
- **Icon System**: Uses Lucide React for consistent, lightweight icons
- **Image Hosting**: Update image URLs in `content.ts` to use your preferred image hosting service

## 📄 License

Distributed under the MIT License.

## 🔗 Links

- Academia Sinica IEAS: [https://www.ea.sinica.edu.tw](https://www.ea.sinica.edu.tw)
- AI Governance Concepts Lab: [Your Lab URL]
