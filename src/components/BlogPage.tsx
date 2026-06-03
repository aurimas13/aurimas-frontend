import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { blogCategories } from '../data/blogCategories';
import { translations } from '../data/translations';
import { LanguageCode } from '../contexts/LanguageContext';
import { LocalizedText } from '../types';

export const BlogPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as LanguageCode];

  const getLocalizedText = (text: string | LocalizedText | undefined): string => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    return text[currentLanguage as keyof LocalizedText] || text.en || '';
  };

  const validCategories = Object.keys(blogCategories);
  if (!category || !validCategories.includes(category)) {
    return <Navigate to="/blogs" replace />;
  }

  const categoryData = blogCategories[category as keyof typeof blogCategories];
  const categoryTitle = categoryData.title[currentLanguage as LanguageCode];
  const categoryDescription = categoryData.description[currentLanguage as LanguageCode];

  const posts = JSON.parse(localStorage.getItem('blog-posts') || '[]');
  const categoryPosts = posts.filter((post: any) => post.category === category);

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 mb-12 font-mono uppercase text-[11px] tracking-[0.22em] text-ink-mute hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          {t.blogs.allBlogs}
        </Link>

        <div className="mb-12 reveal reveal-d2">
          <p className="eyebrow mb-3">— {categoryTitle}</p>
          <h1 className="display-lg text-ink" style={{ fontSize: 'clamp(40px, 6vw, 80px)', fontVariationSettings: '"opsz" 96, "wght" 440' }}>
            {categoryTitle}.
          </h1>
          <p
            className="font-display text-ink-soft mt-6 max-w-[640px]"
            style={{ fontSize: 'clamp(18px, 2vw, 22px)', lineHeight: 1.5, fontVariationSettings: '"opsz" 18, "wght" 400' }}
          >
            {categoryDescription}
          </p>
        </div>

        {categoryPosts.length > 0 ? (
          <div className="border-t border-[rgba(26,22,18,0.32)]">
            {categoryPosts.map((post: any, index: number) => (
              <article key={index} className="border-b border-[rgba(26,22,18,0.14)] hover:bg-paper-deep/60 transition-colors">
                <Link to={`/blogs/${category}/${post.id}`} className="block py-8 px-2">
                  <div className="flex items-baseline gap-4 mb-3 flex-wrap">
                    <span className="meta uppercase tracking-[0.22em]">{categoryTitle}</span>
                    <time className="meta uppercase tracking-[0.22em]">
                      {new Date(post.publishedAt || post.date || post.createdAt).toLocaleDateString(
                        currentLanguage === 'en' ? 'en-US' : currentLanguage === 'lt' ? 'lt-LT' : 'fr-FR',
                        { year: 'numeric', month: 'long', day: 'numeric' },
                      )}
                    </time>
                  </div>
                  <h2
                    className="display-sm text-ink mb-3"
                    style={{ fontSize: 'clamp(24px, 3.4vw, 36px)', fontVariationSettings: '"opsz" 48, "wght" 480' }}
                  >
                    {getLocalizedText(post.title)}
                  </h2>
                  <p className="text-ink-soft leading-relaxed text-[15px] mb-4 line-clamp-3 max-w-[72ch]">
                    {getLocalizedText(post.excerpt) || getLocalizedText(post.content)?.substring(0, 220) + '…'}
                  </p>
                  <span className="inline-flex items-center gap-1.5 font-mono uppercase text-[11px] tracking-[0.22em] text-ink border-b border-ink pb-0.5">
                    {t.blogs.readMore} <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border-t border-[rgba(26,22,18,0.32)]">
            <p className="display-sm text-ink mb-3" style={{ fontVariationSettings: '"opsz" 36, "wght" 480' }}>
              {t.blogs.noPosts}
            </p>
            <p className="text-ink-soft">{t.blogs.checkBack}</p>
          </div>
        )}
      </div>
    </div>
  );
};
