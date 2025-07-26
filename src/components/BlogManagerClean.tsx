import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, Trash2, Plus, Edit3, Calendar, Clock, User, Tag, Lock, Unlock, Mail, Users, Download, Copy, FileText } from 'lucide-react';
import { BlogPost } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { supabase, isSupabaseConfigured, createBlogPost, updateBlogPost, getBlogPosts, deleteBlogPost, uploadFile } from '../lib/supabase';
import { getNewsletterSubscribers, type NewsletterSubscriber } from '../lib/newsletter';
import { getBlogPostTemplates } from '../data/samplePosts';

interface BlogManagerProps {
  onBack: () => void;
}

export const BlogManager: React.FC<BlogManagerProps> = ({ onBack }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templates] = useState(getBlogPostTemplates());
  const [error, setError] = useState<string | null>(null);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);

  // Load posts when component mounts
  useEffect(() => {
    loadPosts();
    loadSubscribers();
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
            status: post.status as any,
            subtitle: '',
            featuredImage: '',
            language: 'en',
            insights: {
              title: '',
              content: '',
              emoji: ''
            },
            uploadedFiles: []
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
    try {
      const savedPosts = localStorage.getItem('blog-posts');
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  };

  const saveToLocalStorage = (postsToSave: BlogPost[]) => {
    try {
      localStorage.setItem('blog-posts', JSON.stringify(postsToSave));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const loadSubscribers = async () => {
    try {
      const subs = await getNewsletterSubscribers();
      setSubscribers(subs);
    } catch (error) {
      console.error('Error loading subscribers:', error);
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
      status: 'draft',
      subtitle: '',
      featuredImage: '',
      language: 'en',
      insights: {
        title: '',
        content: '',
        emoji: ''
      },
      uploadedFiles: []
    };
    setCurrentPost(newPost);
    setIsEditing(true);
    setShowPreview(false);
    setShowTemplates(true);
  };

  const createFromTemplate = (template: BlogPost) => {
    const newPost: BlogPost = {
      ...template,
      id: uuidv4(),
      publishedAt: new Date().toISOString(),
      status: 'draft'
    };
    setCurrentPost(newPost);
    setIsEditing(true);
    setShowPreview(false);
    setShowTemplates(false);
  };

  const savePost = async () => {
    if (!currentPost) return;

    setIsLoading(true);
    setError(null);
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
            published_at: updatedPost.status === 'published' ? updatedPost.publishedAt : undefined,
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
            published_at: updatedPost.status === 'published' ? updatedPost.publishedAt : undefined,
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
    setShowTemplates(false);
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

    setIsLoading(true);
    let newContent = currentPost.content;
    const newUploadedFiles = [...(currentPost.uploadedFiles || [])];

    for (const file of files) {
      try {
        // Generate compressed filename
        const fileExtension = file.name.split('.').pop() || '';
        const compressedName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
        
        let fileUrl = '';
        let embedCode = '';

       // Convert file to base64 data URL for persistent storage
       const reader = new FileReader();
       const base64Promise = new Promise<string>((resolve, reject) => {
         reader.onload = () => {
           const result = reader.result as string;
           resolve(result);
         };
         reader.onerror = reject;
       });
       
       reader.readAsDataURL(file);
       fileUrl = await base64Promise;
       
       console.log('File converted to base64 data URL with compressed name:', compressedName);

       // Store file info for persistence
       const fileInfo = {
         id: compressedName,
         name: compressedName,
         originalName: file.name,
         url: fileUrl,
         type: file.type,
         size: file.size
       };
       newUploadedFiles.push(fileInfo);

        if (file.type.startsWith('image/')) {
          embedCode = `![${file.name}](${fileUrl})\n`;
        } else if (file.type.startsWith('video/')) {
          embedCode = `[VIDEO:${fileUrl}]\n`;
        } else if (file.type.startsWith('audio/')) {
          embedCode = `[AUDIO:${fileUrl}]\n`;
        } else if (file.type === 'application/pdf') {
          embedCode = `[PDF:${fileUrl}]\n`;
        } else {
          embedCode = `[FILE:${fileUrl}](${file.name})\n`;
        }

        // Add to content
        newContent = newContent + '\n' + embedCode;

      } catch (error) {
        console.error('Error uploading file:', error);
       setError(`Failed to process file: ${file.name}`);
      }
    }

    // Update content and uploaded files list with persistence
    updateCurrentPost({ 
      content: newContent,
      uploadedFiles: newUploadedFiles 
    });
    setIsLoading(false);
  };

  const exportSubscribers = () => {
    const csvContent = [
      ['Email', 'Subscribed Date', 'Status'],
      ...subscribers.map(sub => [
        sub.email,
        new Date(sub.subscribed_at).toLocaleDateString(),
        sub.is_active ? 'Active' : 'Inactive'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const ContentPreview: React.FC<{ content: string }> = ({ content }) => {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Preview</h3>
        <div className="prose max-w-none">
          {content.split('\n').map((line, index) => {
            if (line.trim() === '') return <br key={index} />;
            if (line.startsWith('# ')) return <h1 key={index} className="text-2xl font-bold mb-4">{line.substring(2)}</h1>;
            if (line.startsWith('## ')) return <h2 key={index} className="text-xl font-semibold mb-3">{line.substring(3)}</h2>;
            if (line.startsWith('### ')) return <h3 key={index} className="text-lg font-medium mb-2">{line.substring(4)}</h3>;
            if (line.startsWith('**') && line.endsWith('**')) return <p key={index} className="font-bold mb-2">{line.slice(2, -2)}</p>;
            return <p key={index} className="mb-2">{line}</p>;
          })}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-25 to-orange-25 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-25 to-orange-25">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 text-sm underline ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Newsletter Subscribers Section */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-800">Newsletter Subscribers</h2>
                <p className="text-gray-600">Manage your email subscriber list</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="w-5 h-5" />
                <span className="font-semibold">{subscribers.length}</span>
                <span>subscribers</span>
              </div>
              
              {subscribers.length > 0 && (
                <button
                  onClick={exportSubscribers}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              )}
            </div>
          </div>
          
          {subscribers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No subscribers yet. Newsletter signup will appear here.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-32 overflow-y-auto">
              {subscribers.slice(0, 6).map((subscriber) => (
                <div key={subscriber.id} className="flex items-center space-x-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${subscriber.is_active ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="text-gray-700 truncate">{subscriber.email}</span>
                </div>
              ))}
              {subscribers.length > 6 && (
                <div className="text-sm text-gray-500">
                  +{subscribers.length - 6} more...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
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

          {/* Template Selection Modal */}
          {showTemplates && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose a Template</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <button
                    onClick={() => {
                      setShowTemplates(false);
                      setIsEditing(true);
                    }}
                    className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-400 transition-colors text-center"
                  >
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-800 mb-2">Start Blank</h3>
                    <p className="text-gray-600 text-sm">Begin with an empty post</p>
                  </button>
                  
                  {templates.map((template) => (
                    <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:border-yellow-300 transition-colors">
                      <h3 className="font-semibold text-gray-800 mb-2">{template.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{template.excerpt}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => createFromTemplate(template)}
                          className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded text-sm hover:bg-yellow-700 transition-colors"
                        >
                          Use Template
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(template.content);
                            alert('Template copied to clipboard!');
                          }}
                          className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

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
                    <div className="space-y-6 mb-6">
                      {/* Main Post Fields */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            value={currentPost.title}
                            onChange={(e) => updateCurrentPost({ title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Enter post title..."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                          <input
                            type="text"
                            value={currentPost.subtitle || ''}
                            onChange={(e) => updateCurrentPost({ subtitle: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Enter subtitle..."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                        <textarea
                          value={currentPost.excerpt}
                          onChange={(e) => updateCurrentPost({ excerpt: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="Brief excerpt or summary..."
                        />
                      </div>

                      {/* Post Settings Row */}
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                          <select
                            value={currentPost.category}
                            onChange={(e) => updateCurrentPost({ category: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          >
                            <option value="molecule-to-machine">Molecule to Machine</option>
                            <option value="grace-to-life">Grace to Life</option>
                            <option value="transcend-loneliness">Transcend Loneliness</option>
                            <option value="other-story-time">Other Story Time</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                          <select
                            value={currentPost.language || 'en'}
                            onChange={(e) => updateCurrentPost({ language: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          >
                            <option value="en">🇺🇸 English</option>
                            <option value="lt">🇱🇹 Lithuanian</option>
                            <option value="fr">🇫🇷 French</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                          <select
                            value={currentPost.status}
                            onChange={(e) => updateCurrentPost({ status: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          >
                            <option value="draft">📝 Draft</option>
                            <option value="published">🌟 Published</option>
                            <option value="scheduled">⏰ Scheduled</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Premium</label>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateCurrentPost({ isPremium: false })}
                              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                                !currentPost.isPremium
                                  ? 'bg-green-100 text-green-800 border border-green-300'
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
                                  ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <Lock className="w-4 h-4" />
                              <span>Premium</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Tags and Featured Image */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                          <input
                            type="text"
                            value={currentPost.tags.join(', ')}
                            onChange={(e) => updateCurrentPost({ 
                              tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="tag1, tag2, tag3..."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image URL</label>
                          <input
                            type="url"
                            value={currentPost.featuredImage || ''}
                            onChange={(e) => updateCurrentPost({ featuredImage: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      </div>

                      {/* Insights Section */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">📝 My Insights Section</h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Emoji</label>
                            <input
                              type="text"
                              value={currentPost.insights?.emoji || ''}
                              onChange={(e) => updateCurrentPost({ 
                                insights: { ...currentPost.insights, emoji: e.target.value } as any
                              })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-yellow-500"
                              placeholder="💡"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Insight Title</label>
                            <input
                              type="text"
                              value={currentPost.insights?.title || ''}
                              onChange={(e) => updateCurrentPost({ 
                                insights: { ...currentPost.insights, title: e.target.value } as any
                              })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-yellow-500"
                              placeholder="My Insight:"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Insight Content</label>
                            <textarea
                              value={currentPost.insights?.content || ''}
                              onChange={(e) => updateCurrentPost({ 
                                insights: { ...currentPost.insights, content: e.target.value } as any
                              })}
                              rows={2}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-yellow-500"
                              placeholder="Your insight here..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* File Upload Section */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">📎 File Uploads</h4>
                        <div className="space-y-3">
                          <div>
                            <input
                              type="file"
                              multiple
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                if (files.length > 0) {
                                  handleFileUpload(files);
                                }
                              }}
                              className="hidden"
                              id="file-upload"
                              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                            />
                            <label
                              htmlFor="file-upload"
                              className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${
                                isLoading
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                              }`}
                            >
                              {isLoading ? 'Uploading...' : '📁 Choose Files'}
                            </label>
                          </div>
                          
                          {/* Show uploaded files */}
                          {currentPost.uploadedFiles && currentPost.uploadedFiles.length > 0 && (
                            <div className="bg-gray-50 rounded p-3">
                              <p className="text-xs font-medium text-gray-600 mb-2">Uploaded Files:</p>
                              <div className="space-y-1">
                                {currentPost.uploadedFiles.map((file) => (
                                  <div key={file.id} className="flex items-center justify-between text-xs">
                                    <span className="text-gray-700">
                                      {file.name} ({(file.size / 1024).toFixed(1)}KB)
                                    </span>
                                    <span className="text-gray-500">Original: {file.originalName}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Editor/Preview */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-200">
                  {showPreview ? (
                    <ContentPreview content={currentPost.content} />
                  ) : isEditing ? (
                    <div>
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
