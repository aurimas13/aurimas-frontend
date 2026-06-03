import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { blogCategories } from '../data/blogCategories';
import { translations } from '../data/translations';
import { LanguageCode } from '../contexts/LanguageContext';
import { BlogPost, LocalizedText } from '../types';

export const BlogsPage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as LanguageCode];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDestination, setSelectedDestination] = useState<string>('all');

  const posts: BlogPost[] = JSON.parse(localStorage.getItem('blog-posts') || '[]');

  const getLocalizedText = (text: string | LocalizedText | undefined): string => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    return text[currentLanguage as keyof LocalizedText] || text.en || '';
  };

  const filteredPosts = posts.filter((post: BlogPost) => {
    if (selectedCategory !== 'all' && post.category !== selectedCategory) return false;
    if (selectedDestination !== 'all' && post.category !== selectedDestination) return false;
    return true;
  });

  const filterButton = (active: boolean, onClick: () => void, label: string) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 font-mono uppercase text-[11px] tracking-[0.18em] border transition-colors ${
        active
          ? 'border-ink bg-ink text-paper'
          : 'border-[rgba(26,22,18,0.32)] text-ink-soft hover:border-ink hover:text-ink'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-16 reveal reveal-d2">
          <p className="eyebrow mb-3">No. 04 · Writing</p>
          <h1 className="display-lg text-ink" style={{ fontSize: 'clamp(48px, 7vw, 96px)', fontVariationSettings: '"opsz" 96, "wght" 420' }}>
            {t.blogs.title}.
          </h1>
          <p
            className="font-display text-ink-soft mt-6 max-w-[640px]"
            style={{ fontSize: 'clamp(18px, 2vw, 22px)', lineHeight: 1.5, fontVariationSettings: '"opsz" 18, "wght" 400' }}
          >
            {t.blogs.subtitle}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 reveal reveal-d3 space-y-6">
          <div>
            <h3 className="meta uppercase tracking-[0.22em] mb-3">{t.blogs.filterByCategory}</h3>
            <div className="flex flex-wrap gap-2">
              {filterButton(selectedCategory === 'all', () => setSelectedCategory('all'), t.blogs.allCategories)}
              {Object.entries(blogCategories).map(([key, category]) =>
                filterButton(
                  selectedCategory === key,
                  () => setSelectedCategory(key),
                  category.title[currentLanguage as LanguageCode],
                )
              )}
            </div>
          </div>

          <div>
            <h3 className="meta uppercase tracking-[0.22em] mb-3">{t.blogs.filterByDestination}</h3>
            <div className="flex flex-wrap gap-2">
              {filterButton(selectedDestination === 'all', () => setSelectedDestination('all'), t.blogs.allDestinations)}
              {Object.entries(blogCategories).map(([key, category]) =>
                filterButton(
                  selectedDestination === key,
                  () => setSelectedDestination(key),
                  category.title[currentLanguage as LanguageCode],
                )
              )}
            </div>
          </div>
        </div>

        {/* All posts */}
        <div className="mb-20">
          <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-[rgba(26,22,18,0.32)]">
            <h2 className="display-md text-ink" style={{ fontVariationSettings: '"opsz" 60, "wght" 440' }}>
              {t.blogs.allBlogPosts}
            </h2>
            <span className="meta uppercase tracking-[0.2em]">{filteredPosts.length} entries</span>
          </div>

          {filteredPosts.length > 0 ? (
            <div>
              {filteredPosts.map((post: BlogPost, index: number) => {
                const categoryData = blogCategories[post.category as keyof typeof blogCategories];
                const categoryTitle = categoryData?.title[currentLanguage as LanguageCode] || post.category;

                return (
                  <article
                    key={`${post.category}-${index}`}
                    className="border-b border-[rgba(26,22,18,0.14)] hover:bg-paper-deep/60 transition-colors"
                  >
                    <Link to={`/blogs/${post.category}/${post.id}`} className="block py-8 px-2">
                      <div className="flex items-baseline gap-4 mb-3 flex-wrap">
                        <span className="meta uppercase tracking-[0.22em]">{categoryTitle}</span>
                        {post.status === 'published' && (
                          <span className="meta uppercase tracking-[0.22em] text-moss">✓ {t.blogs.published}</span>
                        )}
                        <time className="meta uppercase tracking-[0.22em]">
                          {new Date(post.publishedAt || post.date || '').toLocaleDateString(
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

                      {post.subtitle && (
                        <p className="font-display text-ink-soft mb-3" style={{ fontSize: '18px', lineHeight: 1.45, fontVariationSettings: '"opsz" 18, "wght" 400' }}>
                          {getLocalizedText(post.subtitle)}
                        </p>
                      )}

                      <p className="text-ink-soft leading-relaxed text-[15px] mb-4 line-clamp-3 max-w-[72ch]">
                        {getLocalizedText(post.excerpt) || (getLocalizedText(post.content)?.substring(0, 220) + '…')}
                      </p>

                      <div className="flex items-center gap-5 flex-wrap">
                        <span className="meta uppercase tracking-[0.22em]">{getLocalizedText(post.author)}</span>
                        {post.readTime && (
                          <span className="meta uppercase tracking-[0.22em]">
                            {typeof post.readTime === 'string' || typeof post.readTime === 'number'
                              ? post.readTime
                              : getLocalizedText(post.readTime as LocalizedText)}{' '}
                            min read
                          </span>
                        )}
                        <span className="ml-auto inline-flex items-center gap-1.5 font-mono uppercase text-[11px] tracking-[0.22em] text-ink border-b border-ink pb-0.5">
                          {t.blogs.readMore} <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="display-sm text-ink mb-3" style={{ fontVariationSettings: '"opsz" 36, "wght" 480' }}>
                {t.blogs.noBlogPosts}
              </p>
              <p className="text-ink-soft">
                {selectedCategory !== 'all' || selectedDestination !== 'all' ? t.blogs.noBlogPostsInCategory : t.blogs.checkBack}
              </p>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="mb-20">
          <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-[rgba(26,22,18,0.32)]">
            <h2 className="display-md text-ink" style={{ fontVariationSettings: '"opsz" 60, "wght" 440' }}>
              {t.blogs.browseByCategoryTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[rgba(26,22,18,0.14)] border border-[rgba(26,22,18,0.14)]">
            {Object.entries(blogCategories).map(([categoryKey, category]) => {
              const categoryPosts = posts.filter((p: BlogPost) => p.category === categoryKey);
              const postCount = categoryPosts.length;
              return (
                <Link
                  key={categoryKey}
                  to={`/blogs/${categoryKey}`}
                  className="group block bg-paper p-8 hover:bg-paper-deep transition-colors"
                >
                  <div className="flex items-baseline justify-between mb-4">
                    <h3
                      className="display-sm text-ink group-hover:text-oxblood transition-colors"
                      style={{ fontSize: '26px', fontVariationSettings: '"opsz" 36, "wght" 480' }}
                    >
                      {category.title[currentLanguage as LanguageCode]}
                    </h3>
                    <span className="meta uppercase tracking-[0.2em]">
                      {postCount} {postCount === 1 ? t.blogs.post : t.blogs.posts}
                    </span>
                  </div>
                  <p className="text-ink-soft leading-relaxed text-[15px] mb-5">
                    {category.description[currentLanguage as LanguageCode]}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="meta uppercase tracking-[0.2em]">
                      {t.blogs.languages}: {category.languages[currentLanguage as LanguageCode]}
                    </span>
                    <span className="font-mono uppercase text-[11px] tracking-[0.22em] text-ink border-b border-transparent group-hover:border-ink pb-0.5 transition-colors inline-flex items-center gap-1">
                      {t.blogs.explore}
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Substack original */}
        <div className="mb-20">
          <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-[rgba(26,22,18,0.32)]">
            <h2 className="display-md text-ink" style={{ fontVariationSettings: '"opsz" 60, "wght" 440' }}>
              {t.blogs.originalSubstack || 'Original Substack Blogs'}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(blogCategories).map(([categoryKey, category]) => (
              <a
                key={`${categoryKey}-substack`}
                href={category.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {category.title[currentLanguage as LanguageCode]}
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="panel-strong p-8 sm:p-12 max-w-3xl mx-auto">
          <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
            <h3 className="display-sm text-ink" style={{ fontSize: '24px', fontVariationSettings: '"opsz" 36, "wght" 480' }}>
              {t.blogs.stayUpdated}
            </h3>
            <span className="meta uppercase tracking-[0.2em]">— Subscribe</span>
          </div>
          <p className="text-ink-soft text-[15px] mb-6">{t.blogs.newsletterDescription}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="email" placeholder={t.blogs.enterEmail || 'Enter your email'} className="field flex-1" />
            <button className="btn btn-primary">{t.blogs.subscribe}</button>
          </div>
          <p className="meta uppercase tracking-[0.2em] mt-4">{t.blogs.noSpam || 'No spam · unsubscribe anytime'}</p>
        </div>
      </div>
    </div>
  );
};
