import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';
import { blogCategories } from '../data/blogCategories';
import { BlogPost } from '../types';
import { Calendar, Clock, User, Lock, ExternalLink, ArrowLeft } from 'lucide-react';

// Title cache for YouTube and Spotify
const titleCache = new Map<string, string>();

interface BlogSectionProps {
  onManageBlog: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onManageBlog }) => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to fetch YouTube title
  const fetchYouTubeTitle = async (videoId: string): Promise<string> => {
    if (titleCache.has(`youtube-${videoId}`)) {
      return titleCache.get(`youtube-${videoId}`)!;
    }

    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      if (response.ok) {
        const data = await response.json();
        const title = data.title || `Video ID: ${videoId}`;
        titleCache.set(`youtube-${videoId}`, title);
        return title;
      }
    } catch (error) {
      console.error('Error fetching YouTube title:', error);
    }
    
    const fallbackTitle = `Video ID: ${videoId}`;
    titleCache.set(`youtube-${videoId}`, fallbackTitle);
    return fallbackTitle;
  };

  // Function to fetch Spotify title
  const fetchSpotifyTitle = async (url: string, itemType: string, itemId: string): Promise<string> => {
    const cacheKey = `spotify-${itemId}`;
    if (titleCache.has(cacheKey)) {
      return titleCache.get(cacheKey)!;
    }

    try {
      const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`);
      if (response.ok) {
        const data = await response.json();
        const title = data.title || `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} ID: ${itemId}`;
        titleCache.set(cacheKey, title);
        return title;
      }
    } catch (error) {
      console.error('Error fetching Spotify title:', error);
    }
    
    const fallbackTitle = `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} ID: ${itemId}`;
    titleCache.set(cacheKey, fallbackTitle);
    return fallbackTitle;
  };

  // Load posts from localStorage on component mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('blog-posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  // Render content with proper YouTube/Spotify cards (same as BlogManager)
  const renderContent = (content: string) => {
    if (!content) return '';
    
    try {
      const lines = content.split('\n');
      const processedLines = lines.map((line, index) => {
        // Handle YouTube embeds
        if (line.includes('[YOUTUBE:') && line.includes(']')) {
          const startIndex = line.indexOf('[YOUTUBE:') + 9;
          const endIndex = line.indexOf(']', startIndex);
          if (endIndex > startIndex) {
            const url = line.substring(startIndex, endIndex);
            
            let videoId = '';
            let videoTitle = 'Loading video title...';
            
            if (url.includes('youtu.be/')) {
              videoId = url.split('youtu.be/')[1].split('?')[0].split('&')[0];
            } else if (url.includes('youtube.com/watch?v=')) {
              videoId = url.split('v=')[1].split('&')[0].split('#')[0];
            }
            
            if (videoId) {
              fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
                .then(response => response.json())
                .then(data => {
                  if (data.title) {
                    const titleElement = document.querySelector(`[data-video-id="${videoId}"] .video-title`);
                    if (titleElement) {
                      titleElement.textContent = data.title;
                    }
                  }
                })
                .catch(error => {
                  console.error('Error fetching YouTube title:', error);
                  const titleElement = document.querySelector(`[data-video-id="${videoId}"] .video-title`);
                  if (titleElement) {
                    titleElement.textContent = 'YouTube Video';
                  }
                });
            }
             
            return (
              <div key={index} className="my-4 p-4 bg-red-50 border border-red-200 rounded-lg" data-video-id={videoId}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-red-600">
                    <span className="text-2xl">📺</span>
                    <div>
                      <div className="font-bold video-title">{videoTitle}</div>
                      <div className="text-sm text-gray-600">YouTube</div>
                    </div>
                  </div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Watch Video →
                  </a>
                </div>
              </div>
            );
          }
        }
        
        // Handle Spotify embeds
        if (line.includes('[SPOTIFY:') && line.includes(']')) {
          const startIndex = line.indexOf('[SPOTIFY:') + 9;
          const endIndex = line.indexOf(']', startIndex);
          if (endIndex > startIndex) {
            const url = line.substring(startIndex, endIndex);
            
            let itemId = '';
            let itemTitle = 'Loading...';
            let itemType = 'track';
            
            if (url.includes('spotify.com/track/')) {
              itemId = url.split('track/')[1].split('?')[0].split('#')[0];
              itemType = 'track';
              itemTitle = 'Loading track...';
            } else if (url.includes('spotify.com/album/')) {
              itemId = url.split('album/')[1].split('?')[0].split('#')[0];
              itemType = 'album';
              itemTitle = 'Loading album...';
            } else if (url.includes('spotify.com/playlist/')) {
              itemId = url.split('playlist/')[1].split('?')[0].split('#')[0];
              itemType = 'playlist';
              itemTitle = 'Loading playlist...';
            }
            
            if (itemId) {
              fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`)
                .then(response => response.json())
                .then(data => {
                  if (data.title) {
                    const titleElement = document.querySelector(`[data-spotify-id="${itemId}"] .spotify-title`);
                    if (titleElement) {
                      titleElement.textContent = data.title;
                    }
                  }
                })
                .catch(error => {
                  console.error('Error fetching Spotify title:', error);
                  const titleElement = document.querySelector(`[data-spotify-id="${itemId}"] .spotify-title`);
                  if (titleElement) {
                    titleElement.textContent = `Spotify ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`;
                  }
                });
            }
             
            return (
              <div key={index} className="my-4 p-4 bg-green-50 border border-green-200 rounded-lg" data-spotify-id={itemId}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-green-600">
                    <span className="text-2xl">🎵</span>
                    <div>
                      <div className="font-bold spotify-title">{itemTitle}</div>
                      <div className="text-sm text-gray-600">Spotify</div>
                    </div>
                  </div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Listen on Spotify →
                  </a>
                </div>
              </div>
            );
          }
        }
        
        // Handle images
        if (line.includes('![') && line.includes('](') && line.includes(')')) {
          const altStart = line.indexOf('![') + 2;
          const altEnd = line.indexOf('](', altStart);
          const urlStart = altEnd + 2;
          const urlEnd = line.indexOf(')', urlStart);
          
          if (altEnd > altStart && urlEnd > urlStart) {
            const alt = line.substring(altStart, altEnd);
            let url = line.substring(urlStart, urlEnd);
            
            if (url.includes('unsplash.com/photos/')) {
              const photoId = url.split('/photos/')[1].split('-').pop();
              if (photoId) {
                url = `https://images.unsplash.com/${photoId}?w=800&q=80`;
              }
            }
            
            return (
              <div key={index} className="my-4">
                <img 
                  src={url} 
                  alt={alt} 
                  className="max-w-full h-auto rounded-lg shadow-md mx-auto block"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                    target.alt = 'Image not found';
                  }}
                />
              </div>
            );
          }
        }
        
        // Handle headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold mt-6 mb-4">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold mt-5 mb-3">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-bold mt-4 mb-2">{line.substring(4)}</h3>;
        }
        
        // Handle bold text
        if (line.includes('**')) {
          const parts = line.split('**');
          const elements = parts.map((part, i) => 
            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
          );
          return <p key={index} className="mb-2">{elements}</p>;
        }
        
        // Handle italic text
        if (line.includes('*') && !line.includes('**')) {
          const parts = line.split('*');
          const elements = parts.map((part, i) => 
            i % 2 === 1 ? <em key={i}>{part}</em> : part
          );
          return <p key={index} className="mb-2">{elements}</p>;
        }
        
        // Regular paragraph
        if (line.trim()) {
          return <p key={index} className="mb-2">{line}</p>;
        }
        
        // Empty line
        return <br key={index} />;
      });
      
      return <div className="prose max-w-none">{processedLines}</div>;
    } catch (error) {
      console.error('Error rendering content:', error);
      return <div className="text-red-500">Error rendering content</div>;
    }
  };

  // Check if user is authenticated (simple password check)
  const handleAuthentication = () => {
    // Get user's IP address (simplified - in production use proper IP detection)
    const userIP = 'user_' + (localStorage.getItem('user_session') || Date.now().toString());
    if (!localStorage.getItem('user_session')) {
      localStorage.setItem('user_session', Date.now().toString());
    }
    
    // Check if IP is blocked
    const blockKey = `blocked_${userIP}`;
    const attemptsKey = `attempts_${userIP}`;
    const blockData = localStorage.getItem(blockKey);
    
    if (blockData) {
      const blockTime = parseInt(blockData);
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      if (now - blockTime < oneDay) {
        const hoursLeft = Math.ceil((oneDay - (now - blockTime)) / (60 * 60 * 1000));
        alert(`Access blocked. Try again in ${hoursLeft} hours.`);
        return;
      } else {
        // Block expired, clear it
        localStorage.removeItem(blockKey);
        localStorage.removeItem(attemptsKey);
      }
    }
    
    // Create custom password input dialog
    const passwordDialog = document.createElement('div');
    passwordDialog.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;
    
    const dialogBox = document.createElement('form');
    dialogBox.setAttribute('data-1p-ignore', 'false');
    dialogBox.setAttribute('data-form-type', 'signin');
    dialogBox.style.cssText = `
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      max-width: 400px;
      width: 90%;
    `;
    
    const attempts = parseInt(localStorage.getItem(attemptsKey) || '0');
    const remainingAttempts = 2 - attempts;
    
    dialogBox.innerHTML = `
      <h3 style="margin: 0 0 20px 0; color: #333; font-size: 18px;">Admin Authentication</h3>
      <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">Enter admin password to manage blogs</p>
      ${attempts > 0 ? `<p style="margin: 0 0 15px 0; color: #e74c3c; font-size: 12px;">⚠️ ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining</p>` : ''}
      <input 
        type="password" 
        id="adminPassword" 
        name="password"
        autocomplete="current-password"
        data-1p-ignore="false"
        data-lpignore="false"
        style="
        width: 100%;
        padding: 12px;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 16px;
        margin-bottom: 20px;
        box-sizing: border-box;
      " placeholder="Enter password..." />
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button type="button" id="cancelBtn" style="
          padding: 10px 20px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        ">Cancel</button>
        <button type="submit" id="submitBtn" style="
          padding: 10px 20px;
          border: none;
          background: #f59e0b;
          color: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        ">Submit</button>
      </div>
    `;
    
    passwordDialog.appendChild(dialogBox);
    document.body.appendChild(passwordDialog);
    
    const passwordInput = document.getElementById('adminPassword') as HTMLInputElement;
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    
    // Focus on input
    setTimeout(() => passwordInput.focus(), 100);
    
    const handleSubmit = (e?: Event) => {
      if (e) {
        e.preventDefault();
      }
      const password = passwordInput.value.trim();
      
      if (password === 'aurimas@is!Vilniaus*96') {
        console.log('Password correct, calling onManageBlog');
        document.body.removeChild(passwordDialog);
        // Clear failed attempts on success
        localStorage.removeItem(attemptsKey);
        onManageBlog();
      } else if (password !== '') {
        const newAttempts = attempts + 1;
        localStorage.setItem(attemptsKey, newAttempts.toString());
        
        if (newAttempts >= 2) {
          // Block the IP for 24 hours
          localStorage.setItem(blockKey, Date.now().toString());
          document.body.removeChild(passwordDialog);
          alert('Too many failed attempts. Access blocked for 24 hours.');
        } else {
          passwordInput.value = '';
          passwordInput.style.borderColor = '#e74c3c';
          passwordInput.placeholder = `Wrong password! ${2 - newAttempts} attempt${2 - newAttempts !== 1 ? 's' : ''} left`;
          setTimeout(() => {
            passwordInput.style.borderColor = '#ddd';
            passwordInput.placeholder = 'Enter password...';
          }, 2000);
        }
      }
    };
    
    const handleCancel = () => {
      document.body.removeChild(passwordDialog);
    };
    
    // Event listeners
    dialogBox.addEventListener('submit', handleSubmit);
    submitBtn?.addEventListener('click', handleSubmit);
    cancelBtn?.addEventListener('click', handleCancel);
    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    });
    
    // Close on background click
    passwordDialog.addEventListener('click', (e) => {
      if (e.target === passwordDialog) {
        handleCancel();
      }
    });
  };

  const handleShowAllBlogs = () => {
    setShowAllBlogs(true);
  };

  const handleBackToPreview = () => {
    setShowAllBlogs(false);
  };

  const handleReadMore = (post: BlogPost) => {
    setSelectedPost(post);
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

  // Individual post view
  if (selectedPost) {
    return (
      <section className="py-20 bg-gradient-to-br from-lime-25 to-yellow-25">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <button 
              onClick={() => setSelectedPost(null)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to All Blogs</span>
            </button>
          </div>

          <article className="bg-white rounded-2xl p-8 shadow-lg border border-yellow-200">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  {blogCategories[selectedPost.category]?.title || selectedPost.category}
                </span>
                {selectedPost.isPremium && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium flex items-center">
                    <Lock className="w-3 h-3 mr-1" />
                    Premium
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {selectedPost.title}
              </h1>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {selectedPost.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(selectedPost.publishedAt)}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {selectedPost.readTime} min read
                </div>
              </div>

              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedPost.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="prose prose-lg max-w-none">
              {renderContent(selectedPost.content)}
            </div>
          </article>
        </div>
      </section>
    );
  }

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
                          <div className="text-gray-600 mb-4 leading-relaxed">
                            {post.excerpt ? (
                              <p>{post.excerpt}</p>
                            ) : (
                              <div className="line-clamp-3">
                                {renderContent(truncateContent(post.content, 300))}
                              </div>
                            )}
                          </div>
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
                          <div className="prose prose-sm max-w-none">
                            {renderContent(truncateContent(post.content, 300))}
                          </div>
                        </div>
                      )}

                      <div className="border-t border-gray-200 pt-4">
                        <button 
                          onClick={() => handleReadMore(post)}
                          className="text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
                        >
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
                  <div className="text-2xl mb-2">🕊️</div>
                  <h4 className="font-bold text-sm text-gray-800">Belief</h4>
                  <p className="text-xs text-gray-600">Weekly journey on faith</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="text-2xl mb-2">📖</div>
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