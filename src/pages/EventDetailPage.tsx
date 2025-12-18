import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, MapPin } from 'lucide-react';
import { Lang, CONTENT, POSTS } from '../data/content';

interface EventDetailPageProps {
  lang: Lang;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({ lang }) => {
  const { eventId } = useParams<{ eventId: string }>();
  const post = POSTS.find((p) => p.id === eventId);

  if (!post) {
    return <Navigate to="/event" replace />;
  }

  // Find related posts (same year, excluding current)
  const relatedPosts = POSTS.filter(
    (p) => p.year === post.year && p.id !== post.id
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* Back Button */}
        <Link
          to="/event"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">
            {lang === 'zh' ? '返回活動列表' : 'Back to Events'}
          </span>
        </Link>

        {/* Event Header */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg mb-8">
          <div className="aspect-[21/9] overflow-hidden bg-slate-100 relative">
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
              className="relative w-full h-full object-contain"
            />
          </div>

          <div className="p-8 md:p-12">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold">
                {post.type}
              </span>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Calendar size={16} />
                <span>{post.date}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
              {lang === 'zh' ? post.title_zh : post.title_en}
            </h1>

            {/* Content */}
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-line">
                {lang === 'zh' ? post.content_zh : post.content_en}
              </p>
            </div>
          </div>
        </div>

        {/* Related Events */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {lang === 'zh' ? '其他活動' : 'Other Events'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/event/${relatedPost.id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={relatedPost.image}
                      alt={lang === 'zh' ? relatedPost.title_zh : relatedPost.title_en}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                      {relatedPost.type}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-2 line-clamp-2">
                      {lang === 'zh' ? relatedPost.title_zh : relatedPost.title_en}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
