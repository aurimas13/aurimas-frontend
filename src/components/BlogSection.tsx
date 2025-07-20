import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';
import { blogCategories } from '../data/blogCategories';
import { BlogPost } from '../types';
import { Calendar, Clock, User, Lock, ExternalLink } from 'lucide-react';

interface BlogSectionProps {
  onManageBlog: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onManageBlog }) => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load posts from localStorage on component mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('blog-posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  // Check if user is authenticated (simple password check)
  const handleAuthentication = () => {
    const password = prompt('Enter admin password to manage blogs:');
    if (password === 'aurimas2025') {
      setIsAuthenticated(true);
      onManageBlog();
    } else if (password !== null) {
      alert('Incorrect password');
    }
  };

  const handleShowAllBlogs = () => {
    setShowAllBlogs(true);
  };

  const handleBackToPreview = () => {
    setShowAllBlogs(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // If showing all blogs, render the blog list
  if (showAllBlogs) {
    return (
      <section id="blogs" className="py-20 bg-gradient-to-br from-lime-25 to-yellow-25">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.blogs.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.blogs.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <button 
              onClick={handleBackToPreview}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to Preview
            </button>
            <button 
              onClick={handleAuthentication}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {t.blogs.manageBlog}
            </button>
          </div>

          {/* Blog Posts List */}
          <div className="max-w-4xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-yellow-200">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {t.blogs.noPosts}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t.blogs.checkBack}
                  </p>
                  <button 
                    onClick={handleAuthentication}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Create First Post
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {posts
                  .filter(post => post.status === 'published')
                  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
                  .map((post) => (
                    <article key={post.id} className="bg-white rounded-2xl p-8 shadow-lg border border-yellow-200 hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                              {blogCategories[post.category]?.title || post.category}
                            </span>
                            {post.isPremium && (
                              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium flex items-center">
                                <Lock className="w-3 h-3 mr-1" />
                                Premium
                              </span>
                            )}
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-yellow-600 transition-colors">
                            {post.title}
                          </h2>
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {post.excerpt || truncateContent(post.content)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(post.publishedAt)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {post.readTime} min read
                          </div>
                        </div>
                      </div>

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="border-t border-gray-200 pt-4">
                        <button className="text-yellow-600 hover:text-yellow-700 font-medium transition-colors">
                          {t.blogs.readMore} →
                        </button>
                      </div>
                    </article>
                  ))}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Default preview view
  return (
    <section id="blogs" className="py-20 bg-gradient-to-br from-lime-25 to-yellow-25">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t.blogs.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.blogs.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button 
            onClick={handleShowAllBlogs}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t.blogs.allBlogs}
          </button>
          <button 
            onClick={handleAuthentication}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {t.blogs.manageBlog}
          </button>
        </div>

        {/* Blog Posts Section */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-yellow-200 relative overflow-hidden">
            {/* Background decoration - yellow theme */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-100 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10 text-center text-gray-800">
              <h3 className="text-3xl font-bold mb-4 text-gray-800">
                🚀 Coming Soon!
              </h3>
              <p className="text-xl mb-6 text-gray-600">
                AI, Belief, Medicine with Chemistry & Belief Stories
              </p>
              
              {/* Preview cards */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="text-2xl mb-2">🧪</div>
                  <h4 className="font-bold text-sm text-gray-800">Artificial Intelligence news</h4>
                  <p className="text-xs text-gray-600">Latest of everything</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="text-2xl mb-2">💡</div>
                  <h4 className="font-bold text-sm text-gray-800">Belief</h4>
                  <p className="text-xs text-gray-600">Weekly Journey on faith!</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="text-2xl mb-2">🌟</div>
                  <h4 className="font-bold text-sm text-gray-800">Other Stories</h4>
                  <p className="text-xs text-gray-600">Real life stories through belief glance</p>
                </div>
              </div>
              
              {/* Call to action */}
              <div className="bg-yellow-100 rounded-lg p-6 border border-yellow-300">
                <h4 className="text-lg font-bold mb-3 text-gray-800">🔔 {t.blogs.beFirstToKnow}</h4>
                <p className="text-gray-600 mb-4">
                  {t.blogs.joinWaitlist}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <input 
                    type="email" 
                    placeholder={t.blogs.enterEmail}
                    className="px-4 py-2 rounded-lg bg-white text-gray-800 placeholder-gray-500 border border-yellow-300 focus:ring-2 focus:ring-yellow-400 outline-none flex-1 max-w-xs"
                  />
                  <button className="bg-yellow-500 hover:bg-yellow-400 text-gray-800 font-bold px-6 py-2 rounded-lg transition-colors transform hover:scale-105">
                    {t.blogs.joinWaitlistBtn}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {t.blogs.noSpam}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Substack Publications - Smaller Section */}
        <div className="mb-12">
          <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            {t.blogs.originalSubstack}
          </h4>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(blogCategories).map(([key, category]) => (
              <div key={key} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-100">
                <h5 className="text-sm font-semibold text-gray-800 mb-2">
                  {category.title}
                </h5>
                <p className="text-gray-600 mb-3 text-xs">
                  {category.description}
                </p>
                <div className="mb-3">
                  <p className="text-xs text-gray-500">{category.languages}</p>
                </div>
                <a
                  href={category.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {t.blogs.visitSubstack}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};