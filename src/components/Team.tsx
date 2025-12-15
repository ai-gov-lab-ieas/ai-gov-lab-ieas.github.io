import React from 'react';
import { Plus } from 'lucide-react';
import { Lang, CONTENT, MEMBERS } from '../data/content';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export const Team: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = CONTENT[lang].team;
  const ref = useIntersectionObserver();

  return (
    <section id="team" className="py-32 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">{t.title}</h2>
          <p className="text-slate-500 max-w-sm text-left md:text-right">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MEMBERS.map((member, idx) => (
            <div 
              key={member.id}
              // @ts-ignore
              ref={ref}
              style={{ transitionDelay: `${idx * 100}ms` }}
              className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 opacity-0 translate-y-8"
            >
              <div className="aspect-[4/5] overflow-hidden bg-slate-100">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                />
              </div>
              
              {/* Overlay Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-bold text-lg leading-tight">{member.name}</h3>
                  <p className="text-blue-300 text-xs font-medium mb-2 mt-1">{lang === 'zh' ? member.role_zh : member.role_en}</p>
                  <div className="flex flex-wrap gap-1">
                    {member.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[10px] text-white uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Default State (Visible when not hovering) */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-white group-hover:translate-y-full transition-transform duration-300 border-t border-slate-50">
                 <h3 className="text-slate-900 font-bold text-lg">{member.name}</h3>
                 <p className="text-slate-500 text-xs mt-1">{lang === 'zh' ? member.role_zh : member.role_en}</p>
              </div>
            </div>
          ))}
          
          {/* Join Us Card */}
          <div className="bg-slate-100 rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center p-6 text-center hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer group min-h-[300px]">
             <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-blue-600 mb-4 transition-colors shadow-sm group-hover:scale-110 duration-300">
                <Plus size={24} />
             </div>
             <h3 className="font-bold text-slate-900">{t.join_title}</h3>
             <p className="text-sm text-slate-500 mt-2">{t.join_desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
};