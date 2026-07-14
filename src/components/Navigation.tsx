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
