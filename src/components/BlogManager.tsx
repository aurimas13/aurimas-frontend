import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Eye, Image, Video, Music, Link, FileText, Clock, Calendar } from 'lucide-react';
import { BlogPost } from '../types';
import { blogCategories } from '../data/blogCategories';
import { 
  createBlogPost, 
  updateBlogPost, 
  getBlogPosts, 
  deleteBlogPost, 
  isSupabaseConfigured,
  BlogPostDB 
} from '../lib/supabase';

interface BlogManagerProps {
  onBack?: () => void;
}

export const BlogManager: React.FC<BlogManagerProps> = ({ onBack }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [isSupabaseEnabled, setIsSupabaseEnabled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: string}>({});

  // Load posts from localStorage on component mount
  useEffect(() => {
    setIsSupabaseEnabled(isSupabaseConfigured());
    loadPosts();
  }, []);

  const loadPosts = async () => {
    if (isSupabaseConfigured()) {
      // Load from Supabase
      const supabasePosts = await getBlogPosts();
      const convertedPosts = supabasePosts.map(convertFromSupabase);
      setPosts(convertedPosts);
    } else {
      // Load from localStorage
      const savedPosts = localStorage.getItem('blog-posts');
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
      }
    }
  };

  const convertToSupabase = (post: BlogPost): Omit<BlogPostDB, 'id' | 'created_at' | 'updated_at'> => ({
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    published_at: post.status === 'published' ? post.publishedAt : null,
    scheduled_at: post.status === 'scheduled' ? post.publishedAt : null,
    read_time: post.readTime,
    is_premium: post.isPremium,
    tags: post.tags,
    author: post.author,
    status: post.status
  });

  const convertFromSupabase = (post: BlogPostDB): BlogPost => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category as any,
    publishedAt: post.published_at || post.scheduled_at || post.created_at,
    readTime: post.read_time,
    isPremium: post.is_premium,
    tags: post.tags,
    author: post.author,
    status: post.status as any
  });

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      localStorage.setItem('blog-posts', JSON.stringify(posts));
    }
  }, [posts]);

  const handleCreatePost = () => {
    const newPost: Partial<BlogPost> = {
      title: '',
      excerpt: '',
      content: '',
      category: 'molecule-to-machine',
      tags: [],
      isPremium: false,
      status: 'draft',
      author: 'Aurimas Aleksandras Nausėdas'
    };
    setEditingPost(newPost);
    setIsEditing(true);
  };

  const handleEditPost = (post: BlogPost) => {
    console.log('Editing post:', post);
    console.log('Post content:', post.content);
    setEditingPost(post);
    setIsEditing(true);
    
    // If the post is scheduled, populate the scheduled date/time fields
    if (post.status === 'scheduled' && post.publishedAt) {
      const scheduledDateTime = new Date(post.publishedAt);
      const dateStr = scheduledDateTime.toISOString().split('T')[0];
      const timeStr = scheduledDateTime.toTimeString().slice(0, 5);
      setScheduledDate(dateStr);
      setScheduledTime(timeStr);
    } else {
      setScheduledDate('');
      setScheduledTime('');
    }
  };

  const handleSavePost = async (publishType: 'draft' | 'publish' | 'schedule' = 'draft') => {
    if (!editingPost || !editingPost.title || !editingPost.content) return;

    console.log('Saving post with type:', publishType);
    console.log('Editing post:', editingPost);

    let publishedAt = editingPost.publishedAt || new Date().toISOString();
    let status: 'draft' | 'published' | 'scheduled' = 'draft';

    if (publishType === 'publish') {
      status = 'published';
      publishedAt = new Date().toISOString();
    } else if (publishType === 'schedule') {
      if (!scheduledDate || !scheduledTime) {
        alert('Please select both date and time for scheduling');
        return;
      }
      status = 'scheduled';
      publishedAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    } else {
      status = 'draft';
      // Keep existing publishedAt for drafts if it exists
      if (editingPost.publishedAt) {
        publishedAt = editingPost.publishedAt;
      }
    }

    const postToSave: BlogPost = {
      id: editingPost.id || Date.now().toString(),
      title: editingPost.title,
      excerpt: editingPost.excerpt || editingPost.content.substring(0, 150) + '...',
      content: editingPost.content,
      category: editingPost.category as any,
      publishedAt,
      readTime: Math.ceil(editingPost.content.split(' ').length / 200),
      isPremium: editingPost.isPremium || false,
      tags: editingPost.tags || [],
      author: editingPost.author || 'Aurimas Aleksandras Nausėdas',
      status
    };

    console.log('Post to save:', postToSave);

    try {
      if (isSupabaseConfigured()) {
        console.log('Saving to Supabase...');
        console.log('Supabase configuration check:', {
          url: import.meta.env.VITE_SUPABASE_URL,
          hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
          isConfigured: isSupabaseConfigured()
        });
        
        // Save to Supabase
        if (editingPost.id) {
          console.log('Updating existing post:', editingPost.id);
          const updated = await updateBlogPost(editingPost.id, convertToSupabase(postToSave));
          if (updated) {
            console.log('Post updated successfully');
            setPosts(posts.map(p => p.id === editingPost.id ? postToSave : p));
          } else {
            throw new Error('Failed to update post in Supabase');
          }
        } else {
          console.log('Creating new post...');
          const created = await createBlogPost(convertToSupabase(postToSave));
          if (created) {
            console.log('Post created successfully:', created.id);
            setPosts([...posts, { ...postToSave, id: created.id }]);
          } else {
            console.log('Supabase create returned null, falling back to localStorage');
            // Fallback to localStorage immediately
            setPosts([...posts, postToSave]);
            alert('Supabase unavailable - post saved locally as backup');
            setIsEditing(false);
            setEditingPost(null);
            return;
          }
        }
      } else {
        console.log('Supabase not configured, saving to localStorage...');
        // Save to localStorage
        if (editingPost.id) {
          setPosts(posts.map(p => p.id === editingPost.id ? postToSave : p));
        } else {
          setPosts([...posts, postToSave]);
        }
        console.log('Post saved to localStorage');
      }

      console.log('Save completed, closing editor');
      setIsEditing(false);
      setEditingPost(null);
      setScheduledDate('');
      setScheduledTime('');
      
      // Show success message
      const statusMessage = publishType === 'draft' ? 'Draft saved' : 
                           publishType === 'publish' ? 'Post published' : 
                           'Post scheduled';
      alert(`${statusMessage} successfully!`);
    } catch (error) {
      console.error('Error saving post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to save post: ${errorMessage}`);
      
      // Fallback to localStorage if Supabase fails
      if (isSupabaseConfigured()) {
        console.log('Supabase failed, falling back to localStorage...');
        try {
          if (editingPost.id) {
            setPosts(posts.map(p => p.id === editingPost.id ? postToSave : p));
          } else {
            setPosts([...posts, postToSave]);
          }
          alert('Post saved to local storage as backup');
        } catch (localError) {
          console.error('Even localStorage failed:', localError);
          alert('Failed to save post anywhere. Please try again.');
        }
      }
    }
  };

  const handleFileUpload = (files: FileList) => {
    // Optimize and compress files before upload
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/')) {
        optimizeAndUploadFile(file);
      } else {
        // Handle other file types (PDFs, docs, etc.)
        uploadFile(file);
      }
    });
  };

  const optimizeAndUploadFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      // Compress images for better performance
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate optimal dimensions (max 800px width for blog images)
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to optimized format
        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result as string;
              const shortName = file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name;
              const mediaMarkdown = `\n![${shortName}](${result})\n`;
              
              setEditingPost({
                ...editingPost,
                content: (editingPost?.content || '') + mediaMarkdown
              });
            };
            reader.readAsDataURL(blob);
          }
        }, 'image/jpeg', 0.8); // 80% quality for good balance
      };
      
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      // For video/audio, use original file but with size limit
      uploadFile(file);
    }
  };

  const uploadFile = (file: File) => {
    // Check file size (limit to 10MB for performance)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert(`File too large. Please use files smaller than 10MB. Current size: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const shortName = file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name;
      
      let mediaMarkdown = '';
      if (file.type.startsWith('video/')) {
        mediaMarkdown = `\n<video controls style="max-width:100%;height:auto">\n  <source src="${result}" type="${file.type}">\n</video>\n`;
      } else if (file.type.startsWith('audio/')) {
        mediaMarkdown = `\n<audio controls style="width:100%">\n  <source src="${result}" type="${file.type}">\n</audio>\n`;
      } else {
        // Other files (PDFs, docs, etc.)
        mediaMarkdown = `\n[📎 ${shortName}](${result})\n`;
      }
      
      setEditingPost({
        ...editingPost,
        content: (editingPost?.content || '') + mediaMarkdown
      });
    };
    
    reader.readAsDataURL(file);
  };

  const insertFormatting = (before: string, after: string, placeholder: string) => {
    const textarea = document.querySelector('textarea[placeholder*="Write your blog post"]') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const replacement = selectedText || placeholder;
    
    const newText = before + replacement + after;
    const currentContent = editingPost?.content || '';
    const newContent = currentContent.substring(0, start) + newText + currentContent.substring(end);
    
    setEditingPost({
      ...editingPost,
      content: newContent
    });
    
    // Restore cursor position
    setTimeout(() => {
      const newCursorPos = start + before.length + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const insertMediaContent = (type: 'image' | 'video' | 'music' | 'link') => {
    const prompts = {
      image: 'Enter image URL:',
      video: 'Enter video URL (YouTube, Vimeo, etc.):',
      music: 'Enter music/audio URL:',
      link: 'Enter link URL:'
    };
    
    const url = prompt(prompts[type]);
    if (!url) return;
    
    let mediaMarkdown = '';
    switch (type) {
      case 'image':
        const altText = prompt('Enter image description (optional):') || 'Image';
        mediaMarkdown = `![${altText}](${url})`;
        break;
      case 'video':
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
          const videoId = url.includes('youtu.be') 
            ? url.split('/').pop()?.split('?')[0]
            : url.split('v=')[1]?.split('&')[0];
          mediaMarkdown = `\n\n<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>\n\n`;
        } else {
          mediaMarkdown = `\n\n<video controls width="100%">\n  <source src="${url}" type="video/mp4">\n  Your browser does not support the video tag.\n</video>\n\n`;
        }
        break;
      case 'music':
        mediaMarkdown = `\n\n<audio controls>\n  <source src="${url}" type="audio/mpeg">\n  Your browser does not support the audio element.\n</audio>\n\n`;
        break;
      case 'link':
        const linkText = prompt('Enter link text:') || url;
        mediaMarkdown = `[${linkText}](${url})`;
        break;
    }
    
    setEditingPost({
      ...editingPost,
      content: (editingPost?.content || '') + mediaMarkdown
    });
  };

  const handleDeletePost = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      if (isSupabaseConfigured()) {
        const deleted = await deleteBlogPost(id);
        if (deleted) {
          setPosts(posts.filter(p => p.id !== id));
        }
      } else {
        setPosts(posts.filter(p => p.id !== id));
      }
    }
  };

  const handlePublishPost = async (id: string) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    const updatedPost = { 
      ...post, 
      status: 'published' as const, 
      publishedAt: new Date().toISOString() 
    };

    if (isSupabaseConfigured()) {
      const updated = await updateBlogPost(id, convertToSupabase(updatedPost));
      if (updated) {
        setPosts(posts.map(p => p.id === id ? updatedPost : p));
      }
    } else {
      setPosts(posts.map(p => p.id === id ? updatedPost : p));
    }
  };

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  if (isEditing) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg border border-yellow-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingPost?.id ? 'Edit Post' : 'Create New Post'}
                {isSupabaseEnabled && (
                  <span className="ml-2 text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                    Supabase Connected
                  </span>
                )}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editingPost?.title || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter post title..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={editingPost?.category || 'molecule-to-machine'}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value as any })}
                    className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    {Object.entries(blogCategories).map(([key, category]) => (
                      <option key={key} value={key}>{category.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={editingPost?.status || 'draft'}
                    onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                <textarea
                  value={editingPost?.excerpt || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-mono text-sm"
                  placeholder="Brief description of the post..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                
                {/* Compact Substack-style Media toolbar */}
                <div className="flex items-center gap-1 mb-2 p-2 bg-gray-50 rounded-md border text-xs">
                  <span className="text-gray-600 mr-1">+</span>
                  
                  {/* File upload input */}
                  <label className="flex items-center px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <Image className="w-3 h-3 mr-1" />
                    <span>Upload</span>
                  </label>
                  
                  <div className="w-px h-4 bg-gray-300 mx-1"></div>
                  
                  <button
                    type="button"
                    onClick={() => insertMediaContent('image')}
                    className="flex items-center px-2 py-1 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                    title="Insert image URL"
                  >
                    <Image className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMediaContent('video')}
                    className="flex items-center px-2 py-1 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                    title="Insert video URL"
                  >
                    <Video className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMediaContent('music')}
                    className="flex items-center px-2 py-1 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                    title="Insert audio URL"
                  >
                    <Music className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMediaContent('link')}
                    className="flex items-center px-2 py-1 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                    title="Insert link"
                  >
                    <Link className="w-3 h-3" />
                  </button>
                  
                  <div className="w-px h-4 bg-gray-300 mx-1"></div>
                  
                  {/* Quick formatting buttons */}
                  <button
                    type="button"
                    onClick={() => insertFormatting('**', '**', 'Bold text')}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded transition-colors font-bold"
                    title="Bold"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*', '*', 'Italic text')}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded transition-colors italic"
                    title="Italic"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('## ', '', 'Heading')}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded transition-colors font-bold"
                    title="Heading"
                  >
                    H
                  </button>
                </div>
                
                {/* Drag and drop content area */}
                <div
                  className={`relative ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-yellow-300'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {isDragging && (
                    <div className="absolute inset-0 bg-blue-50 bg-opacity-90 flex items-center justify-center z-10 rounded-lg border-2 border-dashed border-blue-400">
                      <div className="text-center">
                        <Image className="w-8 h-8 text-blue-500 mx-auto mb-1" />
                        <p className="text-blue-700 font-medium text-sm">Drop files here</p>
                        <p className="text-blue-600 text-xs">Auto-optimized for web</p>
                      </div>
                    </div>
                  )}
                  <textarea
                    value={editingPost?.content || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                    rows={20}
                    className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Write your blog post content here... Use the + toolbar above for media, or drag & drop files directly."
                  />
                </div>
                
                <div className="mt-1 text-xs text-gray-500 flex items-center justify-between">
                  <span>Tip: Use toolbar buttons or drag & drop files</span>
                  <span>{editingPost?.content?.length || 0} chars</span>
                </div>
              </div>

              {/* Scheduled Publishing */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Publishing (Optional)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">Time</label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={editingPost?.tags?.join(', ') || ''}
                  onChange={(e) => setEditingPost({ 
                    ...editingPost, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="AI, Chemistry, Research..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="premium"
                  checked={editingPost?.isPremium || false}
                  onChange={(e) => setEditingPost({ ...editingPost, isPremium: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="premium" className="text-sm font-medium text-gray-700">
                  Premium Content
                </label>
              </div>

              {/* Content Preview */}
              {editingPost?.content && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-2 text-sm">Preview:</h4>
                  <div className="max-h-32 overflow-y-auto text-xs text-gray-600 whitespace-pre-wrap">
                    {editingPost.content.substring(0, 500)}
                    {editingPost.content.length > 500 && '...'}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {editingPost.content.length} chars • ~{Math.ceil(editingPost.content.split(' ').length / 200)} min read
                  </p>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => handleSavePost('draft')}
                  className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Draft</span>
                </button>
                <button
                  onClick={() => handleSavePost('publish')}
                  className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Publish Now</span>
                </button>
                {scheduledDate && scheduledTime && (
                  <button
                    onClick={() => handleSavePost('schedule')}
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Schedule Post</span>
                  </button>
                )}
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
                <span>Back to Blogs</span>
              </button>
            )}
            <h1 className="text-4xl font-bold text-gray-800">Blog Management for <span className="text-yellow-300">Au</span><span className="text-gray-800">rimas</span></h1>
          </div>
          <div className="flex items-center space-x-4">
            {isSupabaseEnabled && (
              <div className="text-sm text-green-600 bg-green-100 px-3 py-2 rounded-lg">
                ✅ Supabase Connected
              </div>
            )}
          <button
            onClick={handleCreatePost}
            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Post</span>
          </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              }`}
            >
              All Posts
            </button>
            {Object.entries(blogCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === key
                    ? 'bg-yellow-500 text-white'
                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        <div className="grid gap-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No posts yet. Create your first blog post!</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-white border border-yellow-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : post.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status === 'scheduled' ? `Scheduled for ${new Date(post.publishedAt).toLocaleString()}` : post.status}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                        {blogCategories[post.category]?.title}
                      </span>
                      {post.isPremium && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          Premium
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-2">{post.excerpt}</p>
                    <div className="text-sm text-gray-500">
                      {new Date(post.publishedAt).toLocaleDateString()} • {post.readTime} min read
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {(post.status === 'draft' || post.status === 'scheduled') && (
                      <button
                        onClick={() => handlePublishPost(post.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Publish"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleEditPost(post)}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};