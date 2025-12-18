import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, ChevronRight } from 'lucide-react';
import { Lang, CONTENT, POSTS } from '../data/content';

export const Activities: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = CONTENT[lang].activities;

  // Show only the latest 3 events
  const latestPosts = POSTS.slice(0, 3);

  return (
    <section id="events" className="py-24 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-16 text-center">
          {t.title}
        </h2>

        {/* Grid Layout for Latest 3 Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPosts.map((post) => (
            <Link
              key={post.id}
              to={`/event/${post.id}`}
              className="group cursor-pointer bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="aspect-square overflow-hidden bg-slate-100 relative">
                {/* Blurred background */}
                <img
                  src={post.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-60"
                  aria-hidden="true"
                />
                {/* Main image */}
                <img
                  src={post.image}
                  alt={lang === 'zh' ? post.title_zh : post.title_en}
                  className="relative w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
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
                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                  {lang === 'zh' ? post.title_zh : post.title_en}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                  {lang === 'zh' ? post.content_zh : post.content_en}
                </p>
                <div className="flex items-center text-blue-600 text-sm font-bold mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                  {t.read_more} <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Events Button */}
        <div className="mt-12 text-center">
          <Link
            to="/event"
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full hover:bg-blue-600 transition-all duration-300 font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105"
          >
            {lang === 'zh' ? '查看所有活動' : 'View All Events'}
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};
