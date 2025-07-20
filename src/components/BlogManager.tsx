import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, Trash2, Plus, Edit3, Calendar, Clock, User, Tag, Lock, Unlock } from 'lucide-react';
import { BlogPost } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { supabase, isSupabaseConfigured, createBlogPost, updateBlogPost, getBlogPosts, deleteBlogPost } from '../lib/supabase';

interface BlogManagerProps {
  onBack: () => void;
}

export const BlogManager: React.FC<BlogManagerProps> = ({ onBack }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageMetadata, setImageMetadata] = useState<{[key: string]: {alt: string, keywords: string}}>({});
  const [showImageMenu, setShowImageMenu] = useState<string | null>(null);

  // Load posts on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured()) {
        console.log('Loading posts from Supabase...');
        const supabasePosts = await getBlogPosts();
        
        if (supabasePosts.length > 0) {
          const convertedPosts: BlogPost[] = supabasePosts.map(post => ({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt || '',
            content: post.content,
            category: post.category as any,
            publishedAt: post.published_at || new Date().toISOString(),
            readTime: post.read_time,
            isPremium: post.is_premium,
            tags: post.tags,
            author: post.author,
            status: post.status as any
          }));
          setPosts(convertedPosts);
          console.log('Loaded posts from Supabase:', convertedPosts.length);
        } else {
          console.log('No posts found in Supabase, loading from localStorage...');
          loadFromLocalStorage();
        }
      } else {
        console.log('Supabase not configured, loading from localStorage...');
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      setError('Failed to load posts');
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    const savedPosts = localStorage.getItem('blog-posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  };

  const saveToLocalStorage = (postsToSave: BlogPost[]) => {
    localStorage.setItem('blog-posts', JSON.stringify(postsToSave));
  };

  // Simple content renderer without problematic regex
  const renderContent = (content: string) => {
    if (!content) return '';
    
    try {
      // Split content into lines for processing
      const lines = content.split('\n');
      const processedLines = lines.map((line, index) => {
        // Handle YouTube embeds
        if (line.includes('[YOUTUBE:') && line.includes(']')) {
          const startIndex = line.indexOf('[YOUTUBE:') + 9;
          const endIndex = line.indexOf(']', startIndex);
          if (endIndex > startIndex) {
            const url = line.substring(startIndex, endIndex);
            
            // Extract video ID and create proper title
            let videoId = '';
            let videoTitle = 'YouTube Video';
            
            if (url.includes('youtu.be/')) {
              videoId = url.split('youtu.be/')[1].split('?')[0];
            } else if (url.includes('youtube.com/watch?v=')) {
              videoId = url.split('v=')[1].split('&')[0];
            }
            
            if (videoId) {
              // For now, we'll show the video ID as title since we can't fetch the actual title
              // In a real app, you'd use YouTube API to get the actual title
              videoTitle = `Video ID: ${videoId}`;
            }
             
            return (
              <div key={index} className="my-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-red-600">
                    <span className="text-2xl">📺</span>
                    <div>
                      <div className="font-bold">{videoTitle}</div>
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
            
            // Extract track ID and create proper title
            let trackId = '';
            let trackTitle = 'Spotify Track';
            
            if (url.includes('spotify.com/track/')) {
              trackId = url.split('track/')[1].split('?')[0];
            } else if (url.includes('spotify.com/album/')) {
              trackId = url.split('album/')[1].split('?')[0];
              trackTitle = 'Spotify Album';
            } else if (url.includes('spotify.com/playlist/')) {
              trackId = url.split('playlist/')[1].split('?')[0];
              trackTitle = 'Spotify Playlist';
            }
            
            if (trackId && url.includes('track/')) {
              // For now, we'll show the track ID as title since we can't fetch the actual title
              // In a real app, you'd use Spotify API to get the actual title
              trackTitle = `Track ID: ${trackId}`;
            }
             
            return (
              <div key={index} className="my-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-green-600">
                    <span className="text-2xl">🎵</span>
                    <div>
                      <div className="font-bold">{trackTitle}</div>
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
        
         // Handle Video embeds
         if (line.includes('[VIDEO:') && line.includes(']')) {
           const startIndex = line.indexOf('[VIDEO:') + 7;
           const endIndex = line.indexOf(']', startIndex);
           if (endIndex > startIndex) {
             const url = line.substring(startIndex, endIndex);
             return (
               <div key={index} className="my-4">
                 <video 
                   controls 
                   className="max-w-full h-auto rounded-lg shadow-md"
                   src={url}
                 >
                   Your browser does not support the video tag.
                 </video>
               </div>
             );
           }
         }

         // Handle Audio embeds
         if (line.includes('[AUDIO:') && line.includes(']')) {
           const startIndex = line.indexOf('[AUDIO:') + 7;
           const endIndex = line.indexOf(']', startIndex);
           if (endIndex > startIndex) {
             const url = line.substring(startIndex, endIndex);
             return (
               <div key={index} className="my-4">
                 <audio 
                   controls 
                   className="w-full"
                   src={url}
                 >
                   Your browser does not support the audio tag.
                 </audio>
               </div>
             );
           }
         }

         // Handle PDF embeds
         if (line.includes('[PDF:') && line.includes(']')) {
           const startIndex = line.indexOf('[PDF:') + 5;
           const endIndex = line.indexOf(']', startIndex);
           if (endIndex > startIndex) {
             const url = line.substring(startIndex, endIndex);
             return (
               <div key={index} className="my-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                 <div className="flex items-center space-x-2 text-gray-600 mb-2">
                   <span className="font-bold">📄 PDF Document</span>
                 </div>
                 <iframe
                   src={url}
                   width="100%"
                   height="600"
                   className="border rounded"
                   title="PDF Document"
                 ></iframe>
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
            
            // Handle Unsplash URLs - convert to direct image URL
            if (url.includes('unsplash.com/photos/')) {
              const photoId = url.split('/photos/')[1].split('-').pop();
              if (photoId) {
                url = `https://images.unsplash.com/${photoId}?w=800&q=80`;
              }
            }
            
            const imageId = `image-${index}`;
            const currentMetadata = imageMetadata[imageId] || { alt: alt, keywords: '' };
            
            return (
              <div key={index} className="my-4 relative group">
                <img 
                  src={url} 
                  alt={currentMetadata.alt || alt} 
                  className="max-w-full h-auto rounded-lg shadow-md mx-auto block"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                    target.alt = 'Image not found';
                  }}
                />
                
                {/* Three-dot menu button */}
                <button
                  onClick={() => setShowImageMenu(showImageMenu === imageId ? null : imageId)}
                  className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                
                {/* Image metadata menu */}
                {showImageMenu === imageId && (
                  <div className="absolute top-12 right-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64 z-10">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                        <input
                          type="text"
                          value={currentMetadata.alt}
                          onChange={(e) => setImageMetadata(prev => ({
                            ...prev,
                            [imageId]: { ...currentMetadata, alt: e.target.value }
                          }))}
                          onFocus={(e) => e.target.select()}
                          autoFocus
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Describe the image..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                        <input
                          type="text"
                          value={currentMetadata.keywords}
                          onChange={(e) => setImageMetadata(prev => ({
                            ...prev,
                            [imageId]: { ...currentMetadata, keywords: e.target.value }
                          }))}
                          onFocus={(e) => e.target.select()}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="SEO keywords..."
                        />
                      </div>
                      <button
                        onClick={() => setShowImageMenu(null)}
                        className="w-full bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
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

  const createNewPost = () => {
    const newPost: BlogPost = {
      id: uuidv4(),
      title: 'New Blog Post',
      excerpt: '',
      content: '',
      category: 'molecule-to-machine',
      publishedAt: new Date().toISOString(),
      readTime: 1,
      isPremium: false,
      tags: [],
      author: 'Aurimas',
      status: 'draft'
    };
    setCurrentPost(newPost);
    setIsEditing(true);
    setShowPreview(false);
  };

  const savePost = async () => {
    if (!currentPost) return;

    setIsLoading(true);
    try {
      const updatedPost = {
        ...currentPost,
        readTime: Math.max(1, Math.ceil(currentPost.content.split(' ').length / 200))
      };

      let savedPost = null;
      
      if (isSupabaseConfigured()) {
        console.log('Saving to Supabase...');
        const existingPostIndex = posts.findIndex(p => p.id === updatedPost.id);
        
        if (existingPostIndex >= 0) {
          // Update existing post
          savedPost = await updateBlogPost(updatedPost.id, {
            title: updatedPost.title,
            excerpt: updatedPost.excerpt,
            content: updatedPost.content,
            category: updatedPost.category,
            published_at: updatedPost.status === 'published' ? updatedPost.publishedAt : null,
            read_time: updatedPost.readTime,
            is_premium: updatedPost.isPremium,
            tags: updatedPost.tags,
            author: updatedPost.author,
            status: updatedPost.status
          });
        } else {
          // Create new post
          savedPost = await createBlogPost({
            title: updatedPost.title,
            excerpt: updatedPost.excerpt,
            content: updatedPost.content,
            category: updatedPost.category,
            published_at: updatedPost.status === 'published' ? updatedPost.publishedAt : null,
            read_time: updatedPost.readTime,
            is_premium: updatedPost.isPremium,
            tags: updatedPost.tags,
            author: updatedPost.author,
            status: updatedPost.status
          });
        }
      }

      // Update local state
      const existingIndex = posts.findIndex(p => p.id === updatedPost.id);
      let updatedPosts;
      
      if (existingIndex >= 0) {
        updatedPosts = [...posts];
        updatedPosts[existingIndex] = updatedPost;
      } else {
        updatedPosts = [...posts, updatedPost];
      }
      
      setPosts(updatedPosts);
      saveToLocalStorage(updatedPosts);
      setCurrentPost(updatedPost);
      setIsEditing(false);
      
      console.log('Post saved successfully');
    } catch (error) {
      console.error('Error saving post:', error);
      setError('Failed to save post');
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setIsLoading(true);
    try {
      if (isSupabaseConfigured()) {
        console.log('Deleting from Supabase...');
        await deleteBlogPost(postId);
      }

      const updatedPosts = posts.filter(p => p.id !== postId);
      setPosts(updatedPosts);
      saveToLocalStorage(updatedPosts);
      
      if (currentPost?.id === postId) {
        setCurrentPost(null);
        setIsEditing(false);
      }
      
      console.log('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post');
    } finally {
      setIsLoading(false);
    }
  };

  const editPost = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
    setShowPreview(false);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const updateCurrentPost = (updates: Partial<BlogPost>) => {
    if (currentPost) {
      setCurrentPost({ ...currentPost, ...updates });
    }
  };

   const handleFileUpload = async (files: File[]) => {
     if (!currentPost) return;

     for (const file of files) {
       try {
         // Create object URL for local files
         const objectUrl = URL.createObjectURL(file);
         let embedCode = '';

         if (file.type.startsWith('image/')) {
           embedCode = `![${file.name}](${objectUrl})\n`;
         } else if (file.type.startsWith('video/')) {
           embedCode = `[VIDEO:${objectUrl}]\n`;
         } else if (file.type.startsWith('audio/')) {
           embedCode = `[AUDIO:${objectUrl}]\n`;
         } else if (file.type === 'application/pdf') {
           embedCode = `[PDF:${objectUrl}]\n`;
         } else {
           embedCode = `[FILE:${objectUrl}](${file.name})\n`;
         }

         // Add to content
         const newContent = currentPost.content + '\n' + embedCode;
         updateCurrentPost({ content: newContent });

       } catch (error) {
         console.error('Error uploading file:', error);
         setError(`Failed to upload ${file.name}`);
       }
     }
   };
  const ContentPreview: React.FC<{ content: string }> = ({ content }) => {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Preview</h3>
        <div className="prose prose-gray max-w-none">
          {renderContent(content)}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-25 to-yellow-25 py-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-25 to-yellow-25 py-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Blogs</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Blog Manager</h1>
          </div>
          
          <button
            onClick={createNewPost}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Post</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 text-sm mt-2"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Posts List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">All Posts ({posts.length})</h2>
              
              {posts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No posts yet</p>
                  <button
                    onClick={createNewPost}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Create your first post
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        currentPost?.id === post.id
                          ? 'border-yellow-300 bg-yellow-50'
                          : 'border-gray-200 hover:border-yellow-200 hover:bg-yellow-25'
                      }`}
                      onClick={() => editPost(post)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-800 truncate">{post.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              post.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : post.status === 'scheduled'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {post.status}
                            </span>
                            {post.isPremium && (
                              <Lock className="w-3 h-3 text-purple-600" />
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePost(post.id);
                          }}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Editor/Preview */}
          <div className="lg:col-span-2">
            {currentPost ? (
              <div className="space-y-6">
                {/* Post Settings */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      {isEditing ? 'Edit Post' : 'View Post'}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={togglePreview}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                          showPreview 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </button>
                      {isEditing ? (
                        <button
                          onClick={savePost}
                          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          value={currentPost.title}
                          onChange={(e) => updateCurrentPost({ title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                          value={currentPost.category}
                          onChange={(e) => updateCurrentPost({ category: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        >
                          <option value="molecule-to-machine">Molecule To Machine</option>
                          <option value="grace-to-life">From Grace To Life</option>
                          <option value="transcend-loneliness">Transcend Loneliness</option>
                          <option value="story-time">Story Time</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={currentPost.status}
                          onChange={(e) => updateCurrentPost({ status: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="scheduled">Scheduled</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Premium</label>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateCurrentPost({ isPremium: false })}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                              !currentPost.isPremium
                                ? 'bg-green-100 text-green-700 border-2 border-green-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <Unlock className="w-4 h-4" />
                            <span>Free</span>
                          </button>
                          <button
                            onClick={() => updateCurrentPost({ isPremium: true })}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                              currentPost.isPremium
                                ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <Lock className="w-4 h-4" />
                            <span>Premium</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Excerpt */}
                  {isEditing && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                      <textarea
                        value={currentPost.excerpt}
                        onChange={(e) => updateCurrentPost({ excerpt: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Brief description of the post..."
                      />
                    </div>
                  )}

                  {/* Tags */}
                  {isEditing && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={currentPost.tags.join(', ')}
                        onChange={(e) => updateCurrentPost({ 
                          tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="ai, chemistry, writing"
                      />
                    </div>
                  )}
                </div>

                {/* Content Editor/Preview */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-200">
                  {showPreview ? (
                    <ContentPreview content={currentPost.content} />
                  ) : isEditing ? (
                    <div>
                     {/* Instructions */}
                     <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                       <h4 className="font-semibold text-blue-800 mb-2">📝 How to Add Media & Format Content:</h4>
                       <div className="text-sm text-blue-700 space-y-1">
                         <p><strong>📺 YouTube:</strong> <code>[YOUTUBE:https://youtu.be/VIDEO_ID]</code></p>
                         <p><strong>🎵 Spotify:</strong> <code>[SPOTIFY:https://open.spotify.com/track/TRACK_ID]</code></p>
                         <p><strong>🖼️ Images:</strong> <code>![description](https://image-url.com/image.jpg)</code></p>
                         <p><strong>📄 Files:</strong> Drag & drop files below or use upload button</p>
                         <p><strong>✍️ Text:</strong> # Heading, ## Subheading, **bold**, *italic*</p>
                       </div>
                     </div>

                     {/* Media Upload Area */}
                     <div className="mb-4">
                       <div 
                         className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
                         onDragOver={(e) => {
                           e.preventDefault();
                           e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
                         }}
                         onDragLeave={(e) => {
                           e.preventDefault();
                           e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                         }}
                         onDrop={(e) => {
                           e.preventDefault();
                           e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                           const files = Array.from(e.dataTransfer.files);
                           handleFileUpload(files);
                         }}
                       >
                         <div className="space-y-2">
                           <div className="text-4xl">📎</div>
                           <p className="text-gray-600">Drag & drop files here or click to upload</p>
                           <p className="text-sm text-gray-500">Supports: Images, Videos, PDFs, Audio files</p>
                           <input
                             type="file"
                             multiple
                             accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                             onChange={(e) => {
                               if (e.target.files) {
                                 handleFileUpload(Array.from(e.target.files));
                               }
                             }}
                             className="hidden"
                             id="file-upload"
                           />
                           <label
                             htmlFor="file-upload"
                             className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                           >
                             Choose Files
                           </label>
                         </div>
                       </div>
                     </div>

                      <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                      <textarea
                        value={currentPost.content}
                        onChange={(e) => updateCurrentPost({ content: e.target.value })}
                        rows={20}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-mono text-sm"
                        placeholder="Write your blog post content here..."
                      />
                    </div>
                  ) : (
                    <ContentPreview content={currentPost.content} />
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 shadow-lg border border-yellow-200 text-center">
                <Edit3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Post Selected</h3>
                <p className="text-gray-600 mb-6">Select a post from the list or create a new one to get started.</p>
                <button
                  onClick={createNewPost}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create New Post
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};