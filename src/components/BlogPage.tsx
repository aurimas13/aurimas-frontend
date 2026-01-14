import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { blogCategories } from '../data/blogCategories';
import { translations } from '../data/translations';
import { LanguageCode } from '../contexts/LanguageContext';
import { BlogPost, LocalizedText } from '../types';

export const BlogPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as LanguageCode];

  // Helper function to get localized text
  const getLocalizedText = (text: string | LocalizedText | undefined): string => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    return text[currentLanguage as keyof LocalizedText] || text.en || '';
  };

  // Check if category exists
  const validCategories = Object.keys(blogCategories);
  if (!category || !validCategories.includes(category)) {
    return <Navigate to="/blogs" replace />;
  }

  const categoryData = blogCategories[category as keyof typeof blogCategories];
  const categoryTitle = categoryData.title[currentLanguage as LanguageCode];
  const categoryDescription = categoryData.description[currentLanguage as LanguageCode];

  // Get posts from localStorage
  const posts = JSON.parse(localStorage.getItem('blog-posts') || '[]');
  const categoryPosts = posts.filter((post: any) => post.category === category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-25 to-yellow-25">
      <div className="container mx-auto px-4 py-12">
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            to="/blogs"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t.blogs.allBlogs}
          </Link>
        </div>

        {/* Category Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {categoryTitle}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {categoryDescription}
          </p>
        </div>

        {/* Posts Grid */}
        {categoryPosts.length > 0 ? (
          <div className="grid gap-8 md:gap-12">
            {categoryPosts.map((post: any, index: number) => (
              <article 
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">📚</span>
                      <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                        {categoryTitle}
                      </span>
                    </div>
                    <time className="text-sm text-gray-500">
                      {new Date(post.publishedAt || post.date || post.createdAt).toLocaleDateString(
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

                  <p className="text-gray-600 text-lg leading-relaxed mb-6 line-clamp-3">
                    {getLocalizedText(post.excerpt) || getLocalizedText(post.content)?.substring(0, 200) + '...'}
                  </p>

                  <Link
                    to={`/blogs/${category}/${post.id}`}
                    className="inline-flex items-center bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-500 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
                  >
                    {t.blogs.readMore}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t.blogs.noPosts}
            </h3>
            <p className="text-gray-600 text-lg">
              {t.blogs.checkBack}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
