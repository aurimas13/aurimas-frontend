import React, { useState, useEffect, useRef } from 'react';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Poll voting state
  const [pollVotes, setPollVotes] = useState<{[pollId: string]: {[option: string]: number}}>({});
  const [userVotes, setUserVotes] = useState<{[pollId: string]: string}>({});

  // Generate a simple user identifier (in production, use proper IP detection)
  const getUserId = () => {
    let userId = localStorage.getItem('blog-user-id');
    if (!userId) {
      userId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('blog-user-id', userId);
    }
    return userId;
  };

  // Helper function to compress images
  const compressImage = (file: File, quality: number = 0.7): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 1200px width)
        const maxWidth = 1200;
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        }, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Generate very short encrypted filename
  const generateShortFileName = (extension: string): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${result}.${extension}`;
  };

  // Store compressed images in localStorage with short keys
  const storeCompressedFile = (shortName: string, dataUrl: string) => {
    try {
      const stored = localStorage.getItem('blog-files') || '{}';
      const files = JSON.parse(stored);
      files[shortName] = dataUrl;
      localStorage.setItem('blog-files', JSON.stringify(files));
    } catch (error) {
      console.error('Error storing file:', error);
    }
  };

  // Retrieve compressed file from localStorage
  const getStoredFile = (shortName: string): string | null => {
    try {
      const stored = localStorage.getItem('blog-files') || '{}';
      const files = JSON.parse(stored);
      return files[shortName] || null;
    } catch (error) {
      console.error('Error retrieving file:', error);
      return null;
    }
  };

  // Poll component with voting functionality
  const PollComponent: React.FC<{
    question: string;
    options: string[];
    pollId: string;
  }> = ({ question, options, pollId }) => {
    const userId = getUserId();
    const hasVoted = userVotes[pollId] !== undefined;
    const currentVotes = pollVotes[pollId] || {};
    const totalVotes = Object.values(currentVotes).reduce((sum, count) => sum + count, 0);
    
    const handleVote = (option: string) => {
      if (hasVoted) return;
      
      // Update poll votes
      setPollVotes(prev => ({
        ...prev,
        [pollId]: {
          ...prev[pollId],
          [option]: (prev[pollId]?.[option] || 0) + 1
        }
      }));
      
      // Mark user as voted
      setUserVotes(prev => ({
        ...prev,
        [pollId]: option
      }));
      
      // Save to localStorage for persistence
      const savedVotes = JSON.parse(localStorage.getItem('blog-poll-votes') || '{}');
      const savedUserVotes = JSON.parse(localStorage.getItem('blog-user-votes') || '{}');
      
      savedVotes[pollId] = {
        ...savedVotes[pollId],
        [option]: (savedVotes[pollId]?.[option] || 0) + 1
      };
      savedUserVotes[pollId] = option;
      
      localStorage.setItem('blog-poll-votes', JSON.stringify(savedVotes));
      localStorage.setItem('blog-user-votes', JSON.stringify(savedUserVotes));
    };
    
    // Load saved votes on mount
    React.useEffect(() => {
      const savedVotes = JSON.parse(localStorage.getItem('blog-poll-votes') || '{}');
      const savedUserVotes = JSON.parse(localStorage.getItem('blog-user-votes') || '{}');
      
      if (savedVotes[pollId]) {
        setPollVotes(prev => ({ ...prev, [pollId]: savedVotes[pollId] }));
      }
      if (savedUserVotes[pollId]) {
        setUserVotes(prev => ({ ...prev, [pollId]: savedUserVotes[pollId] }));
      }
    }, [pollId]);
    
    return (
      <div className="my-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h4 className="font-semibold text-gray-800 mb-3">📊 {question}</h4>
        <div className="space-y-2">
          {options.map((option, optionIndex) => {
            const voteCount = currentVotes[option] || 0;
            const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
            const isSelected = userVotes[pollId] === option;
            
            return (
              <div key={optionIndex} className="relative">
                <button
                  onClick={() => handleVote(option)}
                  disabled={hasVoted}
                  className={`w-full text-left p-3 rounded border transition-colors ${
                    hasVoted
                      ? isSelected
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'bg-gray-100 border-gray-200 text-gray-600'
                      : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span className="font-medium">{option.trim()}</span>
                    </div>
                    {hasVoted && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{voteCount} votes</span>
                        <span className="text-sm font-medium text-gray-700">{percentage.toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                  {hasVoted && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isSelected ? 'bg-blue-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}</span>
          {hasVoted && (
            <span className="text-green-600 font-medium">✓ You voted for "{userVotes[pollId]}"</span>
          )}
        </div>
      </div>
    );
  };

  // Helper function to check if a line is inside a code block
  const isInsideCodeBlock = (lineIndex: number, content: string): boolean => {
    const lines = content.split('\n');
    let inCodeBlock = false;
    
    for (let i = 0; i < lineIndex; i++) {
      if (lines[i].startsWith('```')) {
        inCodeBlock = !inCodeBlock;
      }
    }
    
    return inCodeBlock;
  };

  // Insert content at cursor position (with fallback to end)
  const insertAtCursor = (content: string) => {
    if (!currentPost) {
      console.error('Cannot insert: currentPost is null');
      return;
    }

    let insertPosition = 0;
    let endPosition = 0;
    
    // Try to get cursor position from textarea
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      insertPosition = textarea.selectionStart || 0;
      endPosition = textarea.selectionEnd || 0;
      console.log('Using cursor position:', insertPosition, 'to', endPosition);
    } else {
      // Fallback: insert at end
      insertPosition = currentPost.content.length;
      endPosition = insertPosition;
      console.log('Textarea ref not available, inserting at end:', insertPosition);
    }
    
    const currentContent = currentPost.content;
    console.log('Current content length:', currentContent.length);
    console.log('Content to insert:', content.substring(0, 100) + '...');
    
    const newContent = 
      currentContent.substring(0, insertPosition) + 
      content + 
      currentContent.substring(endPosition);
    
    console.log('New content length:', newContent.length);
    console.log('Content change detected:', newContent !== currentContent);
    
    // Update the post content
    updateCurrentPost({ content: newContent });
    
    // Try to restore cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        const textarea = textareaRef.current;
        const newCursorPosition = insertPosition + content.length;
        textarea.selectionStart = newCursorPosition;
        textarea.selectionEnd = newCursorPosition;
        textarea.focus();
        console.log('Cursor restored to position:', newCursorPosition);
      }
    }, 100);
  };

  // Alternative method to insert at end (for testing)
  const insertAtEnd = (content: string) => {
    if (!currentPost) return;
    
    const newContent = currentPost.content + '\n' + content;
    console.log('Inserting at end. Old length:', currentPost.content.length, 'New length:', newContent.length);
    updateCurrentPost({ content: newContent });
  };

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
      console.log('🔄 Saving posts to localStorage:', postsToSave.length, 'posts');
      postsToSave.forEach((post, index) => {
        if (post.uploadedFiles && post.uploadedFiles.length > 0) {
          console.log(`💾 Post ${index} (${post.title}) saving with ${post.uploadedFiles.length} files:`, post.uploadedFiles);
        }
      });
      localStorage.setItem('blog-posts', JSON.stringify(postsToSave));
      console.log('✅ Posts saved successfully to localStorage');
    } catch (error) {
      console.error('❌ Error saving posts:', error);
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

  // Function to clean up content with long base64 strings
  const cleanupLongDataUrls = () => {
    if (!currentPost) return;
    
    let content = currentPost.content;
    let hasChanges = false;
    
    // Replace long base64 image URLs with short references
    const imageRegex = /!\[([^\]]*)\]\(data:image\/[^;]+;base64,[^)]{100,}\)/g;
    
    content = content.replace(imageRegex, (match, alt) => {
      hasChanges = true;
      
      // Extract the base64 data
      const dataUrlMatch = match.match(/data:image\/[^;]+;base64,[^)]+/);
      if (dataUrlMatch && currentPost?.uploadedFiles) {
        const dataUrl = dataUrlMatch[0];
        
        // Find the corresponding uploaded file
        const uploadedFile = currentPost.uploadedFiles.find(f => f.url === dataUrl);
        if (uploadedFile) {
          return `![${alt}](${uploadedFile.name})`;
        }
      }
      
      // If no match found, generate a new short name and store it
      const fileExtension = 'jpg'; // Default extension
      const shortName = generateShortFileName(fileExtension);
      const dataUrlMatch2 = match.match(/data:[^)]+/);
      if (dataUrlMatch2) {
        storeCompressedFile(shortName, dataUrlMatch2[0]);
        
        // Add to uploaded files
        const fileInfo = {
          id: shortName,
          name: shortName,
          originalName: alt || 'image',
          url: dataUrlMatch2[0],
          type: 'image/jpeg',
          size: Math.round(dataUrlMatch2[0].length * 0.75) // Estimate size
        };
        
        if (currentPost.uploadedFiles) {
          currentPost.uploadedFiles.push(fileInfo);
        } else {
          currentPost.uploadedFiles = [fileInfo];
        }
        
        return `![${alt}](${shortName})`;
      }
      
      return match; // Return original if we can't process it
    });
    
    if (hasChanges) {
      updateCurrentPost({ content });
      alert('✅ Content cleaned up! Long image URLs have been replaced with short references.');
    } else {
      alert('ℹ️ No long image URLs found to clean up.');
    }
  };

  const updateCurrentPost = (updates: Partial<BlogPost>) => {
    if (currentPost) {
      setCurrentPost({ ...currentPost, ...updates });
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (!currentPost) {
      console.error('No current post selected');
      return;
    }

    console.log('Starting file upload for', files.length, 'files');
    setIsLoading(true);
    const newUploadedFiles = [...(currentPost.uploadedFiles || [])];
    let allEmbedCodes = ''; // Collect all embed codes to insert at once

    for (const file of files) {
      try {
        console.log('Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);
        
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
        const shortName = generateShortFileName(fileExtension);
        console.log('Generated short name:', shortName);
        
        let processedFile: File | Blob = file;
        let embedCode = '';
        
        // Compress images for better performance
        if (file.type.startsWith('image/')) {
          console.log('Compressing image...');
          processedFile = await compressImage(file);
          console.log(`Image compressed: ${file.size} -> ${processedFile.size} bytes`);
        }

        // Convert to base64 data URL
        console.log('Converting to base64...');
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            console.log('File conversion completed');
            resolve(reader.result as string);
          };
          reader.onerror = () => {
            console.error('File conversion failed');
            reject(new Error('Failed to read file'));
          };
        });
        
        reader.readAsDataURL(processedFile);
        const dataUrl = await base64Promise;
        console.log('Data URL created, length:', dataUrl.length);
        
        // Store compressed file with short name
        storeCompressedFile(shortName, dataUrl);
        console.log('File stored in localStorage with key:', shortName);
        
        // Store file info for persistence
        const fileInfo = {
          id: shortName,
          name: shortName,
          originalName: file.name,
          url: dataUrl, // Store the full data URL for preview
          type: file.type,
          size: processedFile.size
        };
        newUploadedFiles.push(fileInfo);

        // Generate embed code based on file type - USE SHORT REFERENCE, NOT FULL DATA URL
        if (file.type.startsWith('image/')) {
          embedCode = `![${file.name}](${shortName})\n`; // Use short name instead of data URL
          console.log('Generated image embed code with short reference');
        } else if (file.type.startsWith('video/')) {
          embedCode = `[VIDEO:${shortName}]\n`;
          console.log('Generated video embed code with short reference');
        } else if (file.type.startsWith('audio/')) {
          embedCode = `[AUDIO:${shortName}]\n`;
          console.log('Generated audio embed code with short reference');
        } else if (file.type === 'application/pdf') {
          embedCode = `[PDF:${shortName}]\n`;
          console.log('Generated PDF embed code with short reference');
        } else {
          embedCode = `[FILE:${shortName}](${file.name})\n`;
          console.log('Generated file embed code with short reference');
        }

        console.log('Embed code:', embedCode);
        allEmbedCodes += embedCode; // Collect all embed codes
        
        console.log(`File processed successfully with short name: ${shortName}`);

      } catch (error) {
        console.error('Error uploading file:', error);
        setError(`Failed to process file: ${file.name}`);
      }
    }

    // Insert all embed codes at once and update uploaded files
    if (allEmbedCodes && currentPost) {
      console.log('Inserting all embed codes at cursor position:', allEmbedCodes.length, 'characters');
      
      let insertPosition = 0;
      let endPosition = 0;
      
      // Try to get cursor position from textarea
      if (textareaRef.current) {
        const textarea = textareaRef.current;
        insertPosition = textarea.selectionStart || 0;
        endPosition = textarea.selectionEnd || 0;
        console.log('Using cursor position:', insertPosition, 'to', endPosition);
      } else {
        // Fallback: insert at end
        insertPosition = currentPost.content.length;
        endPosition = insertPosition;
        console.log('Textarea ref not available, inserting at end:', insertPosition);
      }
      
      const currentContent = currentPost.content;
      const newContent = 
        currentContent.substring(0, insertPosition) + 
        allEmbedCodes + 
        currentContent.substring(endPosition);
      
      console.log('Final content update with both content and files');
      
      // Update both content and uploaded files in a single call
      updateCurrentPost({ 
        content: newContent,
        uploadedFiles: newUploadedFiles 
      });
      
      // Try to restore cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          const textarea = textareaRef.current;
          const newCursorPosition = insertPosition + allEmbedCodes.length;
          textarea.setSelectionRange(newCursorPosition, newCursorPosition);
          console.log('Cursor repositioned to:', newCursorPosition);
        }
      }, 10);
    }
    setIsLoading(false);
    console.log('File upload process completed');
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

  // Title cache for YouTube and Spotify
  const titleCache = useRef(new Map<string, string>());

  // Function to fetch YouTube title
  const fetchYouTubeTitle = async (videoId: string): Promise<string> => {
    const cacheKey = `youtube-${videoId}`;
    if (titleCache.current.has(cacheKey)) {
      return titleCache.current.get(cacheKey)!;
    }

    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      if (response.ok) {
        const data = await response.json();
        const title = data.title || `Video ID: ${videoId}`;
        titleCache.current.set(cacheKey, title);
        return title;
      }
    } catch (error) {
      console.error('Error fetching YouTube title:', error);
    }
    
    const fallbackTitle = `Video ID: ${videoId}`;
    titleCache.current.set(cacheKey, fallbackTitle);
    return fallbackTitle;
  };

  // Function to fetch Spotify title
  const fetchSpotifyTitle = async (url: string, itemType: string, itemId: string): Promise<string> => {
    const cacheKey = `spotify-${itemId}`;
    if (titleCache.current.has(cacheKey)) {
      return titleCache.current.get(cacheKey)!;
    }

    try {
      const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`);
      if (response.ok) {
        const data = await response.json();
        const title = data.title || `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} ID: ${itemId}`;
        titleCache.current.set(cacheKey, title);
        return title;
      }
    } catch (error) {
      console.error('Error fetching Spotify title:', error);
    }
    
    const fallbackTitle = `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} ID: ${itemId}`;
    titleCache.current.set(cacheKey, fallbackTitle);
    return fallbackTitle;
  };

  // YouTube Embed Component
  const YouTubeEmbed: React.FC<{ url: string; videoId: string }> = ({ url, videoId }) => {
    const [videoTitle, setVideoTitle] = useState('Loading video title...');

    useEffect(() => {
      fetchYouTubeTitle(videoId).then(setVideoTitle);
    }, [videoId]);

    return (
      <div className="my-4">
        {/* Actual YouTube embed iframe */}
        <div className="relative w-full mb-2" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title={videoTitle}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
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
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Watch Video →
            </a>
          </div>
        </div>
      </div>
    );
  };  const SpotifyEmbed: React.FC<{ url: string; itemType: string; itemId: string }> = ({ url, itemType, itemId }) => {
    const [itemTitle, setItemTitle] = useState('Loading...');

    useEffect(() => {
      fetchSpotifyTitle(url, itemType, itemId).then(setItemTitle);
    }, [url, itemType, itemId]);

    return (
      <div className="my-4">
        {/* Actual Spotify embed iframe */}
        <div className="w-full mb-2">
          <iframe
            className="w-full rounded-lg shadow-lg"
            src={`https://open.spotify.com/embed/${itemType}/${itemId}?utm_source=generator&theme=0`}
            height={itemType === 'track' ? '152' : itemType === 'album' ? '352' : '352'}
            frameBorder="0"
            allowFullScreen={false}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-green-600">
              <span className="text-2xl">🎵</span>
              <div>
                <div className="font-bold">{itemTitle}</div>
                <div className="text-sm text-gray-600">Spotify</div>
              </div>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Listen on Spotify →
            </a>
          </div>
        </div>
      </div>
    );
  };  // Enhanced Image Component with Context Menu
  const EnhancedImage: React.FC<{ 
    src: string; 
    alt: string; 
    caption?: string;
    width?: 'normal' | 'wide' | 'full';
    originalLine: string;
    onUpdate: (newLine: string) => void;
  }> = ({ src, alt, caption, width = 'normal', originalLine, onUpdate }) => {
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [showEditModal, setShowEditModal] = useState(false);
    const [editType, setEditType] = useState<'caption' | 'alt' | null>(null);
    const [editValue, setEditValue] = useState('');

    // Resolve short filename to actual data URL if needed
    let actualSrc = src;
    if (!src.startsWith('data:') && !src.startsWith('http')) {
      const storedFile = getStoredFile(src);
      if (storedFile) {
        actualSrc = storedFile;
      } else {
        const uploadedFile = currentPost?.uploadedFiles?.find(f => f.name === src || f.id === src);
        if (uploadedFile?.url) {
          actualSrc = uploadedFile.url;
        }
      }
    }

    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
      setShowContextMenu(true);
    };

    const closeContextMenu = () => {
      setShowContextMenu(false);
    };

    const handleEdit = (type: 'caption' | 'alt') => {
      setEditType(type);
      setEditValue(type === 'caption' ? caption || '' : alt);
      setShowEditModal(true);
      closeContextMenu();
    };

    const handleWidthChange = (newWidth: 'normal' | 'wide' | 'full') => {
      let newLine = originalLine;
      if (newWidth !== 'normal') {
        // Add width attribute to the image markdown
        const match = newLine.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (match) {
          const [, altText, url] = match;
          newLine = `![${altText}](${url}){width=${newWidth}}`;
        }
      } else {
        // Remove width attribute
        newLine = newLine.replace(/\{width=(wide|full)\}/, '');
      }
      onUpdate(newLine);
      closeContextMenu();
    };

    const handleSaveEdit = () => {
      let newLine = originalLine;
      const match = newLine.match(/!\[([^\]]*)\]\(([^)]+)\)(\{width=(wide|full)\})?/);
      
      if (match && editType) {
        const [, currentAlt, url, widthPart] = match;
        if (editType === 'alt') {
          newLine = `![${editValue}](${url})${widthPart || ''}`;
        } else if (editType === 'caption') {
          // For caption, we'll add it as a separate line after the image
          const baseImage = `![${currentAlt}](${url})${widthPart || ''}`;
          newLine = editValue ? `${baseImage}\n*${editValue}*` : baseImage;
        }
        onUpdate(newLine);
      }
      setShowEditModal(false);
      setEditType(null);
      setEditValue('');
    };

    const handleDelete = () => {
      onUpdate('');
      closeContextMenu();
    };

    const handleAddWatermark = () => {
      // For now, we'll add a simple text overlay. In a real implementation,
      // you might want to process the image with a watermark
      alert('Watermark functionality would be implemented here. This would require image processing capabilities.');
      closeContextMenu();
    };

    const getWidthClass = () => {
      switch (width) {
        case 'wide': return 'w-4/5 max-w-4xl';
        case 'full': return 'w-full max-w-none';
        default: return 'max-w-2xl';
      }
    };

    return (
      <>
        <div className="mb-4 flex justify-center">
          <div className={`relative ${getWidthClass()}`}>
            <img 
              src={actualSrc} 
              alt={alt} 
              className="w-full h-auto rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onContextMenu={handleContextMenu}
              onLoad={() => console.log('Image loaded:', actualSrc.substring(0, 50) + '...')}
              onError={(e) => {
                console.error('Image failed to load:', actualSrc.substring(0, 50) + '...');
                e.currentTarget.style.display = 'none';
              }}
            />
            
            {/* Context Menu Trigger Icon */}
            <button
              onClick={handleContextMenu}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              title="Image options"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2"/>
                <circle cx="12" cy="12" r="2"/>
                <circle cx="12" cy="19" r="2"/>
              </svg>
            </button>
          </div>
        </div>
        
        {caption && (
          <p className="text-sm text-gray-600 text-center italic mb-4">{caption}</p>
        )}

        {/* Context Menu */}
        {showContextMenu && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={closeContextMenu}
            />
            <div 
              className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[180px]"
              style={{ 
                left: Math.min(contextMenuPosition.x, window.innerWidth - 200),
                top: Math.min(contextMenuPosition.y, window.innerHeight - 300)
              }}
            >
              <button
                onClick={() => handleEdit('caption')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
              >
                <span>📝</span><span>Edit caption</span>
              </button>
              <button
                onClick={() => handleEdit('alt')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
              >
                <span>🏷️</span><span>Edit alt text</span>
              </button>
              <button
                onClick={handleAddWatermark}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
              >
                <span>💧</span><span>Add watermark</span>
              </button>
              <hr className="my-1"/>
              <button
                onClick={() => handleWidthChange('normal')}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${width === 'normal' ? 'bg-blue-50 text-blue-600' : ''}`}
              >
                <span>📱</span><span>Normal width</span>
              </button>
              <button
                onClick={() => handleWidthChange('wide')}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${width === 'wide' ? 'bg-blue-50 text-blue-600' : ''}`}
              >
                <span>📐</span><span>Wide width</span>
              </button>
              <button
                onClick={() => handleWidthChange('full')}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${width === 'full' ? 'bg-blue-50 text-blue-600' : ''}`}
              >
                <span>🖼️</span><span>Full width</span>
              </button>
              <hr className="my-1"/>
              <button
                onClick={handleDelete}
                className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 flex items-center space-x-2"
              >
                <span>🗑️</span><span>Delete image</span>
              </button>
            </div>
          </>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                Edit {editType === 'caption' ? 'Caption' : 'Alt Text'}
              </h3>
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={editType === 'caption' ? 'Enter image caption...' : 'Enter alt text for accessibility...'}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  // Process inline markdown
  const processInlineMarkdown = (text: string) => {
    let processedText = text;
    
    // Handle traditional markdown links [text](url)
    processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
      // Ensure URL has protocol
      const processedUrl = url.startsWith('http') ? url : `https://${url}`;
      return `<a href="${processedUrl}" target="_blank" rel="noopener noreferrer" class="text-green-600 hover:text-green-800 underline font-medium">${linkText}</a>`;
    });
    
    // Handle simple link syntax [text|url] - easier to type
    processedText = processedText.replace(/\[([^\]]+)\|([^\]]+)\]/g, (match, linkText, url) => {
      // Ensure URL has protocol
      const processedUrl = url.startsWith('http') ? url : `https://${url}`;
      return `<a href="${processedUrl}" target="_blank" rel="noopener noreferrer" class="text-green-600 hover:text-green-800 underline font-medium">${linkText}</a>`;
    });
    
    // Handle direct URLs (make them clickable)
    processedText = processedText.replace(/(^|[\s])((https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?)/g, (match, prefix, url, protocol, domain, path) => {
      const fullUrl = protocol ? url : `https://${url}`;
      return `${prefix}<a href="${fullUrl}" target="_blank" rel="noopener noreferrer" class="text-green-600 hover:text-green-800 underline font-medium">${url}</a>`;
    });
    
    // Handle bold+italic ***text*** (must come before **text** and *text*)
    processedText = processedText.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    
    // Handle bold **text**
    processedText = processedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Handle italic *text*
    processedText = processedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Handle underline _text_
    processedText = processedText.replace(/_(.*?)_/g, '<u>$1</u>');
    
    return processedText;
  };

  const ContentPreview: React.FC<{ content: string }> = ({ content }) => {
    const updateContentLine = (oldLine: string, newLine: string) => {
      if (!currentPost) return;
      
      const updatedContent = content.replace(oldLine, newLine);
      updateCurrentPost({ content: updatedContent });
    };

    const renderLine = (line: string, index: number) => {
      if (line.trim() === '') return <br key={index} />;
      
      // Skip caption lines that are already handled by images
      if (line.match(/^\*(.+)\*$/) && index > 0) {
        const lines = content.split('\n');
        const prevLine = lines[index - 1];
        if (prevLine && prevLine.match(/!\[([^\]]*)\]\(([^)]+)\)/)) {
          return null; // Skip this line as it's handled as a caption
        }
      }
      
      // Handle headers with inline markdown support
      if (line.startsWith('# ')) {
        const headerText = line.substring(2);
        const processedText = processInlineMarkdown(headerText);
        return <h1 key={index} className="text-2xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: processedText }} />;
      }
      if (line.startsWith('## ')) {
        const headerText = line.substring(3);
        const processedText = processInlineMarkdown(headerText);
        return <h2 key={index} className="text-xl font-semibold mb-3" dangerouslySetInnerHTML={{ __html: processedText }} />;
      }
      if (line.startsWith('### ')) {
        const headerText = line.substring(4);
        const processedText = processInlineMarkdown(headerText);
        return <h3 key={index} className="text-lg font-medium mb-2" dangerouslySetInnerHTML={{ __html: processedText }} />;
      }

      // Handle dividers
      if (line.trim() === '---' || line.trim() === '___') {
        return <hr key={index} className="my-8 border-gray-300" />;
      }

      // Handle polls - [POLL:Question|Option1|Option2|Option3]
      if (line.includes('[POLL:') && line.includes(']')) {
        const startIndex = line.indexOf('[POLL:') + 6;
        const endIndex = line.indexOf(']', startIndex);
        if (endIndex > startIndex) {
          const pollData = line.substring(startIndex, endIndex);
          const parts = pollData.split('|');
          if (parts.length >= 3) {
            const question = parts[0];
            const options = parts.slice(1);
            const pollId = `poll-${index}-${question.slice(0, 10).replace(/\s+/g, '-')}`;
            
            return (
              <PollComponent
                key={index}
                pollId={pollId}
                question={question}
                options={options}
              />
            );
          }
        }
      }

      // Handle code blocks - ```language\ncode\n```
      if (line.startsWith('```')) {
        const language = line.substring(3).trim();
        const lines = content.split('\n');
        let codeLines = [];
        let endIndex = index + 1;
        
        // Find the closing ```
        for (let i = index + 1; i < lines.length; i++) {
          if (lines[i].trim() === '```') {
            endIndex = i;
            break;
          }
          codeLines.push(lines[i]);
        }
        
        if (endIndex > index) {
          const codeContent = codeLines.join('\n');
          return (
            <div key={index} className="my-4">
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                {language && (
                  <div className="bg-gray-800 px-4 py-2 text-sm text-gray-300 font-mono">
                    {language}
                  </div>
                )}
                <pre className="p-4 text-green-400 font-mono text-sm overflow-x-auto">
                  <code>{codeContent}</code>
                </pre>
              </div>
            </div>
          );
        }
      }

      // Skip lines that are part of code blocks
      if (isInsideCodeBlock(index, content)) {
        return null;
      }
      
      // Handle YouTube embeds
      if (line.includes('[YOUTUBE:') && line.includes(']')) {
        const startIndex = line.indexOf('[YOUTUBE:') + 9;
        const endIndex = line.indexOf(']', startIndex);
        if (endIndex > startIndex) {
          const url = line.substring(startIndex, endIndex);
          
          let videoId = '';
          if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0].split('&')[0];
          } else if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1].split('&')[0].split('#')[0];
          }
          
          if (videoId) {
            return <YouTubeEmbed key={index} url={url} videoId={videoId} />;
          }
        }
      }
      
      // Handle Spotify embeds
      if (line.includes('[SPOTIFY:') && line.includes(']')) {
        const startIndex = line.indexOf('[SPOTIFY:') + 9;
        const endIndex = line.indexOf(']', startIndex);
        if (endIndex > startIndex) {
          const url = line.substring(startIndex, endIndex);
          
          let itemType = 'track';
          let itemId = '';
          
          if (url.includes('open.spotify.com/track/')) {
            itemType = 'track';
            itemId = url.split('/track/')[1].split('?')[0];
          } else if (url.includes('open.spotify.com/album/')) {
            itemType = 'album';
            itemId = url.split('/album/')[1].split('?')[0];
          } else if (url.includes('open.spotify.com/playlist/')) {
            itemType = 'playlist';
            itemId = url.split('/playlist/')[1].split('?')[0];
          }
          
          if (itemId) {
            return <SpotifyEmbed key={index} url={url} itemType={itemType} itemId={itemId} />;
          }
        }
      }
      
      // Handle images - ![alt](url) with optional width and caption
      const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)(\{width=(wide|full)\})?/);
      if (imageMatch) {
        const [, alt, src, , widthValue] = imageMatch;
        const width = widthValue as 'normal' | 'wide' | 'full' || 'normal';
        
        // Check if next line is a caption (italic text)
        const lines = content.split('\n');
        const nextLine = lines[index + 1];
        const caption = nextLine && nextLine.match(/^\*(.+)\*$/) ? nextLine.match(/^\*(.+)\*$/)![1] : undefined;
        
        return (
          <EnhancedImage
            key={index}
            src={src}
            alt={alt}
            caption={caption}
            width={width}
            originalLine={line}
            onUpdate={(newLine) => updateContentLine(line, newLine)}
          />
        );
      }
      
      // Handle videos - [VIDEO:url]
      const videoMatch = line.match(/\[VIDEO:([^}]+)\]/);
      if (videoMatch) {
        const [, src] = videoMatch;
        
        // Resolve short filename to actual data URL if needed
        let actualSrc = src;
        if (!src.startsWith('data:') && !src.startsWith('http')) {
          const storedFile = getStoredFile(src);
          if (storedFile) {
            actualSrc = storedFile;
          } else {
            const uploadedFile = currentPost?.uploadedFiles?.find(f => f.name === src || f.id === src);
            if (uploadedFile?.url) {
              actualSrc = uploadedFile.url;
            }
          }
        }
        
        return (
          <div key={index} className="mb-4">
            <video 
              controls 
              className="max-w-full h-auto rounded-lg shadow-md"
              style={{ maxHeight: '400px' }}
            >
              <source src={actualSrc} />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      }
      
      // Handle audio - [AUDIO:url]
      const audioMatch = line.match(/\[AUDIO:([^}]+)\]/);
      if (audioMatch) {
        const [, src] = audioMatch;
        
        // Resolve short filename to actual data URL if needed
        let actualSrc = src;
        if (!src.startsWith('data:') && !src.startsWith('http')) {
          const storedFile = getStoredFile(src);
          if (storedFile) {
            actualSrc = storedFile;
          } else {
            const uploadedFile = currentPost?.uploadedFiles?.find(f => f.name === src || f.id === src);
            if (uploadedFile?.url) {
              actualSrc = uploadedFile.url;
            }
          }
        }
        
        return (
          <div key={index} className="mb-4">
            <audio 
              controls 
              className="w-full rounded-lg shadow-md"
            >
              <source src={actualSrc} />
              Your browser does not support the audio tag.
            </audio>
          </div>
        );
      }
      
      // Handle PDFs - [PDF:url]
      const pdfMatch = line.match(/\[PDF:([^}]+)\]/);
      if (pdfMatch) {
        const [, src] = pdfMatch;
        
        // Resolve short filename to actual data URL if needed
        let actualSrc = src;
        if (!src.startsWith('data:') && !src.startsWith('http')) {
          const storedFile = getStoredFile(src);
          if (storedFile) {
            actualSrc = storedFile;
          } else {
            const uploadedFile = currentPost?.uploadedFiles?.find(f => f.name === src || f.id === src);
            if (uploadedFile?.url) {
              actualSrc = uploadedFile.url;
            }
          }
        }
        
        return (
          <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">📄 PDF Document</p>
            <a 
              href={actualSrc} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Open PDF in new tab
            </a>
          </div>
        );
      }
      
      // Handle other files - [FILE:url](name)
      const fileMatch = line.match(/\[FILE:([^}]+)\]\(([^)]+)\)/);
      if (fileMatch) {
        const [, src, name] = fileMatch;
        
        // Resolve short filename to actual data URL if needed
        let actualSrc = src;
        if (!src.startsWith('data:') && !src.startsWith('http')) {
          const storedFile = getStoredFile(src);
          if (storedFile) {
            actualSrc = storedFile;
          } else {
            const uploadedFile = currentPost?.uploadedFiles?.find(f => f.name === src || f.id === src);
            if (uploadedFile?.url) {
              actualSrc = uploadedFile.url;
            }
          }
        }
        return (
          <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">📎 File Attachment</p>
            <a 
              href={actualSrc} 
              download={name}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Download {name}
            </a>
          </div>
        );
      }
      
      // Handle bold text
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-bold mb-2">{line.slice(2, -2)}</p>;
      }
      
      // Handle bullet points
      if (line.startsWith('- ')) {
        const content = line.substring(2);
        return (
          <div key={index} className="flex items-start mb-2">
            <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span dangerouslySetInnerHTML={{ __html: processInlineMarkdown(content) }} />
          </div>
        );
      }
      
      // Handle empty bullet points
      if (line.startsWith('-- ')) {
        const content = line.substring(3);
        return (
          <div key={index} className="flex items-start mb-2">
            <span className="inline-block w-2 h-2 border border-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span dangerouslySetInnerHTML={{ __html: processInlineMarkdown(content) }} />
          </div>
        );
      }
      
      // Handle regular paragraphs with inline markdown
      return (
        <p 
          key={index} 
          className="mb-2" 
          dangerouslySetInnerHTML={{ __html: processInlineMarkdown(line) }}
        />
      );
    };

    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Preview</h3>
        <div className="prose max-w-none">
          {content.split('\n').map((line, index) => renderLine(line, index))}
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
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                          <div className="space-y-2">
                            {[
                              { code: 'en', label: '🇺🇸 English' },
                              { code: 'lt', label: '🇱🇹 Lithuanian' },
                              { code: 'fr', label: '🇫🇷 French' }
                            ].map((lang) => {
                              const currentLanguages = currentPost.language ? currentPost.language.split(',') : ['en'];
                              const isSelected = currentLanguages.includes(lang.code);
                              
                              return (
                                <label key={lang.code} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      const currentLanguages = currentPost.language ? currentPost.language.split(',') : ['en'];
                                      let newLanguages;
                                      
                                      if (e.target.checked) {
                                        newLanguages = [...currentLanguages, lang.code];
                                      } else {
                                        newLanguages = currentLanguages.filter(l => l !== lang.code);
                                      }
                                      
                                      // Ensure at least one language is selected
                                      if (newLanguages.length === 0) {
                                        newLanguages = ['en'];
                                      }
                                      
                                      updateCurrentPost({ language: newLanguages.join(',') as any });
                                    }}
                                    className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                                  />
                                  <span className="text-sm">{lang.label}</span>
                                </label>
                              );
                            })}
                          </div>
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
                        
                        {/* Scheduled Date/Time Input */}
                        {currentPost.status === 'scheduled' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Schedule for</label>
                            <input
                              type="datetime-local"
                              value={currentPost.publishedAt ? new Date(currentPost.publishedAt).toISOString().slice(0, 16) : ''}
                              onChange={(e) => updateCurrentPost({ 
                                publishedAt: e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString()
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              min={new Date().toISOString().slice(0, 16)}
                            />
                          </div>
                        )}
                        
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
                            onKeyDown={(e) => {
                              // Allow comma to be typed
                              if (e.key === ',') {
                                e.stopPropagation();
                              }
                            }}
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
                        <h4 className="text-sm font-medium text-gray-700 mb-3">📎 File Uploads (Insert at Cursor)</h4>
                        
                        {/* How to Add Media & Format Content Instructions */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <h5 className="text-sm font-semibold text-blue-800 mb-3">📝 How to Add Media & Format Content:</h5>
                          <div className="space-y-2 text-sm text-blue-700">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">📺</span>
                              <span><strong>YouTube:</strong> <code className="bg-blue-100 px-1 rounded">[YOUTUBE:https://youtu.be/VIDEO_ID]</code></span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">🎵</span>
                              <span><strong>Spotify:</strong> <code className="bg-blue-100 px-1 rounded">[SPOTIFY:https://open.spotify.com/track/TRACK_ID]</code></span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">🖼️</span>
                              <span><strong>Images:</strong> <code className="bg-blue-100 px-1 rounded">![description](https://image-url.com/image.jpg)</code></span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">🔗</span>
                              <span><strong>Links:</strong> <code className="bg-blue-100 px-1 rounded">[link text](https://url.com)</code> or <code className="bg-blue-100 px-1 rounded">[text|url.com]</code></span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">🔗</span>
                              <span><strong>Files:</strong> Drag & drop files below or use upload button</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">📊</span>
                              <span><strong>Polls:</strong> <code className="bg-blue-100 px-1 rounded">[POLL:Question?|Option 1|Option 2|Option 3]</code></span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">💻</span>
                              <span><strong>Code:</strong> <code className="bg-blue-100 px-1 rounded">```javascript<br/>code here<br/>```</code></span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">➖</span>
                              <span><strong>Divider:</strong> <code className="bg-blue-100 px-1 rounded">---</code></span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">✍️</span>
                              <span><strong>Text:</strong> <code className="bg-blue-100 px-1 rounded"># Heading, ## Subheading, **bold**, *italic*, ***bold+italic***, _underline_</code></span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">•</span>
                              <span><strong>Lists:</strong> <code className="bg-blue-100 px-1 rounded">- filled bullet, -- empty bullet</code></span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
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
                              {isLoading ? '⏳ Processing...' : '📁 Upload & Insert'}
                            </label>
                            
                            {/* Cleanup button for fixing existing posts with long data URLs */}
                            <button
                              onClick={cleanupLongDataUrls}
                              className="inline-flex items-center px-4 py-2 border border-orange-300 rounded-lg text-sm font-medium bg-orange-50 hover:bg-orange-100 text-orange-700 transition-colors"
                              title="Clean up existing posts that have very long image URLs"
                            >
                              🧹 Clean Content
                            </button>
                            
                            {/* Test button for debugging */}
                            <button
                              onClick={() => {
                                console.log('Test button clicked');
                                console.log('Current post:', currentPost?.title);
                                console.log('TextareaRef current:', !!textareaRef.current);
                                if (textareaRef.current) {
                                  console.log('Cursor position:', textareaRef.current.selectionStart);
                                }
                                insertAtCursor('🧪 Test insertion at cursor!\n');
                              }}
                              className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                              disabled={!currentPost}
                            >
                              🧪 Test Insert
                            </button>
                            
                            {/* Debug content button */}
                            <button
                              onClick={() => {
                                if (currentPost) {
                                  console.log('=== CONTENT DEBUG ===');
                                  console.log('Content length:', currentPost.content.length);
                                  console.log('Content preview (first 200 chars):', currentPost.content.substring(0, 200));
                                  console.log('Content preview (last 200 chars):', currentPost.content.substring(-200));
                                  console.log('Contains images:', currentPost.content.includes('!['));
                                  console.log('All image matches:', currentPost.content.match(/!\[.*?\]\(.*?\)/g));
                                  console.log('Uploaded files count:', currentPost.uploadedFiles?.length || 0);
                                  alert(`Content length: ${currentPost.content.length}\nContains images: ${currentPost.content.includes('![')}\nCheck console for details`);
                                } else {
                                  alert('No post selected');
                                }
                              }}
                              className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                              disabled={!currentPost}
                            >
                              🔍 Debug Content
                            </button>
                            
                            <span className="text-xs text-gray-500">
                              Images compressed • Short filenames • Persistent storage
                            </span>
                          </div>
                          
                          {/* Instructions */}
                          <div className="bg-blue-50 rounded p-2">
                            <p className="text-xs text-blue-700">
                              💡 <strong>Tip:</strong> Click in the content area where you want to insert the image, then upload your file. 
                              Images are automatically compressed and given short names like "a1b2c3.jpg" for better performance.<br/>
                              📝 <strong>Caption:</strong> Add a caption by writing italic text on the next line after your image: *Your caption here*
                            </p>
                          </div>
                          
                          {/* Show uploaded files */}
                          {currentPost.uploadedFiles && currentPost.uploadedFiles.length > 0 && (
                            <div className="bg-gray-50 rounded p-3">
                              <p className="text-xs font-medium text-gray-600 mb-2">
                                📚 Uploaded Files ({currentPost.uploadedFiles.length}):
                              </p>
                              <div className="space-y-1 max-h-24 overflow-y-auto">
                                {currentPost.uploadedFiles.map((file) => (
                                  <div key={file.id} className="flex items-center justify-between text-xs">
                                    <span className="text-gray-700 flex items-center space-x-2">
                                      <span className="font-mono bg-gray-200 px-1 rounded">{file.name}</span>
                                      <span>({(file.size / 1024).toFixed(1)}KB)</span>
                                      {file.type.startsWith('image/') && <span className="text-green-600">📷 compressed</span>}
                                    </span>
                                    <span className="text-gray-500 truncate max-w-32" title={file.originalName}>
                                      {file.originalName}
                                    </span>
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
                        ref={textareaRef}
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
