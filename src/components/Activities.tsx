import React, { useState } from 'react';
import { ArrowRight, X, Calendar } from 'lucide-react';
import { Lang, CONTENT, POSTS } from '../data/content';

export const Activities: React.FC<{ lang: Lang }> = ({ lang }) => {
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const t = CONTENT[lang].activities;

  const currentPost = POSTS.find(p => p.id === selectedPost);

  return (
    <section id="events" className="py-24 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-16 text-center">{t.title}</h2>
        
        {/* Horizontal Scroll / Grid Layout for Blog Previews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {POSTS.map((post) => (
            <div 
              key={post.id}
              onClick={() => setSelectedPost(post.id)}
              className="group cursor-pointer bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                   src={post.image} 
                   alt="cover" 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm uppercase tracking-wide">
                  {post.type}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400">
                   <Calendar size={12} />
                   {post.date}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                  {lang === 'zh' ? post.title_zh : post.title_en}
                </h3>
                <div className="flex items-center text-blue-600 text-sm font-bold mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                  {t.read_more} <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Screen Article Overlay (Product Detail View) */}
      {selectedPost && currentPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedPost(null)}
          />
          
          <div className="relative w-full max-w-4xl max-h-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in">
            {/* Close Button */}
            <button 
               onClick={() => setSelectedPost(null)}
               className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/50 backdrop-blur hover:bg-white text-slate-900 transition-all shadow-sm"
            >
               <X size={24} />
            </button>

            {/* Article Image */}
            <div className="h-64 md:h-96 shrink-0 relative">
               <img 
                  src={currentPost.image} 
                  alt="Detail" 
                  className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
               <div className="absolute bottom-8 left-8 right-8 text-white">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-xs font-bold mb-3">
                    {currentPost.type}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                    {lang === 'zh' ? currentPost.title_zh : currentPost.title_en}
                  </h2>
               </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12">
               <div className="prose prose-lg prose-slate max-w-none">
                  <p className="text-xl text-slate-500 font-light mb-8 leading-relaxed">
                     {lang === 'zh' ? currentPost.content_zh : currentPost.content_en}
                  </p>
                  <hr className="my-8 border-slate-100" />
                  {/* More mock content to make it look full */}
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
               </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};