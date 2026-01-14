import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

    // Get published posts from localStorage
  const posts: BlogPost[] = JSON.parse(localStorage.getItem('blog-posts') || '[]');

  // Helper function to get localized text
  const getLocalizedText = (text: string | LocalizedText | undefined): string => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    return text[currentLanguage as keyof LocalizedText] || text.en || '';
  };

  // Filter posts based on selected category and destination
  const filteredPosts = posts.filter((post: BlogPost) => {
    if (selectedCategory !== 'all' && post.category !== selectedCategory) return false;
    if (selectedDestination !== 'all' && post.category !== selectedDestination) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {t.blogs.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t.blogs.subtitle}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-12">
          {/* Category Filters */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 {t.blogs.filterByCategory}</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.blogs.allCategories}
              </button>
              {Object.entries(blogCategories).map(([categoryKey, category]) => (
                <button
                  key={categoryKey}
                  onClick={() => setSelectedCategory(categoryKey)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                    selectedCategory === categoryKey
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.title[currentLanguage as LanguageCode]}
                </button>
              ))}
            </div>
          </div>

          {/* Destination Filters */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📍 {t.blogs.filterByDestination}</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedDestination('all')}
                className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                  selectedDestination === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.blogs.allDestinations}
              </button>
              {Object.entries(blogCategories).map(([categoryKey, category]) => (
                <button
                  key={`dest-${categoryKey}`}
                  onClick={() => setSelectedDestination(categoryKey)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                    selectedDestination === categoryKey
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.title[currentLanguage as LanguageCode]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* All Blog Posts */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t.blogs.allBlogPosts}</h2>
          {filteredPosts.length > 0 ? (
            <div className="grid gap-8 md:gap-12">
              {filteredPosts.map((post: BlogPost, index: number) => {
                const categoryData = blogCategories[post.category as keyof typeof blogCategories];
                const categoryTitle = categoryData?.title[currentLanguage as LanguageCode] || post.category;
                
                return (
                  <article 
                    key={`${post.category}-${index}`}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">📚</span>
                          <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                            {categoryTitle}
                          </span>
                          {post.status === 'published' && (
                            <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                              ✓ {t.blogs.published}
                            </span>
                          )}
                        </div>
                        <time className="text-sm text-gray-500">
                          {new Date(post.publishedAt || post.date || '').toLocaleDateString(
                            currentLanguage === 'en' ? 'en-US' : 
                            currentLanguage === 'lt' ? 'lt-LT' : 'fr-FR',
                            { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            }
                          )}
                        </time>
                      </div>

                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                        {getLocalizedText(post.title)}
                      </h2>

                      {post.subtitle && (
                        <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                          {getLocalizedText(post.subtitle)}
                        </p>
                      )}

                      <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                        {getLocalizedText(post.excerpt) || 
                         (getLocalizedText(post.content)?.substring(0, 200) + '...')}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>👤 {getLocalizedText(post.author)}</span>
                          {post.readTime && (
                            <span>⏱️ {typeof post.readTime === 'string' || typeof post.readTime === 'number' ? post.readTime : getLocalizedText(post.readTime as LocalizedText)}</span>
                          )}
                        </div>
                        
                        <Link
                          to={`/blogs/${post.category}/${post.id}`}
                          className="inline-flex items-center bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-500 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
                        >
                          {t.blogs.readMore}
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📚</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t.blogs.noBlogPosts}
              </h3>
              <p className="text-gray-600 text-lg">
                {selectedCategory !== 'all' || selectedDestination !== 'all' 
                  ? t.blogs.noBlogPostsInCategory
                  : t.blogs.checkBack}
              </p>
            </div>
          )}
        </div>

        {/* Blog Categories Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t.blogs.browseByCategoryTitle}</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto">
            {Object.entries(blogCategories).map(([categoryKey, category]) => {
              const categoryPosts = posts.filter((post: BlogPost) => post.category === categoryKey);
              const postCount = categoryPosts.length;

              return (
                <Link
                  key={categoryKey}
                  to={`/blogs/${categoryKey}`}
                  className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {category.title[currentLanguage as LanguageCode]}
                      </h3>
                      <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {postCount} {postCount === 1 ? t.blogs.post : t.blogs.posts}
                      </div>
                    </div>

                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      {category.description[currentLanguage as LanguageCode]}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">{t.blogs.languages}:</span> {category.languages[currentLanguage as LanguageCode]}
                      </div>
                      
                      <div className="flex items-center text-blue-600 group-hover:text-blue-800 transition-colors duration-200">
                        <span className="font-medium mr-2">{t.blogs.explore}</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Bottom gradient accent */}
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </Link>
              );
            })}
          </div>
        </div>
        {/* Original Substack Links */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {t.blogs.originalSubstack || 'Original Substack Blogs'}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(blogCategories).map(([categoryKey, category]) => (
              <a
                key={`${categoryKey}-substack`}
                href={category.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200"
              >
                {t.blogs.visitSubstack || 'Visit Substack'} {category.title[currentLanguage as LanguageCode]}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-16 max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t.blogs.stayUpdated}
            </h3>
            <p className="text-gray-600 mb-6">
              {t.blogs.newsletterDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder={t.blogs.enterEmail || 'Enter your email'}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
                {t.blogs.subscribe}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {t.blogs.noSpam || 'No spam, unsubscribe anytime.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
