import React from 'react';
import { Shield, Scale, ArrowRight } from 'lucide-react';
import { BentoBox } from './ui/BentoBox';
import { Lang, CONTENT } from '../data/content';

export const Mission: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = CONTENT[lang].mission;

  return (
    <section id="mission" className="py-24 px-4 md:px-8 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">{t.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
          {/* Main Large Box */}
          <BentoBox className="md:col-span-2 md:row-span-2 bg-slate-900 text-white !border-slate-800 flex flex-col justify-between overflow-hidden">
            <div className="relative z-10 flex flex-col h-full justify-between mt-4">
              <p className="text-2xl md:text-4xl font-light leading-tight text-slate-200">
                "{t.main_quote}"
              </p>
              <div className="mt-8 flex items-center gap-4">
                 <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                    <Shield size={32} className="text-blue-400" />
                 </div>
                 <div className="text-sm text-slate-400">
                    AI Safety &<br/>Ethical Alignment
                 </div>
              </div>
            </div>
             {/* Decorative blob */}
             <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/30 rounded-full blur-[80px]" />
          </BentoBox>

          {/* Side Box 1 */}
          <BentoBox title={t.box1_title} subtitle="Research Focus" delay="100ms">
            <Scale className="text-blue-600 mb-4" size={40} />
            <p className="text-slate-600">{t.box1_desc}</p>
          </BentoBox>

          {/* Side Box 2 */}
          <BentoBox title={t.box2_title} subtitle="Strategy" delay="200ms">
             <p className="text-slate-600 mb-4">{t.box2_desc}</p>
             <div className="flex items-center justify-between mt-auto">
               <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">TW</div>
                  <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white" />
                  <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white" />
               </div>
               <ArrowRight className="text-slate-300 group-hover:text-blue-600 transition-colors" />
            </div>
          </BentoBox>
        </div>
      </div>
    </section>
  );
};