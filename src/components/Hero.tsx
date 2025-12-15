import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Lang, CONTENT } from '../data/content';

export const Hero: React.FC<{ lang: Lang }> = ({ lang }) => {
  const [loaded, setLoaded] = useState(false);
  const t = CONTENT[lang].hero;
  
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <header className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-20 px-4 overflow-hidden bg-[#FAFAFA]">
      {/* Dynamic Background Blob */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-blue-400/10 rounded-full blur-[120px] transition-all duration-[2000ms] ${loaded ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} 
      />
      
      <div className="relative z-10 max-w-5xl text-center">
        {/* Label Chip */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-sm font-medium mb-8 transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          {t.label}
        </div>
        
        {/* Massive Typography */}
        <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-slate-900 mb-8 transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {t.title_line1} <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 px-2">
            {t.title_highlight}
          </span>
          {t.title_line2}
        </h1>

        <p className={`text-lg md:text-2xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {t.desc}
        </p>
      </div>

      <div className={`absolute bottom-10 flex flex-col items-center gap-2 animate-bounce transition-opacity duration-1000 delay-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-xs uppercase tracking-widest text-slate-400">{t.scroll}</span>
        <ChevronDown className="text-slate-400" />
      </div>
    </header>
  );
};