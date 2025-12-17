import React, { useState } from 'react';
import { Shield, Scale, ArrowRight, ChevronRight } from 'lucide-react';
import { BentoBox } from './ui/BentoBox';
import { MissionModal } from './ui/MissionModal';
import { Lang, CONTENT } from '../data/content';

export const Mission: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = CONTENT[lang].mission;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="mission" className="py-24 px-4 md:px-8 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">{t.title}</h2>
        </div>

        {/* Main Quote Box - Full width */}
        <div className="mb-8">
          <BentoBox className="bg-slate-900 text-white !border-slate-800 flex flex-col justify-between overflow-hidden">
            <div className="relative z-10 flex flex-col h-full justify-between mt-4">
              <p className="text-2xl md:text-4xl font-light leading-tight text-black">
                "{t.main_quote}"
              </p>
              <div className="mt-8 flex items-center gap-4">
                 <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                    <Shield size={32} className="text-blue-400" />
                 </div>
                 <div className="text-sm text-slate-400">
                    AI Governance <br/>Laboratory
                 </div>
              </div>
            </div>
             {/* Decorative blob */}
             <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/30 rounded-full blur-[80px]" />
          </BentoBox>
        </div>

        {/* Three Expandable Content Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Box 1: AI Challenges & Impact */}
          <BentoBox 
            title={t.box1_title}
            icon={t.box1_icon}
            delay="100ms"
            expandable={true}
            preview={t.box1_preview}
            fullContent={t.box1_full}
            readMoreText={t.read_more}
            readLessText={t.read_less}
          />

          {/* Box 2: Trustworthy AI & Research Innovation */}
          <BentoBox 
            title={t.box2_title}
            icon={t.box2_icon}
            delay="200ms"
            expandable={true}
            preview={t.box2_preview}
            fullContent={t.box2_full}
            readMoreText={t.read_more}
            readLessText={t.read_less}
          />

          {/* Box 3: Research Approach & Innovation */}
          <BentoBox 
            title={t.box3_title}
            icon={t.box3_icon}
            delay="300ms"
            expandable={true}
            preview={t.box3_preview}
            fullContent={t.box3_full}
            readMoreText={t.read_more}
            readLessText={t.read_less}
          />
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full hover:bg-blue-600 transition-all duration-300 font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105"
          >
            {t.view_all}
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Modal */}
        <MissionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={t.title}
          content={t.full_text}
          closeText={t.modal_close}
        />
      </div>
    </section>
  );
};