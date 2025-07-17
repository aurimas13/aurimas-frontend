import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Eye } from 'lucide-react';
import { BlogPost } from '../types';
import { blogCategories } from '../data/blogCategories';

export const BlogManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Load posts from localStorage on component mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('blog-posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    localStorage.setItem('blog-posts', JSON.stringify(posts));
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
    setEditingPost(post);
    setIsEditing(true);
  };

  const handleSavePost = () => {
    if (!editingPost || !editingPost.title || !editingPost.content) return;

    const postToSave: BlogPost = {
      id: editingPost.id || Date.now().toString(),
      title: editingPost.title,
      excerpt: editingPost.excerpt || editingPost.content.substring(0, 150) + '...',
      content: editingPost.content,
      category: editingPost.category as any,
      publishedAt: editingPost.publishedAt || new Date().toISOString(),
      readTime: Math.ceil(editingPost.content.split(' ').length / 200),
      isPremium: editingPost.isPremium || false,
      tags: editingPost.tags || [],
      author: editingPost.author || 'Aurimas Aleksandras Nausėdas',
      status: editingPost.status as any || 'draft'
    };

    if (editingPost.id) {
      setPosts(posts.map(p => p.id === editingPost.id ? postToSave : p));
    } else {
      setPosts([...posts, postToSave]);
    }

    setIsEditing(false);
    setEditingPost(null);
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const handlePublishPost = (id: string) => {
    setPosts(posts.map(p => 
      p.id === id 
        ? { ...p, status: 'published' as const, publishedAt: new Date().toISOString() }
        : p
    ));
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
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
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
                  className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Brief description of the post..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={editingPost?.content || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  rows={15}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Write your blog post content here..."
                />
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

              <div className="flex space-x-4">
                <button
                  onClick={handleSavePost}
                  className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Post</span>
                </button>
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
          <h1 className="text-4xl font-bold text-gray-800">Blog Management for <span className="text-yellow-300">Au</span><span className="text-gray-800">rimas</span></h1>
          <button
            onClick={handleCreatePost}
            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Post</span>
          </button>
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
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status}
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
                    {post.status === 'draft' && (
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