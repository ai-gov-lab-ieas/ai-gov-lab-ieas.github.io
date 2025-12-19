import React, { useState } from 'react';
import { Plus, Users, X, ExternalLink } from 'lucide-react';
import { Lang, CONTENT, MEMBERS, COLLABORATORS } from '../data/content';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export const Team: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = CONTENT[lang].team;
  const ref = useIntersectionObserver();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section id="team" className="py-32 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">{t.title}</h2>
            <p className="text-slate-500 max-w-sm text-left md:text-right">{t.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {MEMBERS.map((member, idx) => (
              <a
                key={member.id}
                href={member.url}
                target="_blank"
                rel="noopener noreferrer"
                // @ts-ignore
                ref={ref}
                style={{ transitionDelay: `${idx * 50}ms` }}
                className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 opacity-0 translate-y-8 block cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden relative">
                  {/* Blurred background to fill blank spaces */}
                  <div className="absolute inset-0">
                    <img
                      src={member.image}
                      alt=""
                      className="w-full h-full object-cover blur-2xl scale-110"
                    />
                  </div>

                  {/* Main image */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-contain relative z-10 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                  />
                </div>

                {/* Overlay Content */}
                <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-1 mb-1">
                      <h3 className="text-white font-bold text-xs leading-tight">{member.name}</h3>
                      <ExternalLink size={12} className="text-white/80 flex-shrink-0" />
                    </div>
                    <p className="text-blue-300 text-[10px] font-medium mb-2">{lang === 'zh' ? member.role_zh : member.role_en}</p>
                    <div className="flex flex-wrap gap-1">
                      {member.tags.map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 rounded bg-white/20 backdrop-blur-md text-[8px] text-white uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Default State (Visible when not hovering) */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-white group-hover:translate-y-full transition-transform duration-300 border-t border-slate-50 z-20">
                   <h3 className="text-slate-900 font-bold text-xs leading-tight">{lang === 'zh' ? member.name_zh : member.name_en}</h3>
                   <p className="text-slate-500 text-[10px] mt-0.5">{lang === 'zh' ? member.role_zh.split('/')[0].trim() : member.role_en.split('/')[0].trim()}</p>
                </div>
              </a>
            ))}

            {/* Collaborators Card */}
            <button
              onClick={() => setShowModal(true)}
              className="aspect-[3/4] bg-blue-50 rounded-2xl border border-blue-200 flex flex-col items-center justify-center p-4 text-center hover:bg-blue-100 hover:border-blue-300 transition-colors cursor-pointer group"
            >
               <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-500 group-hover:text-blue-600 mb-3 transition-colors shadow-sm group-hover:scale-110 duration-300">
                  <Users size={20} />
               </div>
               <h3 className="font-bold text-slate-900 text-xs mb-1">{t.collaborators_title}</h3>
               <p className="text-[10px] text-slate-500">{t.collaborators_desc}</p>
            </button>

            {/* Join Us Card */}
            <div className="aspect-[3/4] bg-slate-100 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center p-4 text-center hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer group">
               <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-blue-600 mb-3 transition-colors shadow-sm group-hover:scale-110 duration-300">
                  <Plus size={20} />
               </div>
               <h3 className="font-bold text-slate-900 text-xs mb-1">{t.join_title}</h3>
               <p className="text-[10px] text-slate-500">{t.join_desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Collaborators Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-2xl font-bold text-slate-900">
                {lang === 'zh' ? '合作夥伴' : 'Collaborators'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {COLLABORATORS.map((category) => (
                <div key={category.id}>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                    {lang === 'zh' ? category.category_zh : category.category_en}
                  </h3>
                  <div className="space-y-4">
                    {category.members.map((member, idx) => (
                      <a
                        key={idx}
                        href={member.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {lang === 'zh' ? member.name_zh : member.name_en}
                            </h4>
                            <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {lang === 'zh' ? member.role_zh : member.role_en}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
