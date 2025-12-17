import React, { useState, useEffect } from 'react';
import { Brain, Globe } from 'lucide-react';
import { Lang, CONTENT } from '../data/content';

interface NavigationProps {
  lang: Lang;
  setLang: (l: Lang) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ lang, setLang }) => {
  const [scrolled, setScrolled] = useState(false);
  const t = CONTENT[lang].nav;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav 
        className={`
          pointer-events-auto flex items-center gap-2 sm:gap-6 px-4 py-3 sm:px-6 sm:py-4 rounded-full 
          backdrop-blur-xl transition-all duration-500 ease-out border border-white/20 shadow-2xl
          ${scrolled ? 'bg-black/80 text-white scale-95' : 'bg-white/80 text-slate-900'}
        `}
      >
        <div 
          className="flex items-center gap-2 font-bold tracking-tight cursor-pointer mr-2" 
          onClick={() => window.scrollTo({top:0, behavior:'smooth'})}
        >
          <Brain size={20} className={scrolled ? "text-blue-400" : "text-blue-600"} />
          <span className="hidden sm:inline">AI 治理觀念實驗室</span>
        </div>

        <div className={`w-px h-4 bg-current opacity-20 mx-1 hidden sm:block`} />

        <div className="flex gap-1 sm:gap-2">
          <button onClick={() => scrollTo('mission')} className="px-3 py-1 text-xs sm:text-sm font-medium rounded-full hover:bg-white/10 transition-colors">{t.mission}</button>
          <button onClick={() => scrollTo('team')} className="px-3 py-1 text-xs sm:text-sm font-medium rounded-full hover:bg-white/10 transition-colors">{t.team}</button>
          <button onClick={() => scrollTo('events')} className="px-3 py-1 text-xs sm:text-sm font-medium rounded-full hover:bg-white/10 transition-colors">{t.events}</button>
        </div>
        
        <button 
          onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
          className={`
            ml-2 p-2 rounded-full transition-transform hover:scale-110 flex items-center gap-1 text-xs font-bold
            ${scrolled ? 'bg-white text-black' : 'bg-black text-white'}
          `}
        >
          <Globe size={14} />
          {lang === 'zh' ? 'EN' : '中'}
        </button>
      </nav>
    </div>
  );
};