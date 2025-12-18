import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Lang, CONTENT, POSTS } from '../data/content';

interface EventsPageProps {
  lang: Lang;
}

export const EventsPage: React.FC<EventsPageProps> = ({ lang }) => {
  const t = CONTENT[lang].activities;

  // Group posts by year
  const postsByYear = POSTS.reduce((acc, post) => {
    if (!acc[post.year]) {
      acc[post.year] = [];
    }
    acc[post.year].push(post);
    return acc;
  }, {} as Record<string, typeof POSTS>);

  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link
            to="/#events"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">{lang === 'zh' ? '返回首頁' : 'Back to Home'}</span>
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-4">
            {t.title}
          </h1>
          <p className="text-slate-500 text-lg">
            {lang === 'zh' ? `共 ${POSTS.length} 場活動` : `${POSTS.length} Events`}
          </p>
        </div>

        {/* Events by Year */}
        <div className="space-y-16">
          {years.map((year) => (
            <div key={year}>
              <div className="sticky top-20 bg-[#FAFAFA]/90 backdrop-blur-sm py-3 mb-8 border-b border-slate-200 z-10">
                <h2 className="text-2xl font-bold text-slate-900">{year}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {postsByYear[year].map((post) => (
                  <Link
                    key={post.id}
                    to={`/event/${post.id}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
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
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                          {post.type}
                        </span>
                        <div className="flex items-center gap-1 text-slate-500 text-xs">
                          <Calendar size={14} />
                          <span>{post.date}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                        {lang === 'zh' ? post.title_zh : post.title_en}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {lang === 'zh' ? post.content_zh : post.content_en}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
