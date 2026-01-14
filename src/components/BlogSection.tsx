import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageCode } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { blogCategories } from '../data/blogCategories';
import { 
  ExternalLink, Edit, Trash2, User, Calendar, Clock, ArrowLeft, Lock, 
  Save, Eye, Plus, Edit3, Tag, Unlock, Upload, Image as ImageIcon,
  Music, Video, BarChart3, Bold, Italic, Underline, Link as LinkIcon,
  FileText, Copy, Download, Check, X, MessageSquare, AlignLeft,
  AlignCenter, AlignRight, AlignJustify, List, ListOrdered
} from 'lucide-react';
import { BlogPost } from '../types';
import { subscribeToNewsletter, getNewsletterSubscribers, NewsletterSubscriber, sendNewPostNotification } from '../lib/newsletter';
import { loadSamplePosts } from '../data/samplePosts';
import { v4 as uuidv4 } from 'uuid';

interface BlogSectionProps {
  onManageBlog?: () => void;
}

// YouTube Embed Component (same as BlogManager)
const YouTubeEmbed: React.FC<{ url: string; videoId: string }> = ({ url, videoId }) => {
  const [videoTitle, setVideoTitle] = useState('Loading video title...');

  React.useEffect(() => {
    const fetchTitle = async () => {
      try {
        const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
        if (response.ok) {
          const data = await response.json();
          setVideoTitle(data.title || `Video ID: ${videoId}`);
        }
      } catch (error) {
        console.error('Error fetching YouTube title:', error);
        setVideoTitle('YouTube Video');
      }
    };
    fetchTitle();
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
};

// Spotify Embed Component (same as BlogManager)
const SpotifyEmbed: React.FC<{ url: string; itemType: string; itemId: string }> = ({ url, itemType, itemId }) => {
  const [itemTitle, setItemTitle] = useState('Loading...');

  React.useEffect(() => {
    const fetchTitle = async () => {
      try {
        const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`);
        if (response.ok) {
          const data = await response.json();
          setItemTitle(data.title || `Spotify ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`);
        }
      } catch (error) {
        console.error('Error fetching Spotify title:', error);
        setItemTitle(`Spotify ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`);
      }
    };
    fetchTitle();
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
};

// Process inline markdown (same as BlogManager)
const processInlineMarkdown = (text: string) => {
  let processedText = text;
  
  // Handle both [Text](URL) and [Text|URL] formats - GREEN & ROBUST
  // Process [Text|URL] format first (pipe separator)
  processedText = processedText.replace(/\[([^\]]+)\|([^\]]+)\]/g, (match, linkText, url) => {
    let processedUrl = url.trim();
    if (!processedUrl.startsWith('http')) {
      processedUrl = `https://${processedUrl}`;
    }
    return `<a href="${processedUrl}" target="_blank" rel="noopener noreferrer" class="text-green-600 hover:text-green-800 underline font-medium">${linkText.trim()}</a>`;
  });
  
  // Process [Text](URL) format second (parentheses format)
  processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
    let processedUrl = url.trim();
    if (!processedUrl.startsWith('http')) {
      processedUrl = `https://${processedUrl}`;
    }
    return `<a href="${processedUrl}" target="_blank" rel="noopener noreferrer" class="text-green-600 hover:text-green-800 underline font-medium">${linkText.trim()}</a>`;
  });
  
  // Handle bold+italic ***text***
  processedText = processedText.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  // Handle bold **text**
  processedText = processedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Handle italic *text*
  processedText = processedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Handle underline _text_
  processedText = processedText.replace(/_(.*?)_/g, '<u>$1</u>');
  
  return processedText;
};

// Poll Component for published posts (same as BlogManager)
const PollComponent: React.FC<{
  question: string;
  options: string[];
  pollId: string;
}> = ({ question, options, pollId }) => {
  const [pollVotes, setPollVotes] = React.useState<Record<string, Record<string, number>>>({});
  const [userVotes, setUserVotes] = React.useState<Record<string, string>>({});
  
  // Simple user ID generator
  const getUserId = () => {
    let userId = localStorage.getItem('blog-user-id');
    if (!userId) {
      userId = 'user-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('blog-user-id', userId);
    }
    return userId;
  };

  const userId = getUserId();
  const hasVoted = userVotes[pollId] !== undefined;
  const currentVotes = pollVotes[pollId] || {};
  const totalVotes = Object.values(currentVotes).reduce((sum, count) => sum + count, 0);
  
  const handleVote = (option: string) => {
    if (hasVoted) return;
    
    // Update poll votes (secretly - votes are registered and counted)
    setPollVotes(prev => ({
      ...prev,
      [pollId]: {
        ...prev[pollId],
        [option]: (prev[pollId]?.[option] || 0) + 1
      }
    }));
    
    // Mark user as voted (choice recorded but not displayed)
    setUserVotes(prev => ({
      ...prev,
      [pollId]: option
    }));
    
    // Save to localStorage for persistence (backend storage - votes counted secretly)
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
          return (
            <div key={optionIndex} className="relative">
              <button
                onClick={() => handleVote(option)}
                disabled={hasVoted}
                className={`w-full text-left p-3 rounded border transition-colors ${
                  hasVoted
                    ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-default'
                    : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      hasVoted ? 'border-gray-400 bg-gray-400' : 'border-gray-300'
                    }`}>
                      {hasVoted && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="font-medium">{option.trim()}</span>
                  </div>
                  {/* No vote counts or percentages shown - keeping votes secret */}
                </div>
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-center text-sm">
        {hasVoted ? (
          <span className="text-green-600 font-medium">✅ Your vote has been recorded secretly. Thank you!</span>
        ) : (
          <span className="text-gray-500">Click an option to cast your secret vote</span>
        )}
      </div>
    </div>
  );
};

// Simple Image component for published posts (no editing capabilities)
const SimpleImage: React.FC<{ 
  src: string; 
  alt: string; 
  caption?: string;
  width?: 'normal' | 'wide' | 'full';
  posts: BlogPost[];
  selectedPost?: BlogPost | null;
}> = ({ src, alt, caption, width = 'normal', posts, selectedPost }) => {
  // Resolve image source for published posts
  let actualSrc = src;
  
  console.log('🖼️ SimpleImage processing:', { 
    src: src.substring(0, 50) + (src.length > 50 ? '...' : ''),
    isDataUrl: src.startsWith('data:'),
    selectedPost: selectedPost?.title
  });

  if (src.startsWith('data:image/')) {
    // Direct data URL - use it as is
    actualSrc = src;
    console.log('✅ Using direct data URL');
  } else if (!src.startsWith('http') && !src.startsWith('/')) {
    // Short filename - try to resolve it from uploaded files
    console.log('🔍 Resolving short filename:', src);
    
    if (selectedPost?.uploadedFiles) {
      console.log('🔍 Checking selectedPost uploadedFiles:', selectedPost.uploadedFiles.length, 'files');
      selectedPost.uploadedFiles.forEach((file, index) => {
        console.log(`  File ${index}: name="${file.name}", id="${file.id}", url="${file.url?.substring(0, 50)}..."`);
      });
      
      const uploadedFile = selectedPost.uploadedFiles.find(f => 
        f.name === src || f.id === src || src.includes(f.name) || src.includes(f.id)
      );
      if (uploadedFile?.url) {
        console.log('✅ Found image in selectedPost:', { name: uploadedFile.name });
        actualSrc = uploadedFile.url;
      } else {
        console.log('❌ Image not found in selectedPost uploadedFiles');
      }
    }
    
    // Fallback: search all posts
    if (actualSrc === src) {
      console.log('🔍 Searching all posts for image:', src);
      const matchingPost = posts.find(p => p.content.includes(src));
      if (matchingPost?.uploadedFiles) {
        const uploadedFile = matchingPost.uploadedFiles.find(f => 
          f.name === src || f.id === src || src.includes(f.name) || src.includes(f.id)
        );
        if (uploadedFile?.url) {
          console.log('✅ Found image in matching post:', matchingPost.title);
          actualSrc = uploadedFile.url;
        }
      }
    }
  }

  console.log('🎯 Final SimpleImage resolution:', { 
    original: src, 
    resolved: actualSrc === src ? 'UNCHANGED' : 'RESOLVED',
    isDataUrl: actualSrc.startsWith('data:image/'),
    isResolved: actualSrc !== src
  });

  // Get width classes
  const getWidthClass = () => {
    switch (width) {
      case 'wide': return 'w-4/5 max-w-4xl';
      case 'full': return 'w-full max-w-none';
      default: return 'max-w-2xl';
    }
  };

  return (
    <div className="my-6">
      <div className="flex justify-center">
        <div className={`${getWidthClass()}`}>
          <img 
            src={actualSrc}
            alt={alt}
            className="w-full h-auto rounded-lg shadow-md"
            onLoad={() => console.log('✅ Image loaded successfully:', src)}
            onError={(e) => {
              console.error('❌ Image failed to load:', src, 'actual src:', actualSrc);
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
              target.alt = 'Image not found';
            }}
          />
        </div>
      </div>
      {caption && (
        <p className="text-sm text-gray-600 text-center italic mt-3">{caption}</p>
      )}
    </div>
  );
};

// Title cache for external content
const titleCache = new Map<string, string>();

export const BlogSection: React.FC<BlogSectionProps> = ({ onManageBlog }) => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as LanguageCode];
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [showMorePosts, setShowMorePosts] = useState(false);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [showSubscribers, setShowSubscribers] = useState(false);
  
  // Poll voting state for published posts
  const [pollVotes, setPollVotes] = useState<{[pollId: string]: {[option: string]: number}}>({});
  const [userVotes, setUserVotes] = useState<{[pollId: string]: string}>({});
  
  // Blog management state
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileProgress, setFileProgress] = useState<{[key: string]: number}>({});
  const [insights, setInsights] = useState({ title: '', content: '', emoji: '💡' });
  const [editorMode, setEditorMode] = useState<'markdown' | 'html'>('markdown');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showVideoEmbed, setShowVideoEmbed] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [selectedBlogEndpoint, setSelectedBlogEndpoint] = useState<string>('all');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaRefLt = useRef<HTMLTextAreaElement>(null);
  const textareaRefFr = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track currently active language tab for rich text editing
  const [activeLanguageTab, setActiveLanguageTab] = useState<'en' | 'lt' | 'fr'>('en');
  
  // Undo/Redo history
  const [undoHistory, setUndoHistory] = useState<string[]>([]);
  const [redoHistory, setRedoHistory] = useState<string[]>([]);
  const [lastSavedContent, setLastSavedContent] = useState<string>('');

  // Image editing state
  const [editingImage, setEditingImage] = useState<{
    src: string;
    alt: string;
    caption: string;
    width: 'normal' | 'wide' | 'full';
  } | null>(null);
  const [showImageMenu, setShowImageMenu] = useState<string | null>(null);

  // Helper function to get localized text
  const getLocalizedText = (text: any): string => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    if (typeof text === 'object') {
      return text[currentLanguage as keyof typeof text] || text.en || '';
    }
    return '';
  };

  // Load poll data from localStorage on component mount
  useEffect(() => {
    const savedVotes = JSON.parse(localStorage.getItem('blog-poll-votes') || '{}');
    const savedUserVotes = JSON.parse(localStorage.getItem('blog-user-votes') || '{}');
    setPollVotes(savedVotes);
    setUserVotes(savedUserVotes);
  }, []);

  // Add global functions for image menu interactions and poll voting
  useEffect(() => {
    // Poll voting handler for published posts (SECRET VOTING)
    (window as any).handlePollVote = (pollId: string, option: string) => {
      console.log('📊 Secret poll vote registered:', { pollId, option: '[HIDDEN]' });
      
      // Check if already voted
      const currentUserVotes = JSON.parse(localStorage.getItem('blog-user-votes') || '{}');
      if (currentUserVotes[pollId]) {
        console.log('⚠️ Already voted for this poll - vote not counted');
        return;
      }
      
      // Update votes secretly (vote is recorded but results remain hidden)
      const currentPollVotes = JSON.parse(localStorage.getItem('blog-poll-votes') || '{}');
      currentPollVotes[pollId] = currentPollVotes[pollId] || {};
      currentPollVotes[pollId][option] = (currentPollVotes[pollId][option] || 0) + 1;
      
      currentUserVotes[pollId] = option;
      
      // Save to localStorage (backend storage - votes counted secretly)
      localStorage.setItem('blog-poll-votes', JSON.stringify(currentPollVotes));
      localStorage.setItem('blog-user-votes', JSON.stringify(currentUserVotes));
      
      // Update state (but UI won't show results due to secret voting)
      setPollVotes(currentPollVotes);
      setUserVotes(currentUserVotes);
      
      // Refresh to show "Thank you for voting" message instead of results
      window.location.reload();
    };
    
    // Add global functions to window object for image menu
    (window as any).toggleImageMenu = (imageId: string) => {
      const menu = document.getElementById(`menu-${imageId}`);
      if (menu) {
        menu.classList.toggle('hidden');
        
        // Close other menus
        document.querySelectorAll('[id^="menu-img-"]').forEach(otherMenu => {
          if (otherMenu !== menu) {
            otherMenu.classList.add('hidden');
          }
        });
      }
    };

    (window as any).editImage = (src: string, alt: string, caption: string, width: string) => {
      setEditingImage({ src, alt, caption, width: width as 'normal' | 'wide' | 'full' });
      setShowImageMenu(null);
      
      // Hide all menus
      document.querySelectorAll('[id^="menu-img-"]').forEach(menu => {
        menu.classList.add('hidden');
      });
    };

    (window as any).editCaption = (src: string, alt: string) => {
      const newCaption = prompt('Enter new caption:', '');
      if (newCaption !== null) {
        handleImageUpdate(src, alt, newCaption, 'normal');
      }
      
      // Hide all menus
      document.querySelectorAll('[id^="menu-img-"]').forEach(menu => {
        menu.classList.add('hidden');
      });
    };

    (window as any).editAltText = (src: string, alt: string) => {
      const newAlt = prompt('Enter new alt text:', alt);
      if (newAlt !== null) {
        handleImageUpdate(src, newAlt, '', 'normal');
      }
      
      // Hide all menus
      document.querySelectorAll('[id^="menu-img-"]').forEach(menu => {
        menu.classList.add('hidden');
      });
    };

    (window as any).setImageWidth = (src: string, alt: string, width: string) => {
      handleImageUpdate(src, alt, '', width as 'normal' | 'wide' | 'full');
      
      // Hide all menus
      document.querySelectorAll('[id^="menu-img-"]').forEach(menu => {
        menu.classList.add('hidden');
      });
    };

    (window as any).deleteImage = (src: string, alt: string) => {
      if (confirm('Are you sure you want to delete this image?')) {
        handleImageDelete(src, alt);
      }
      
      // Hide all menus
      document.querySelectorAll('[id^="menu-img-"]').forEach(menu => {
        menu.classList.add('hidden');
      });
    };

    // Clean up on unmount
    return () => {
      delete (window as any).toggleImageMenu;
      delete (window as any).editImage;
      delete (window as any).editCaption;
      delete (window as any).editAltText;
      delete (window as any).setImageWidth;
      delete (window as any).deleteImage;
    };
  }, [activeLanguageTab, currentPost]);

  // Close image menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[id^="menu-img-"]') && !target.closest('button[onclick*="toggleImageMenu"]')) {
        document.querySelectorAll('[id^="menu-img-"]').forEach(menu => {
          menu.classList.add('hidden');
        });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Helper function to safely get form field value
  const getFormFieldValue = (field: any, lang: 'en' | 'lt' | 'fr'): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'object') return field[lang] || '';
    return '';
  };

  // Helper function to safely update form field
  const updateFormField = (currentValue: any, lang: 'en' | 'lt' | 'fr', newValue: string) => {
    if (typeof currentValue === 'string') {
      // Convert string to LocalizedText object
      const base = { en: currentValue, lt: currentValue, fr: currentValue };
      return { ...base, [lang]: newValue };
    }
    if (typeof currentValue === 'object') {
      return { ...currentValue, [lang]: newValue };
    }
    // Fallback: create new LocalizedText object
    const fallback = { en: '', lt: '', fr: '' };
    return { ...fallback, [lang]: newValue };
  };

  // Helper function to safely update post field
  const updatePostField = (post: BlogPost, fieldName: string, lang: 'en' | 'lt' | 'fr', newValue: string) => {
    const currentField = (post as any)[fieldName];
    const updatedField = updateFormField(currentField, lang, newValue);
    return {
      ...post,
      [fieldName]: updatedField
    };
  };

  // Blog endpoints/destinations
  const blogEndpoints = {
    'molecule-to-machine': {
      name: 'Molecule To Machine',
      description: 'Chemistry meets AI and technology',
      url: 'https://moleculetomachine.substack.com/'
    },
    'grace-to-life': {
      name: 'From Grace To Life',
      description: 'Personal reflections and life stories',
      url: 'https://fromgracetolife.substack.com/'
    },
    'transcend-loneliness': {
      name: 'Transcend Loneliness',
      description: 'Overcoming isolation and building connections',
      url: 'https://transcendloneliness.substack.com/'
    },
    'other-story-time': {
      name: 'Other Story Time',
      description: 'Creative stories and narratives',
      url: 'https://otherstorytime.substack.com/'
    }
  };

  // Password management for authentication
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [authAttempts, setAuthAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

  // Load posts from localStorage on component mount
  useEffect(() => {
    const loadSavedPosts = (): BlogPost[] => {
      try {
        const savedPosts = localStorage.getItem('blogPosts');
        if (savedPosts) {
          const parsed = JSON.parse(savedPosts);
          if (Array.isArray(parsed)) {
            // Migration: convert old post structure to new LocalizedText format
            const migratedPosts = parsed.map(post => {
              const migrateField = (field: any) => {
                if (!field) return { en: '', lt: '', fr: '' };
                if (typeof field === 'string') {
                  return { en: field, lt: field, fr: field };
                }
                if (typeof field === 'object' && field.en !== undefined) {
                  return {
                    en: field.en || '',
                    lt: field.lt || '',
                    fr: field.fr || ''
                  };
                }
                return { en: '', lt: '', fr: '' };
              };

              return {
                ...post,
                title: migrateField(post.title),
                content: migrateField(post.content),
                excerpt: migrateField(post.excerpt),
                author: migrateField(post.author),
                readTime: migrateField(post.readTime),
                published: post.published !== undefined ? post.published : true,
                publishedAt: post.publishedAt || post.date || new Date().toISOString(),
                category: post.category || 'molecule-to-machine',
                tags: Array.isArray(post.tags) ? post.tags : []
              };
            });
            
            // Save the migrated posts back to localStorage
            localStorage.setItem('blogPosts', JSON.stringify(migratedPosts));
            return migratedPosts;
          }
        }
      } catch (error) {
        console.error('Error loading saved posts:', error);
      }
      
      const samplePosts = loadSamplePosts();
      localStorage.setItem('blogPosts', JSON.stringify(samplePosts));
      return samplePosts;
    };

    setPosts(loadSavedPosts());
  }, []);

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('blogPosts', JSON.stringify(posts));
    }
  }, [posts]);
  
  // Initialize undo history when switching posts or language tabs
  useEffect(() => {
    if (currentPost) {
      const currentContent = getFormFieldValue(currentPost.content, activeLanguageTab);
      setLastSavedContent(currentContent);
      setUndoHistory([]);
      setRedoHistory([]);
    }
  }, [currentPost, activeLanguageTab]);

  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('blogAuthStatus');
      const authTime = localStorage.getItem('blogAuthTime');
      const attempts = localStorage.getItem('authAttempts');
      const blockTime = localStorage.getItem('blockTime');
      
      setAuthAttempts(attempts ? parseInt(attempts) : 0);
      
      if (blockTime) {
        const blockUntil = parseInt(blockTime);
        const now = Date.now();
        if (now < blockUntil) {
          setIsBlocked(true);
          setBlockTimeRemaining(Math.ceil((blockUntil - now) / 1000));
          return;
        } else {
          localStorage.removeItem('blockTime');
          localStorage.removeItem('authAttempts');
          setAuthAttempts(0);
        }
      }
      
      if (authStatus === 'authenticated' && authTime) {
        const authTimestamp = parseInt(authTime);
        const now = Date.now();
        const fourHours = 4 * 60 * 60 * 1000;
        
        if (now - authTimestamp < fourHours) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('blogAuthStatus');
          localStorage.removeItem('blogAuthTime');
        }
      }
    };

    checkAuth();
  }, []);

  // Block countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBlocked && blockTimeRemaining > 0) {
      interval = setInterval(() => {
        setBlockTimeRemaining(prev => {
          if (prev <= 1) {
            setIsBlocked(false);
            localStorage.removeItem('blockTime');
            localStorage.removeItem('authAttempts');
            setAuthAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBlocked, blockTimeRemaining]);

  const handleAuthentication = (inputPassword: string) => {
    if (isBlocked) return;

    const correctPassword = 'aurimas@89!13*96';
    
    if (inputPassword === correctPassword) {
      setIsAuthenticated(true);
      setShowPasswordInput(false);
      setPassword('');
      localStorage.setItem('blogAuthStatus', 'authenticated');
      localStorage.setItem('blogAuthTime', Date.now().toString());
      localStorage.removeItem('authAttempts');
      localStorage.removeItem('blockTime');
      setAuthAttempts(0);
    } else {
      const newAttempts = authAttempts + 1;
      setAuthAttempts(newAttempts);
      localStorage.setItem('authAttempts', newAttempts.toString());
      
      if (newAttempts >= 3) {
        const blockUntil = Date.now() + (15 * 60 * 1000); // 15 minutes
        localStorage.setItem('blockTime', blockUntil.toString());
        setIsBlocked(true);
        setBlockTimeRemaining(15 * 60);
      }
      
      setPassword('');
      alert((t as any).incorrectPassword || 'Incorrect password');
    }
  };

  const handleClearAllPosts = () => {
    if (confirm('Are you sure you want to clear all blog posts? This action cannot be undone.')) {
      localStorage.removeItem('blogPosts');
      setPosts([]);
      setCurrentPost(null);
      setShowCreateForm(false);
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowPasswordInput(false);
    setCurrentPost(null);
    setIsEditing(false);
    setShowCreateForm(false);
    localStorage.removeItem('blogAuthStatus');
    localStorage.removeItem('blogAuthTime');
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setNewsletterStatus('loading');
    try {
      await subscribeToNewsletter(newsletterEmail);
      setNewsletterStatus('success');
      setNewsletterMessage((t as any).newsletterSuccess || 'Successfully subscribed!');
      setNewsletterEmail('');
      setTimeout(() => {
        setNewsletterStatus('idle');
        setNewsletterMessage('');
      }, 3000);
    } catch (error) {
      setNewsletterStatus('error');
      setNewsletterMessage((t as any).newsletterError || 'Subscription failed. Please try again.');
      setTimeout(() => {
        setNewsletterStatus('idle');
        setNewsletterMessage('');
      }, 3000);
    }
  };

  // Load subscribers
  const loadSubscribers = async () => {
    try {
      const subscriberList = await getNewsletterSubscribers();
      setSubscribers(subscriberList);
    } catch (error) {
      console.error('Error loading subscribers:', error);
    }
  };

  // Load subscribers when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadSubscribers();
    }
  }, [isAuthenticated]);

  const handleCreatePost = () => {
    const selectedEndpoint = selectedBlogEndpoint === 'all' ? 'molecule-to-machine' : selectedBlogEndpoint;
    const newPost: BlogPost = {
      id: uuidv4(),
      title: { en: '', lt: '', fr: '' },
      content: { en: '', lt: '', fr: '' },
      excerpt: { en: '', lt: '', fr: '' },
      category: selectedEndpoint as 'molecule-to-machine' | 'grace-to-life' | 'transcend-loneliness' | 'other-story-time',
      date: new Date().toISOString().split('T')[0],
      publishedAt: new Date().toISOString(),
      author: { en: 'Aurimas', lt: 'Aurimas', fr: 'Aurimas' },
      readTime: { en: '5 min read', lt: '5 min skaitymas', fr: '5 min de lecture' },
      tags: [],
      featuredImage: undefined,
      published: true, // Make posts published by default so they show in the preview
      blogEndpoint: selectedEndpoint,
      destinationUrl: blogEndpoints[selectedEndpoint as keyof typeof blogEndpoints]?.url || 'https://moleculetomachine.substack.com/'
    };
    setCurrentPost(newPost);
    setIsEditing(true);
    setShowCreateForm(true);
    setActiveLanguageTab('en'); // Start with English tab
  };

  const handleSavePost = () => {
    if (!currentPost) return;

    // Ensure the post has a publish timestamp
    const postToSave = {
      ...currentPost,
      publishedAt: currentPost.publishedAt || new Date().toISOString(),
      date: currentPost.date || new Date().toISOString().split('T')[0]
    };

    const updatedPosts = postToSave.id && posts.find(p => p.id === postToSave.id)
      ? posts.map(p => p.id === postToSave.id ? postToSave : p)
      : [...posts, postToSave];

    setPosts(updatedPosts);
    
    // Force localStorage update
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    
    // Don't reset editing state - stay in edit mode
    // Show success message instead
    alert('✅ Post saved successfully! You can continue editing or close the editor.');
  };

  const handleDeletePost = (postId: string) => {
    if (confirm((t as any).confirmDelete || 'Are you sure you want to delete this post?')) {
      setPosts(posts.filter(p => p.id !== postId));
      if (selectedPost?.id === postId) {
        setSelectedPost(null);
      }
      if (currentPost?.id === postId) {
        setCurrentPost(null);
        setIsEditing(false);
        setShowCreateForm(false);
      }
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
    setShowCreateForm(true);
  };

  // Rich text editing functions
  const insertTextAtCursor = (text: string) => {
    if (!currentPost) return;
    
    // Get the appropriate textarea ref based on active language tab
    const textarea = activeLanguageTab === 'en' ? textareaRef.current :
                    activeLanguageTab === 'lt' ? textareaRefLt.current :
                    textareaRefFr.current;
    
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = getFormFieldValue(currentPost.content, activeLanguageTab);
    
    const newContent = currentContent.substring(0, start) + text + currentContent.substring(end);
    setCurrentPost(updatePostField(currentPost, 'content', activeLanguageTab, newContent));
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const wrapSelectedText = (prefix: string, suffix: string = '') => {
    if (!currentPost) return;
    
    // Get the appropriate textarea ref based on active language tab
    const textarea = activeLanguageTab === 'en' ? textareaRef.current :
                    activeLanguageTab === 'lt' ? textareaRefLt.current :
                    textareaRefFr.current;
    
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const replacement = prefix + selectedText + suffix;
    
    insertTextAtCursor(replacement);
  };

  const insertBold = () => {
    saveToHistory();
    wrapSelectedText('**', '**');
  };
  
  const insertItalic = () => {
    saveToHistory();
    wrapSelectedText('*', '*');
  };
  
  const insertUnderline = () => {
    saveToHistory();
    wrapSelectedText('<u>', '</u>');
  };
  
  const insertCode = () => {
    saveToHistory();
    wrapSelectedText('`', '`');
  };
  
  const insertCodeBlock = () => {
    saveToHistory();
    wrapSelectedText('\n```\n', '\n```\n');
  };
  
  const insertLink = () => {
    if (!currentPost) return;
    
    saveToHistory();
    
    // Get the appropriate textarea ref based on active language tab
    const textarea = activeLanguageTab === 'en' ? textareaRef.current :
                    activeLanguageTab === 'lt' ? textareaRefLt.current :
                    textareaRefFr.current;
    
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    const linkText = selectedText || prompt('Enter link text:') || 'Link';
    const linkUrl = prompt('Enter URL:') || '';
    
    if (linkUrl) {
      const linkMarkdown = `[${linkText}](${linkUrl})`;
      insertTextAtCursor(linkMarkdown);
    }
  };

  const insertHeading = (level: number) => {
    saveToHistory();
    const prefix = '#'.repeat(level) + ' ';
    insertTextAtCursor('\n' + prefix);
  };

  const insertList = (ordered: boolean = false) => {
    const prefix = ordered ? '1. ' : '- ';
    insertTextAtCursor('\n' + prefix);
  };

  const insertNestedList = () => {
    saveToHistory();
    insertTextAtCursor('\n  ○ '); // Two spaces + open circle for nested list
  };

  // Alignment functions
  const insertAlignment = (alignment: 'left' | 'center' | 'right' | 'justify') => {
    if (!currentPost) return;
    
    saveToHistory();
    
    // Get the appropriate textarea ref based on active language tab
    const textarea = activeLanguageTab === 'en' ? textareaRef.current :
                    activeLanguageTab === 'lt' ? textareaRefLt.current :
                    textareaRefFr.current;
    
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (selectedText) {
      // Wrap selected text with alignment div
      const alignedText = `<div style="text-align: ${alignment};">${selectedText}</div>`;
      insertTextAtCursor(alignedText);
    } else {
      // Insert alignment placeholder
      const alignedText = `<div style="text-align: ${alignment};">Your text here</div>`;
      insertTextAtCursor(alignedText);
    }
  };

  const insertLeftAlign = () => insertAlignment('left');
  const insertCenterAlign = () => insertAlignment('center');
  const insertRightAlign = () => insertAlignment('right');
  const insertJustifyAlign = () => insertAlignment('justify');

  const insertImage = () => {
    if (!imageUrl.trim()) return;
    
    saveToHistory();
    
    let altText = 'image';
    let actualImageData = imageUrl.trim();
    let displayImageData = actualImageData;
    
    // Handle different types of image URLs
    if (actualImageData.startsWith('data:')) {
      altText = 'uploaded-image';
      // Create a shorter display version for base64 images
      const mimeMatch = actualImageData.match(/data:([^;]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const extension = mimeType.split('/')[1] || 'jpg';
      // Create a unique short identifier for the image
      const timestamp = Date.now();
      const shortId = Math.random().toString(36).substring(2, 8);
      const shortName = `image-${timestamp}-${shortId}.${extension}`;
      
      // Store the full base64 data with the short name as key for retrieval
      const imageStore = JSON.parse(localStorage.getItem('blogImages') || '{}');
      imageStore[shortName] = actualImageData;
      localStorage.setItem('blogImages', JSON.stringify(imageStore));
      
      // Use the short name in markdown but store reference to full data
      displayImageData = shortName;
    } else if (actualImageData.includes('/')) {
      // Extract filename for alt text
      const urlParts = actualImageData.split('/');
      const filename = urlParts[urlParts.length - 1];
      altText = filename.split('.')[0] || 'image';
    }
    
    const finalAltText = prompt('Enter image description/alt text:', altText) || altText;
    
    // For base64 images, use the short name in markdown but ensure the actual data is available
    let imageMarkdown;
    if (actualImageData.startsWith('data:')) {
      // Use a special format that includes both short name and full data
      imageMarkdown = `![${finalAltText}](${displayImageData})<!-- FULL_DATA:${actualImageData} -->`;
    } else {
      imageMarkdown = `![${finalAltText}](${actualImageData})`;
    }
    
    insertTextAtCursor(imageMarkdown);
    
    // Clean up
    setImageUrl('');
    setShowImageUpload(false);
  };

  const insertVideo = () => {
    if (!videoUrl.trim()) return;
    
    let embedCode = '';
    
    // YouTube
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      let videoId = '';
      
      if (videoUrl.includes('youtu.be/')) {
        // Handle youtu.be short links
        videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0] || '';
      } else if (videoUrl.includes('youtube.com/watch?v=')) {
        // Handle regular YouTube watch links
        videoId = videoUrl.split('v=')[1]?.split('&')[0] || '';
      } else if (videoUrl.includes('youtube.com/embed/')) {
        // Handle embed links
        videoId = videoUrl.split('embed/')[1]?.split('?')[0] || '';
      }
      
      if (videoId) {
        embedCode = `<div style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%; margin: 20px 0;">
  <iframe 
    src="https://www.youtube.com/embed/${videoId}" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 8px;" 
    frameborder="0" 
    allowfullscreen
    title="YouTube video">
  </iframe>
</div>`;
      }
    }
    // Spotify
    else if (videoUrl.includes('spotify.com')) {
      let spotifyType = 'track';
      let spotifyId = '';
      let height = '152';
      
      // Determine Spotify content type
      if (videoUrl.includes('/track/')) {
        spotifyType = 'track';
        spotifyId = videoUrl.split('/track/')[1]?.split('?')[0] || '';
        height = '152';
      } else if (videoUrl.includes('/album/')) {
        spotifyType = 'album';
        spotifyId = videoUrl.split('/album/')[1]?.split('?')[0] || '';
        height = '352';
      } else if (videoUrl.includes('/playlist/')) {
        spotifyType = 'playlist';
        spotifyId = videoUrl.split('/playlist/')[1]?.split('?')[0] || '';
        height = '352';
      } else if (videoUrl.includes('/artist/')) {
        spotifyType = 'artist';
        spotifyId = videoUrl.split('/artist/')[1]?.split('?')[0] || '';
        height = '352';
      } else if (videoUrl.includes('/episode/')) {
        spotifyType = 'episode';
        spotifyId = videoUrl.split('/episode/')[1]?.split('?')[0] || '';
        height = '232';
      } else if (videoUrl.includes('/show/')) {
        spotifyType = 'show';
        spotifyId = videoUrl.split('/show/')[1]?.split('?')[0] || '';
        height = '232';
      }
      
      if (spotifyId) {
        embedCode = `<div style="margin: 20px 0;">
  <iframe 
    src="https://open.spotify.com/embed/${spotifyType}/${spotifyId}?utm_source=generator" 
    width="100%" 
    height="${height}" 
    frameborder="0" 
    allowfullscreen="" 
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
    loading="lazy"
    style="border-radius: 12px;"
    title="Spotify ${spotifyType}">
  </iframe>
</div>`;
      }
    }
    
    if (embedCode) {
      insertTextAtCursor('\n' + embedCode + '\n');
      setVideoUrl('');
      setShowVideoEmbed(false);
    } else {
      alert('Invalid URL. Please use YouTube video links or Spotify track/album/playlist/artist/podcast links.');
    }
  };

  // Image editing functions
  const handleImageEdit = (src: string, alt: string, caption: string, width: 'normal' | 'wide' | 'full') => {
    setEditingImage({ src, alt, caption, width });
  };

  const handleImageUpdate = (newSrc: string, newAlt: string, newCaption: string, newWidth: 'normal' | 'wide' | 'full') => {
    if (!currentPost || !editingImage) return;

    const currentContent = getFormFieldValue(currentPost.content, activeLanguageTab);
    
    // Find the original image pattern in the content
    // Look for both short name patterns and full data patterns
    let foundPattern = '';
    let oldImagePattern = '';
    
    // First try to find a pattern with the full data (what we received in editingImage.src)
    const fullDataPattern = `![${editingImage.alt}](${editingImage.src})${editingImage.width !== 'normal' ? `{width=${editingImage.width}}` : ''}`;
    if (currentContent.includes(fullDataPattern)) {
      foundPattern = fullDataPattern;
    } else {
      // Try to find a pattern with short name and comment
      const commentPattern = new RegExp(`!\\[${editingImage.alt}\\]\\(([^)]+)\\)(?:\\{[^}]*\\})?(?:<!--\\s*FULL_DATA:${editingImage.src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*-->)?`, 'g');
      const match = commentPattern.exec(currentContent);
      if (match) {
        foundPattern = match[0];
      }
    }
    
    if (!foundPattern) {
      console.warn('Could not find image pattern to replace');
      return;
    }
    
    // Create the new pattern
    let newImagePattern = '';
    if (newSrc.startsWith('data:')) {
      // For base64 images, use the short name format
      const imageStore = JSON.parse(localStorage.getItem('blogImages') || '{}');
      let shortName = '';
      
      // Find existing short name or create new one
      for (const [name, data] of Object.entries(imageStore)) {
        if (data === newSrc) {
          shortName = name;
          break;
        }
      }
      
      if (!shortName) {
        // Create new short name
        const mimeMatch = newSrc.match(/data:([^;]+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const extension = mimeType.split('/')[1] || 'jpg';
        const timestamp = Date.now();
        const shortId = Math.random().toString(36).substring(2, 8);
        shortName = `image-${timestamp}-${shortId}.${extension}`;
        
        imageStore[shortName] = newSrc;
        localStorage.setItem('blogImages', JSON.stringify(imageStore));
      }
      
      newImagePattern = `![${newAlt}](${shortName})${newWidth !== 'normal' ? `{width=${newWidth}}` : ''}<!-- FULL_DATA:${newSrc} -->`;
    } else {
      newImagePattern = `![${newAlt}](${newSrc})${newWidth !== 'normal' ? `{width=${newWidth}}` : ''}`;
    }
    
    let updatedContent = currentContent.replace(foundPattern, newImagePattern);
    
    // Handle caption updates
    if (editingImage.caption) {
      const oldCaptionPattern = `*${editingImage.caption}*`;
      const newCaptionPattern = newCaption ? `*${newCaption}*` : '';
      updatedContent = updatedContent.replace(oldCaptionPattern, newCaptionPattern);
    } else if (newCaption) {
      // Add new caption after the image
      updatedContent = updatedContent.replace(newImagePattern, `${newImagePattern}\n*${newCaption}*`);
    }

    setCurrentPost({
      ...currentPost,
      content: {
        ...(typeof currentPost.content === 'object' ? currentPost.content : {}),
        [activeLanguageTab]: updatedContent
      }
    });

    setEditingImage(null);
  };

  const handleImageDelete = (src: string, alt: string) => {
    if (!currentPost) return;

    const currentContent = getFormFieldValue(currentPost.content, activeLanguageTab);
    
    // Look for both short name patterns and full data patterns
    let updatedContent = currentContent;
    
    // Try to find a pattern with the full data
    const fullDataPattern = `![${alt}](${src})(?:\\{[^}]*\\})?`;
    if (updatedContent.includes(`![${alt}](${src})`)) {
      const imageRegex = new RegExp(`!\\[${alt}\\]\\(${src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)(?:\\{[^}]*\\})?(?:\\s*\\*[^*]*\\*)?`, 'g');
      updatedContent = updatedContent.replace(imageRegex, '');
    } else {
      // Try to find a pattern with short name and comment containing the full data
      const commentRegex = new RegExp(`!\\[[^\\]]*\\]\\([^)]+\\)(?:\\{[^}]*\\})?<!--\\s*FULL_DATA:${src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*-->(?:\\s*\\*[^*]*\\*)?`, 'g');
      updatedContent = updatedContent.replace(commentRegex, '');
    }

    setCurrentPost({
      ...currentPost,
      content: {
        ...(typeof currentPost.content === 'object' ? currentPost.content : {}),
        [activeLanguageTab]: updatedContent
      }
    });

    setShowImageMenu(null);
  };

  // Custom image renderer for preview with editing capabilities
  const renderImageWithMenu = (src: string, alt: string, attributes?: string, fullData?: string) => {
    // Resolve the actual image source
    let actualSrc = src;
    
    // Check if this is a short name reference to stored base64 data
    if (!src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('/')) {
      console.log('🔍 BlogSection resolving image:', src);
      
      // Method 1: Check 'blog-files' localStorage (matches BlogManager)
      try {
        const blogFiles = JSON.parse(localStorage.getItem('blog-files') || '{}');
        if (blogFiles[src]) {
          actualSrc = blogFiles[src];
          console.log('✅ BlogSection resolved from blog-files:', src);
        } else {
          console.log('❌ Not found in blog-files, checking blogImages');
          
          // Method 2: Check legacy 'blogImages' localStorage
          const imageStore = JSON.parse(localStorage.getItem('blogImages') || '{}');
          if (imageStore[src]) {
            actualSrc = imageStore[src];
            console.log('✅ BlogSection resolved from blogImages:', src);
          } else {
            console.log('❌ Not found in blogImages either');
          }
        }
      } catch (error) {
        console.error('❌ Error accessing localStorage:', error);
      }
    }
    
    // Use fullData if provided (from markdown comment)
    if (fullData && fullData.startsWith('data:')) {
      actualSrc = fullData;
      console.log('✅ BlogSection using fullData');
    }
    
    const imageId = `img-${src.replace(/[^a-zA-Z0-9]/g, '-')}`;
    const width = attributes?.includes('width=wide') ? 'wide' : 
                 attributes?.includes('width=full') ? 'full' : 'normal';
    
    const imageClasses = 
      width === 'wide' ? 'w-4/5 max-w-4xl' :
      width === 'full' ? 'w-full max-w-none' :
      'max-w-2xl';

    return `
      <div class="relative group my-8 flex flex-col items-center" id="${imageId}">
        <div class="relative">
          <img
            src="${actualSrc}"
            alt="${alt}"
            class="${imageClasses} h-auto rounded-lg shadow-lg"
          />
          <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button 
              onclick="toggleImageMenu('${imageId}')"
              class="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
              title="Edit image"
            >
              <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
              </svg>
            </button>
            <div id="menu-${imageId}" class="hidden absolute top-10 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-48 z-50">
              <button onclick="editImage('${actualSrc}', '${alt}', '', '${width}')" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit picture
              </button>
              <button onclick="editCaption('${actualSrc}', '${alt}')" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                </svg>
                Edit caption
              </button>
              <button onclick="editAltText('${actualSrc}', '${alt}')" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012 2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                </svg>
                Edit alt text
              </button>
              <hr class="my-1">
              <button onclick="setImageWidth('${actualSrc}', '${alt}', 'normal')" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${width === 'normal' ? 'bg-blue-50 text-blue-700' : ''}">
                Normal width
              </button>
              <button onclick="setImageWidth('${actualSrc}', '${alt}', 'wide')" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${width === 'wide' ? 'bg-blue-50 text-blue-700' : ''}">
                Wide width
              </button>
              <button onclick="setImageWidth('${actualSrc}', '${alt}', 'full')" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${width === 'full' ? 'bg-blue-50 text-blue-700' : ''}">
                Full width
              </button>
              <hr class="my-1">
              <button onclick="deleteImage('${actualSrc}', '${alt}')" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Delete image
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // Optimized markdown to HTML converter - non-blocking for better performance
  const markdownToHtml = (markdown: string, isPreview: boolean = false): string => {
    if (!markdown) return '';
    
    // Always use full converter if there are iframes present (YouTube/Spotify embeds)
    // Check for both actual iframe tags and div containers that might contain iframes
    if (markdown.includes('<iframe') || markdown.includes('youtube.com') || markdown.includes('spotify.com')) {
      return fullMarkdownToHtml(markdown, isPreview);
    }
    
    // For simple cases, use a fast path
    if (markdown.length < 1000 && !markdown.includes('![') && !markdown.includes('<div')) {
      return simpleMarkdownToHtml(markdown, isPreview);
    }
    
    // For complex cases, use the full converter but optimized
    return fullMarkdownToHtml(markdown, isPreview);
  };

  // Fast path for simple markdown
  const simpleMarkdownToHtml = (markdown: string, isPreview: boolean = false): string => {
    let html = markdown;
    
    // Preserve any existing iframe content and div containers first
    const iframeRegex = /<iframe[^>]*>.*?<\/iframe>/gis;
    const divWithIframeRegex = /<div[^>]*>[\s\S]*?<iframe[^>]*>[\s\S]*?<\/iframe>[\s\S]*?<\/div>/gis;
    const allEmbeds: string[] = [];
    const embedPlaceholders: string[] = [];
    
    // Extract and preserve div containers with iframes first
    html = html.replace(divWithIframeRegex, (match) => {
      const placeholder = `__EMBED_PLACEHOLDER_${allEmbeds.length}__`;
      allEmbeds.push(match);
      embedPlaceholders.push(placeholder);
      return placeholder;
    });
    
    // Extract and preserve standalone iframes
    html = html.replace(iframeRegex, (match) => {
      const placeholder = `__EMBED_PLACEHOLDER_${allEmbeds.length}__`;
      allEmbeds.push(match);
      embedPlaceholders.push(placeholder);
      return placeholder;
    });
    
    // Basic conversions only
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/^# (.*$)/gm, '<h1 style="font-size: 1.875rem; font-weight: 800; margin: 20px 0;">$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2 style="font-size: 1.5rem; font-weight: 700; margin: 15px 0;">$1</h2>');
    html = html.replace(/^### (.*$)/gm, '<h3 style="font-size: 1.25rem; font-weight: 600; margin: 10px 0;">$1</h3>');
    html = html.replace(/\n/g, '<br>');
    
    // Restore preserved embeds with styling
    embedPlaceholders.forEach((placeholder, index) => {
      if (allEmbeds[index]) {
        const embed = allEmbeds[index];
        const isAlreadyWrapped = embed.includes('style=') && embed.includes('margin');
        if (!isAlreadyWrapped) {
          const styledEmbed = `<div style="margin: 20px 0; text-align: center; max-width: 100%; width: 100%;">
            ${embed.replace(/width="[^"]*"/g, 'width="100%"').replace(/height="[^"]*"/g, 'height="500"')}
          </div>`;
          html = html.replace(placeholder, styledEmbed);
        } else {
          html = html.replace(placeholder, embed);
        }
      }
    });
    
    return html;
  };

  // Full converter for complex markdown - optimized
  const fullMarkdownToHtml = (markdown: string, isPreview: boolean = false): string => {
    let html = markdown;
    
    // FIRST: Preserve existing iframe content AND div containers (YouTube, Spotify embeds)
    // This is crucial - we need to preserve iframe HTML and div containers that's already in the content
    const iframeRegex = /<iframe[^>]*>.*?<\/iframe>/gis;
    const divWithIframeRegex = /<div[^>]*>[\s\S]*?<iframe[^>]*>[\s\S]*?<\/iframe>[\s\S]*?<\/div>/gis;
    const allEmbeds: string[] = [];
    const embedPlaceholders: string[] = [];
    
    // Extract and preserve div containers with iframes first
    html = html.replace(divWithIframeRegex, (match) => {
      const placeholder = `__EMBED_PLACEHOLDER_${allEmbeds.length}__`;
      allEmbeds.push(match);
      embedPlaceholders.push(placeholder);
      return placeholder;
    });
    
    // Extract and preserve standalone iframes
    html = html.replace(iframeRegex, (match) => {
      const placeholder = `__EMBED_PLACEHOLDER_${allEmbeds.length}__`;
      allEmbeds.push(match);
      embedPlaceholders.push(placeholder);
      return placeholder;
    });
    
    // Convert images - handle both regular and base64 with comments - ENHANCED FOR PUBLISHED POSTS
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)(?:\{([^}]*)\})?(?:<!--\s*FULL_DATA:([^>]+)\s*-->)?/g, (match, alt, src, attributes, fullData) => {
      if (isPreview) {
        return renderImageWithMenu(src, alt, attributes, fullData);
      } else {
        // For published posts, resolve the actual image source with AGGRESSIVE resolution
        let actualSrc = src;
        
        console.log('🔍 BlogSection PUBLISHED: Resolving image src:', src);
        
        // Check if this is a short name reference to stored base64 data
        if (!src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('/')) {
          console.log('🔍 Short filename detected, resolving from storage...');
          
          let resolved = false;
          
          // Method 1: Check 'blog-files' localStorage (primary method)
          try {
            const blogFiles = JSON.parse(localStorage.getItem('blog-files') || '{}');
            console.log('📂 Checking blog-files storage, keys:', Object.keys(blogFiles));
            
            if (blogFiles[src]) {
              actualSrc = blogFiles[src];
              resolved = true;
              console.log('✅ RESOLVED from blog-files:', src, '→', actualSrc.substring(0, 50) + '...');
            }
          } catch (error) {
            console.error('❌ Error accessing blog-files:', error);
          }
          
          // Method 2: Check legacy 'blogImages' localStorage (fallback)
          if (!resolved) {
            try {
              const imageStore = JSON.parse(localStorage.getItem('blogImages') || '{}');
              console.log('📂 Checking blogImages storage, keys:', Object.keys(imageStore));
              
              if (imageStore[src]) {
                actualSrc = imageStore[src];
                resolved = true;
                console.log('✅ RESOLVED from blogImages:', src, '→', actualSrc.substring(0, 50) + '...');
              }
            } catch (error) {
              console.error('❌ Error accessing blogImages:', error);
            }
          }
          
          // Method 3: Check if image exists in current post's uploadedFiles
          if (!resolved && window.currentPostData?.uploadedFiles) {
            const fileInfo = window.currentPostData.uploadedFiles.find((f: any) => f.name === src);
            if (fileInfo && fileInfo.url) {
              actualSrc = fileInfo.url;
              resolved = true;
              console.log('✅ RESOLVED from uploadedFiles:', src, '→', actualSrc.substring(0, 50) + '...');
            }
          }
          
          if (!resolved) {
            console.log('❌ Could not resolve image:', src, 'keeping original path');
          }
        }
        
        // Use fullData if provided (from markdown comment) - highest priority
        if (fullData && fullData.startsWith('data:')) {
          actualSrc = fullData;
          console.log('✅ Using FULL_DATA from comment for image:', src);
        }
        
        // Generate responsive image HTML with proper styling
        const imageHtml = `<div style="text-align: center; margin: 20px 0;">
          <img src="${actualSrc}" alt="${alt}" 
               style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); display: block; margin: 0 auto;"
               onload="console.log('✅ Image loaded successfully:', '${src}')"
               onerror="console.error('❌ Image failed to load:', '${src}', 'src:', this.src)"/>
        </div>`;
        
        console.log('🖼️ Generated image HTML for:', src);
        return imageHtml;
      }
    });
    
    // Handle polls - convert [POLL:Question?|Option 1|Option 2|Option 3] to poll placeholders
    html = html.replace(/\[POLL:([^|]+)\|([^|]+(?:\|[^|]+)*)\]/g, (match, question, optionsStr) => {
      const options = optionsStr.split('|').map(opt => opt.trim());
      // Create stable poll ID without random component
      const pollId = `poll-${question.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 20)}`;
      
      console.log('📊 Creating poll placeholder:', { question: question.trim(), options, pollId });
      
      // Return a placeholder that will be replaced with React component later
      return `<div class="poll-placeholder" style="margin: 24px 0; clear: both;" data-poll-id="${pollId}" data-question="${question.trim().replace(/"/g, '&quot;')}" data-options="${options.join('|||')}"></div>`;
    });
    
    // Handle YouTube embeds - [YOUTUBE:URL] format
    html = html.replace(/\[YOUTUBE:([^\]]+)\]/g, (match, url) => {
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0].split('&')[0];
      } else if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1].split('&')[0].split('#')[0];
      }
      
      if (videoId) {
        return `<div style="margin: 20px 0; text-align: center; max-width: 100%; width: 100%;">
          <iframe src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1" 
                  width="100%" 
                  height="500" 
                  style="border-radius: 8px; max-width: 100%; width: 100%;" 
                  frameborder="0" 
                  allowfullscreen 
                  title="YouTube video">
          </iframe>
        </div>`;
      }
      return match;
    });
    
    // Handle Spotify embeds - [SPOTIFY:URL] format
    html = html.replace(/\[SPOTIFY:([^\]]+)\]/g, (match, url) => {
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
        return `<div style="margin: 20px 0; text-align: center; max-width: 100%; width: 100%;">
          <iframe src="https://open.spotify.com/embed/${itemType}/${itemId}" 
                  width="100%" 
                  height="152" 
                  style="border-radius: 12px; max-width: 100%; width: 100%;" 
                  frameborder="0" 
                  allowtransparency="true" 
                  allow="encrypted-media">
          </iframe>
        </div>`;
      }
      return match;
    });
    
    // Basic text formatting
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<u>$1</u>'); // Add underline support
    
    // Preserve HTML div tags and underline tags (for user's custom formatting)
    // Keep div tags as-is since they're already HTML
    // Keep u tags as-is since they're already HTML
    
    // Headers - improved with better spacing after polls and other elements
    html = html.replace(/^# (.*$)/gm, '<h1 style="font-size: 1.875rem; font-weight: 800; margin: 24px 0 16px 0; clear: both;">$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2 style="font-size: 1.5rem; font-weight: 700; margin: 20px 0 12px 0; clear: both;">$1</h2>');
    html = html.replace(/^### (.*$)/gm, '<h3 style="font-size: 1.25rem; font-weight: 600; margin: 16px 0 8px 0; clear: both;">$1</h3>');
    
    // Lists - Substack style with custom bullets (support multiple bullet formats)
    html = html.replace(/^[ ]*[-○•·] (.*)$/gm, '<div style="display: flex; align-items: flex-start; margin-bottom: 8px;"><span style="display: inline-block; width: 8px; height: 8px; background-color: #1f2937; border-radius: 50%; margin-top: 8px; margin-right: 12px; flex-shrink: 0;"></span><span style="color: #374151; line-height: 1.6;">$1</span></div>');
    html = html.replace(/^[ ]{2,}[-○•·] (.*)$/gm, '<div style="display: flex; align-items: flex-start; margin-bottom: 8px; margin-left: 20px;"><span style="display: inline-block; width: 8px; height: 8px; border: 1px solid #1f2937; border-radius: 50%; margin-top: 8px; margin-right: 12px; flex-shrink: 0;"></span><span style="color: #374151; line-height: 1.6;">$1</span></div>');
    
    // Handle indented bullet points with ○ symbol specifically
    html = html.replace(/^  ○ (.*)$/gm, '<div style="display: flex; align-items: flex-start; margin-bottom: 8px; margin-left: 20px;"><span style="color: #2563eb; font-size: 16px; margin-top: 4px; margin-right: 12px; flex-shrink: 0;">○</span><span style="color: #374151; line-height: 1.6;">$1</span></div>');
    
    // Links - BOTH FORMATS SUPPORTED [text](url) and [text|url] - GREEN STYLING
    // Process [Text|URL] format first (pipe separator)
    html = html.replace(/\[([^\]]+)\|([^\]]+)\]/g, (match, linkText, url) => {
      let processedUrl = url.trim();
      if (!processedUrl.startsWith('http')) {
        processedUrl = `https://${processedUrl}`;
      }
      return `<a href="${processedUrl}" target="_blank" rel="noopener noreferrer" style="color: #16a34a; text-decoration: underline; font-weight: 500;">${linkText.trim()}</a>`;
    });
    
    // Process [Text](URL) format second (parentheses format) 
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
      let processedUrl = url.trim();
      if (!processedUrl.startsWith('http')) {
        processedUrl = `https://${processedUrl}`;
      }
      return `<a href="${processedUrl}" target="_blank" rel="noopener noreferrer" style="color: #16a34a; text-decoration: underline; font-weight: 500;">${linkText.trim()}</a>`;
    });
    
    // Handle direct URLs (make them clickable) - GREEN STYLING
    html = html.replace(/(^|[\s])(https?:\/\/[^\s<]+)/g, (match, prefix, url) => {
        return `${prefix}<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #16a34a; text-decoration: underline; font-weight: 500;">${url}</a>`;
    });
    
    // Line breaks (but avoid adding breaks inside embed placeholders)
    html = html.replace(/\n/g, '<br>');
    
    // FINALLY: Restore preserved embeds with proper styling
    embedPlaceholders.forEach((placeholder, index) => {
      if (allEmbeds[index]) {
        const embed = allEmbeds[index];
        // Check if it's already wrapped in a div with styling
        const isAlreadyWrapped = embed.includes('style=') && embed.includes('margin');
        if (!isAlreadyWrapped) {
          // Check if it's a Spotify embed for enhanced sizing
          const isSpotify = embed.includes('spotify.com');
          const isYouTube = embed.includes('youtube.com') || embed.includes('youtu.be');
          
          // Add container styling for better presentation like Substack with responsive sizing
          const styledEmbed = `<div style="margin: 20px 0; text-align: center; max-width: 100%; width: 100%;">
            ${embed
              .replace(/width="[^"]*"/g, 'width="100%"')
              .replace(/height="[^"]*"/g, isSpotify ? 'height="152"' : 'height="500"')
              .replace(/style="[^"]*"/g, isSpotify ? 'style="border-radius: 12px; max-width: 100%; width: 100%;"' : 'style="border-radius: 8px; max-width: 100%; width: 100%;"')
            }
          </div>`;
          html = html.replace(placeholder, styledEmbed);
        } else {
          // Already wrapped, just restore as-is
          html = html.replace(placeholder, embed);
        }
      }
    });
    
    return html;
  };

  // Content renderer component using the same renderLine system as BlogManager
  const ContentRenderer: React.FC<{ 
    content: string; 
    posts: BlogPost[];
    selectedPost?: BlogPost | null;
  }> = ({ content, posts, selectedPost }) => {
    
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

    // Main renderLine function (same as BlogManager but for published posts)
    const renderLine = (line: string, index: number, allLines: string[]) => {
      // Enhanced debug logging for content structure analysis
      if (line.includes('# 5.') || line.includes('[POLL:') || line.includes('# 4.') || line.includes('Bodycam')) {
        console.log(`🔍 PUBLISHED Line ${index}:`, line.substring(0, 100));
      }
      
      if (line.trim() === '') return <br key={index} />;
      
      // Skip caption lines that are already handled by images
      if (line.match(/^\*(.+)\*$/) && index > 0) {
        const prevLine = allLines[index - 1];
        if (prevLine && prevLine.match(/!\[([^\]]*)\]\(([^)]+)\)/)) {
          return null; // Skip this line as it's handled as a caption
        }
      }
      
      // Handle headers with inline markdown support
      if (line.match(/^#+\s+/)) {
        const headerLevel = line.match(/^(#+)\s+/)![1].length;
        const headerText = line.substring(headerLevel + 1);
        const processedText = processInlineMarkdown(headerText);
        
        console.log(`📝 PUBLISHED HEADER at line ${index}: Level ${headerLevel}, Text: "${headerText.substring(0, 50)}"`);
        
        const headerClasses = {
          1: "text-2xl font-bold mb-4 mt-8 clear-both border-t-2 border-gray-200 pt-6",
          2: "text-xl font-semibold mb-3 mt-6 clear-both border-t border-gray-100 pt-4", 
          3: "text-lg font-medium mb-2 mt-4 clear-both"
        };
        
        const className = headerClasses[headerLevel as keyof typeof headerClasses] || headerClasses[3];
        const sectionId = `section-${index}-${headerText.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`;
        
        if (headerLevel === 1) {
          return (
            <div key={`header-section-${index}`} id={sectionId} className="section-boundary">
              <h1 className={className} dangerouslySetInnerHTML={{ __html: processedText }} />
            </div>
          );
        } else if (headerLevel === 2) {
          return (
            <div key={`header-section-${index}`} id={sectionId} className="section-boundary">
              <h2 className={className} dangerouslySetInnerHTML={{ __html: processedText }} />
            </div>
          );
        } else {
          return (
            <div key={`header-section-${index}`} id={sectionId} className="section-boundary">
              <h3 className={className} dangerouslySetInnerHTML={{ __html: processedText }} />
            </div>
          );
        }
      }

      // Handle dividers
      if (line.trim() === '---' || line.trim() === '___') {
        return <hr key={index} className="my-8 border-gray-300" />;
      }

      // Handle polls - [POLL:Question|Option1|Option2|Option3]
      if (line.includes('[POLL:') && line.includes(']')) {
        console.log(`🗳️ PUBLISHED POLL DETECTION at line ${index}:`, line);
        const pollMatch = line.match(/\[POLL:([^|]+)\|([^|]+(?:\|[^|]+)*)\]/);
        if (pollMatch) {
          const [, question, optionsStr] = pollMatch;
          const options = optionsStr.split('|').map(opt => opt.trim());
          
          // Create stable poll ID
          const sectionContext = allLines.slice(Math.max(0, index - 10), index)
            .reverse()
            .find(prevLine => prevLine.match(/^#+\s+/))
            ?.replace(/^#+\s+/, '')
            .substring(0, 10)
            .replace(/[^a-zA-Z0-9]/g, '')
            .toLowerCase() || 'section';
          
          const pollId = `poll-${sectionContext}-${index}-${question.slice(0, 15).replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`;
          
          console.log(`🗳️ PUBLISHED POLL CREATION:`, { 
            index, 
            sectionContext, 
            pollId, 
            question: question.trim(), 
            options
          });
          
          return (
            <div 
              key={`poll-container-${index}`} 
              className="poll-section-simple"
              style={{
                margin: '32px 0',
                padding: '24px',
                backgroundColor: '#f8fafc',
                border: '2px solid #e2e8f0',
                borderRadius: '16px',
                clear: 'both',
                display: 'block',
                width: '100%'
              }}
            >
              <PollComponent
                pollId={pollId}
                question={question.trim()}
                options={options}
              />
              <div style={{
                fontSize: '10px',
                color: '#94a3b8',
                fontFamily: 'monospace',
                textAlign: 'right',
                marginTop: '8px'
              }}>
                📍 Line {index}
              </div>
            </div>
          );
        }
      }

      // Handle code blocks - ```language\ncode\n```
      if (line.startsWith('```')) {
        const language = line.substring(3).trim();
        let codeLines = [];
        let endIndex = index + 1;
        
        // Find the closing ```
        for (let i = index + 1; i < allLines.length; i++) {
          if (allLines[i].trim() === '```') {
            endIndex = i;
            break;
          }
          codeLines.push(allLines[i]);
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
      if (line.trim() !== '```' && isInsideCodeBlock(index, content)) {
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
          <SimpleImage
            key={index}
            src={src}
            alt={alt}
            caption={caption}
            width={width}
            posts={posts}
            selectedPost={selectedPost}
          />
        );
      }
      
      // Handle bold text
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-bold mb-2">{line.slice(2, -2)}</p>;
      }
      
      // Handle bullet points (multiple formats)
      if (line.match(/^\s*[-○•·]\s/)) {
        const match = line.match(/^\s*([-○•·])\s(.+)$/);
        if (match) {
          const [, bulletChar, content] = match;
          const bulletSymbol = bulletChar === '○' ? '○' : 
                              bulletChar === '•' ? '•' : 
                              bulletChar === '·' ? '·' : '•';
          
          return (
            <div key={index} className="flex items-start mb-2 ml-4">
              <span className="text-blue-600 mr-3 flex-shrink-0 mt-1">{bulletSymbol}</span>
              <span dangerouslySetInnerHTML={{ __html: processInlineMarkdown(content) }} />
            </div>
          );
        }
      }
      
      // Handle regular bullet points (dash format)
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
      
      // Handle HTML div tags (like your centered text)
      if (line.includes('<div') && line.includes('</div>')) {
        return (
          <div key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: line }} />
        );
      }
      
      // Handle underline tags
      if (line.includes('<u>') && line.includes('</u>')) {
        return (
          <div key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: line }} />
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

    // Main rendering logic
    try {
      const allLines = content.split('\n');
      console.log(`📊 PUBLISHED CONTENT ANALYSIS: Processing ${allLines.length} lines`);
      
      const renderedLines = allLines.map((line, index) => {
        try {
          const result = renderLine(line, index, allLines);
          
          // Enhanced logging for key rendering results
          if (line.includes('[POLL:') || line.includes('# 5.') || line.includes('# 4.') || line.includes('Bodycam')) {
            console.log(`✅ PUBLISHED RENDER Line ${index}:`, {
              line: line.substring(0, 50),
              result: result ? 'SUCCESS' : 'NULL',
              type: result?.type || 'no type',
              key: result?.key || 'no key'
            });
          }
          return result;
        } catch (error) {
          console.error(`❌ PUBLISHED RENDER ERROR Line ${index}:`, error, line.substring(0, 100));
          return <p key={index} className="text-red-500 bg-red-50 p-2 rounded">Error rendering line {index}: {line.substring(0, 100)}</p>;
        }
      }).filter(element => element !== null && element !== undefined);
      
      console.log(`✅ PUBLISHED FINAL RENDER: ${renderedLines.length} elements from ${allLines.length} lines`);
      
      return (
        <div className="prose prose-lg max-w-none text-gray-700 blog-content leading-relaxed">
          <style jsx>{`
            .section-boundary {
              position: relative;
              isolation: isolate;
              z-index: 1;
            }
            .poll-section-simple {
              display: block !important;
              clear: both !important;
              margin: 32px 0 !important;
              width: 100% !important;
            }
          `}</style>
          {renderedLines}
        </div>
      );
    } catch (error) {
      console.error('❌ PUBLISHED CONTENT PROCESSING ERROR:', error);
      return (
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Content Processing Error</h4>
          <p className="text-sm">{error.message}</p>
          <p className="text-xs mt-2">Check console for details</p>
        </div>
      );
    }
  };

  // Enhanced keyboard event handler with full editing shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const isMetaOrCtrl = e.ctrlKey || e.metaKey;
    
    // Handle different keyboard shortcuts
    if (isMetaOrCtrl) {
      switch (e.key) {
        case 'a':
          // Select all
          e.preventDefault();
          target.select();
          break;
          
        case 'z':
          // Undo
          if (e.shiftKey) {
            // Redo (Ctrl/Cmd + Shift + Z)
            e.preventDefault();
            handleRedo();
          } else {
            // Undo (Ctrl/Cmd + Z)
            e.preventDefault();
            handleUndo();
          }
          break;
          
        case 'y':
          // Redo (Ctrl + Y on Windows)
          e.preventDefault();
          handleRedo();
          break;
          
        case 'v':
          // Paste - detect and auto-convert media URLs
          // Save current state before paste
          saveToHistory();
          setTimeout(() => {
            if (!currentPost) return;
            
            const currentContent = getFormFieldValue(currentPost.content, activeLanguageTab);
            
            // Check if pasted content contains YouTube or Spotify URLs
            const youtubeRegex = /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/g;
            const spotifyRegex = /(https?:\/\/open\.spotify\.com\/(track|album|playlist|artist|episode|show)\/([a-zA-Z0-9]+))/g;
            
            let updatedContent = currentContent;
            let hasChanges = false;
            
            // Auto-convert YouTube URLs to embeds
            updatedContent = updatedContent.replace(youtubeRegex, (match) => {
              hasChanges = true;
              return `![YouTube](${match})`;
            });
            
            // Auto-convert Spotify URLs to embeds  
            updatedContent = updatedContent.replace(spotifyRegex, (match) => {
              hasChanges = true;
              return `![Spotify](${match})`;
            });
            
            if (hasChanges) {
              setCurrentPost(updatePostField(currentPost, 'content', activeLanguageTab, updatedContent));
              // Save the updated content as the new current state
              setTimeout(() => setLastSavedContent(updatedContent), 50);
            }
          }, 100);
          break;
          
        case 'b':
          // Bold
          e.preventDefault();
          insertBold();
          break;
          
        case 'i':
          // Italic
          e.preventDefault();
          insertItalic();
          break;
          
        case 'u':
          // Underline
          e.preventDefault();
          insertUnderline();
          break;
          
        case 'k':
          // Insert link
          e.preventDefault();
          insertLink();
          break;
          
        default:
          break;
      }
    }
    
    // Save to history on significant changes (with debounce)
    if (!isMetaOrCtrl && (e.key === 'Enter' || e.key === ' ' || e.key === 'Backspace' || e.key === 'Delete')) {
      setTimeout(() => saveToHistory(), 500);
    }
  };
  
  // Save current content to undo history
  const saveToHistory = () => {
    if (!currentPost) return;
    
    const currentContent = getFormFieldValue(currentPost.content, activeLanguageTab);
    if (currentContent !== lastSavedContent && currentContent.length > 0) {
      setUndoHistory(prev => {
        const newHistory = [...prev, lastSavedContent];
        return newHistory.slice(-20); // Keep last 20 states
      });
      setRedoHistory([]); // Clear redo history when new content is added
      setLastSavedContent(currentContent);
    }
  };
  
  // Undo function
  const handleUndo = () => {
    if (undoHistory.length === 0 || !currentPost) return;
    
    const currentContent = getFormFieldValue(currentPost.content, activeLanguageTab);
    const previousContent = undoHistory[undoHistory.length - 1];
    
    // Only proceed if there's actually a difference
    if (currentContent === previousContent) return;
    
    setRedoHistory(prev => [currentContent, ...prev.slice(0, 19)]); // Keep last 20 states
    setUndoHistory(prev => prev.slice(0, -1));
    setCurrentPost(updatePostField(currentPost, 'content', activeLanguageTab, previousContent));
    setLastSavedContent(previousContent);
  };
  
  // Redo function
  const handleRedo = () => {
    if (redoHistory.length === 0 || !currentPost) return;
    
    const currentContent = getFormFieldValue(currentPost.content, activeLanguageTab);
    const nextContent = redoHistory[0];
    
    // Only proceed if there's actually a difference
    if (currentContent === nextContent) return;
    
    setUndoHistory(prev => [...prev, currentContent]);
    setRedoHistory(prev => prev.slice(1));
    setCurrentPost(updatePostField(currentPost, 'content', activeLanguageTab, nextContent));
    setLastSavedContent(nextContent);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;
    
    setIsImageUploading(true);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        // Check file size (limit to 2MB to prevent blocking)
        if (file.size > 2 * 1024 * 1024) {
          alert('Image file is too large. Please choose a file smaller than 2MB.');
          setIsImageUploading(false);
          return;
        }
        
        // Create image element for resizing
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            const base64Result = e.target?.result as string;
            
            if (base64Result) {
              img.onload = () => {
                // Calculate new dimensions (max width: 800px, max height: 600px)
                let { width, height } = img;
                const maxWidth = 800;
                const maxHeight = 600;
                
                if (width > maxWidth) {
                  height = (height * maxWidth) / width;
                  width = maxWidth;
                }
                
                if (height > maxHeight) {
                  width = (width * maxHeight) / height;
                  height = maxHeight;
                }
                
                // Set canvas dimensions
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress image
                ctx?.drawImage(img, 0, 0, width, height);
                
                // Convert to compressed base64 (80% quality)
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                
                // Set the compressed image URL
                setImageUrl(compressedDataUrl);
                setShowImageUpload(true);
                setIsImageUploading(false);
              };
              
              img.src = base64Result;
            }
          } catch (error) {
            console.error('Error processing image:', error);
            alert('Error processing image. Please try again.');
            setIsImageUploading(false);
          }
        };
        
        // Handle errors
        reader.onerror = () => {
          alert('Error reading file. Please try again.');
          setIsImageUploading(false);
        };
        
        reader.readAsDataURL(file);
      } else {
        setIsImageUploading(false);
      }
    });
    
    // Clear the input to allow re-uploading the same file
    event.target.value = '';
  };

  const filteredPosts = posts.filter(post => {
    // Filter by category
    const categoryMatch = selectedCategory ? post.category === selectedCategory : true;
    
    // Filter by blog endpoint
    const endpointMatch = selectedBlogEndpoint === 'all' ? true : 
      selectedBlogEndpoint ? post.blogEndpoint === selectedBlogEndpoint : true;
    
    return categoryMatch && endpointMatch;
  });

  // For admins, show all posts (published and unpublished)
  // For regular users, only show published posts
  const postsToShow = isAuthenticated ? filteredPosts : filteredPosts.filter(post => post.published);
  const displayedPosts = showMorePosts ? postsToShow : postsToShow.slice(0, 6);

  // Image menu functions - Add to global scope for HTML onclick handlers
  React.useEffect(() => {
    // Hide menus when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.image-menu') && !target.closest('.image-menu-btn')) {
        document.querySelectorAll('.image-menu').forEach(menu => {
          (menu as HTMLElement).style.display = 'none';
        });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [currentPost, activeLanguageTab, showImageMenu]);

  if (selectedPost) {
    return (
      <section id="blog" className="py-20 bg-gradient-to-br from-lime-25 to-yellow-25">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedPost(null)}
            className="mb-8 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToBlog || 'Back to Blog'}
          </button>

          <article className="bg-white rounded-xl shadow-sm overflow-hidden">
            {selectedPost.featuredImage && (
              <img
                src={selectedPost.featuredImage}
                alt={getLocalizedText(selectedPost.title)}
                className="w-full h-64 object-cover"
              />
            )}
            
            <div className="p-8">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {getLocalizedText(selectedPost.author)}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {selectedPost.date}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {getLocalizedText(selectedPost.readTime)}
                </div>
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                  {blogCategories[selectedPost.category]?.title?.[currentLanguage as LanguageCode] || selectedPost.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {getLocalizedText(selectedPost.title)}
              </h1>

              <ContentRenderer
                content={getLocalizedText(selectedPost.content)}
                posts={posts}
                selectedPost={selectedPost}
              />

              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center flex-wrap gap-2">
                    <Tag className="w-4 h-4 text-gray-500" />
                    {selectedPost.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* Newsletter subscription */}
          <div className="mt-12 bg-white rounded-xl shadow-sm p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t.stayUpdated || 'Stay Updated'}
              </h3>
              <p className="text-gray-600 mb-6">
                {t.newsletterDescription || 'Subscribe to get the latest posts and updates.'}
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder={t.enterEmail || 'Enter your email'}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={newsletterStatus === 'loading'}
                  />
                  <button
                    type="submit"
                    disabled={newsletterStatus === 'loading'}
                    className="px-6 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg hover:from-orange-500 hover:to-red-600 transition-colors disabled:opacity-50"
                  >
                    {newsletterStatus === 'loading' ? (t.subscribing || 'Subscribing...') : (t.subscribe || 'Subscribe')}
                  </button>
                </div>
                
                {newsletterMessage && (
                  <p className={`mt-2 text-sm ${
                    newsletterStatus === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {newsletterMessage}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 bg-gradient-to-br from-lime-25 to-yellow-25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t.blog || 'Blogs'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.blogDescription || 'Thoughts, stories, and insights from my journey in tech and life.'}
          </p>
        </div>

        {/* Authentication and Management Controls */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                {!showPasswordInput ? (
                  <button
                    onClick={() => setShowPasswordInput(true)}
                    disabled={isBlocked}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg hover:from-orange-500 hover:to-red-600 transition-colors disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    {isBlocked ? `${t.blockedFor || 'Blocked for'} ${Math.floor(blockTimeRemaining / 60)}:${(blockTimeRemaining % 60).toString().padStart(2, '0')}` : (t.manageBlogs || 'Manage Blogs')}
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAuthentication(password)}
                      placeholder={t.enterPassword || 'Enter password'}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                    <button
                      onClick={() => handleAuthentication(password)}
                      className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordInput(false);
                        setPassword('');
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {authAttempts > 0 && !isBlocked && (
                  <span className="text-sm text-red-600">
                    {t.attemptsRemaining || 'Attempts remaining'}: {3 - authAttempts}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-green-600">
                  <Unlock className="w-4 h-4" />
                  <span className="text-sm font-medium">{t.authenticated || 'Authenticated'}</span>
                </div>
                
                {/* Blog Destination Selector */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t.blogDestination || 'Blog Destination'}:
                  </label>
                  <select
                    value={selectedBlogEndpoint}
                    onChange={(e) => setSelectedBlogEndpoint(e.target.value)}
                    className="px-3 py-1 text-sm border border-yellow-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
                  >
                    {Object.entries(blogEndpoints).map(([key, endpoint]) => (
                      <option key={key} value={key}>
                        {endpoint.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={handleCreatePost}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {t.createPost || 'Create Post'}
                </button>
                <button
                  onClick={handleClearAllPosts}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-colors"
                  title="Clear all posts"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  {t.logout || 'Logout'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Subscriber Management */}
        {isAuthenticated && (
          <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Newsletter Subscribers ({subscribers.length})
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={loadSubscribers}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Refresh
                </button>
                <button
                  onClick={() => setShowSubscribers(!showSubscribers)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  {showSubscribers ? 'Hide' : 'Show'} Subscribers
                </button>
              </div>
            </div>
            
            {showSubscribers && (
              <div className="space-y-3">
                {subscribers.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto">
                    <div className="grid gap-2">
                      {subscribers.map((subscriber, index) => (
                        <div key={subscriber.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <MessageSquare className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{subscriber.email}</p>
                              <p className="text-sm text-gray-500">
                                Subscribed: {new Date(subscriber.subscribed_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              subscriber.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {subscriber.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <button
                              onClick={() => {
                                if (confirm(`Remove ${subscriber.email} from newsletter?`)) {
                                  const updatedSubscribers = subscribers.filter(s => s.id !== subscriber.id);
                                  setSubscribers(updatedSubscribers);
                                  localStorage.setItem('newsletter-subscribers', JSON.stringify(updatedSubscribers));
                                }
                              }}
                              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                              title="Remove subscriber"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No subscribers yet</p>
                    <p className="text-sm">Subscribers will appear here when people sign up for your newsletter.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Blog Post Creation/Editing Form */}
        {isAuthenticated && showCreateForm && currentPost && (
          <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {currentPost.id && posts.find(p => p.id === currentPost.id) ? (t.editPost || 'Edit Post') : (t.createNewPost || 'Create New Post')}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  {showPreview ? (t.hidePreview || 'Hide Preview') : (t.showPreview || 'Show Preview')}
                </button>
                <button
                  onClick={() => setEditorMode(editorMode === 'markdown' ? 'html' : 'markdown')}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  {editorMode === 'markdown' ? 'HTML' : 'Markdown'}
                </button>
                <button
                  onClick={handleSavePost}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {t.savePost || 'Save Post'}
                </button>
                <button
                  onClick={() => {
                    const shouldExit = confirm('Are you sure you want to go back to all blogs? Unsaved changes will be lost.');
                    if (shouldExit) {
                      setShowCreateForm(false);
                      setCurrentPost(null);
                      setIsEditing(false);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg hover:from-gray-500 hover:to-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t.backToBlogs || 'Back to All Blogs'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form */}
              <div className="space-y-4">
                {/* Blog Destination */}
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <label className="block text-sm font-medium text-orange-800 mb-2">
                    📍 {t.blogDestination || 'Blog Destination'}
                  </label>
                  <select
                    value={currentPost.blogEndpoint || selectedBlogEndpoint}
                    onChange={(e) => setCurrentPost({
                      ...currentPost,
                      blogEndpoint: e.target.value,
                      destinationUrl: blogEndpoints[e.target.value as keyof typeof blogEndpoints]?.url || '/blog'
                    })}
                    className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
                  >
                    {Object.entries(blogEndpoints).map(([key, endpoint]) => (
                      <option key={key} value={key}>
                        {endpoint.name} - {endpoint.description}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-orange-600 mt-1">
                    {t.destinationUrl || 'Destination URL'}: {currentPost.destinationUrl || blogEndpoints[selectedBlogEndpoint as keyof typeof blogEndpoints]?.url}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postTitle || 'Title'} (EN)
                  </label>
                  <input
                    type="text"
                    value={getFormFieldValue(currentPost.title, 'en')}
                    onChange={(e) => setCurrentPost(updatePostField(currentPost, 'title', 'en', e.target.value))}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postTitle || 'Title'} (LT)
                  </label>
                  <input
                    type="text"
                    value={getFormFieldValue(currentPost.title, 'lt')}
                    onChange={(e) => setCurrentPost(updatePostField(currentPost, 'title', 'lt', e.target.value))}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postTitle || 'Title'} (FR)
                  </label>
                  <input
                    type="text"
                    value={getFormFieldValue(currentPost.title, 'fr')}
                    onChange={(e) => setCurrentPost(updatePostField(currentPost, 'title', 'fr', e.target.value))}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.category || 'Category'}
                  </label>
                  <select
                    value={currentPost.category}
                    onChange={(e) => setCurrentPost({
                      ...currentPost,
                      category: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(blogCategories).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.title[currentLanguage as LanguageCode]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.excerpt || 'Excerpt'} (EN)
                  </label>
                  <textarea
                    value={getFormFieldValue(currentPost.excerpt, 'en')}
                    onChange={(e) => setCurrentPost(updatePostField(currentPost, 'excerpt', 'en', e.target.value))}
                    onKeyDown={handleKeyDown}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.content || 'Content'} (EN)
                  </label>
                  
                  {/* Language Tabs for Rich Text Editor */}
                  <div className="mb-4">
                    <div className="flex border-b border-gray-200">
                      <button
                        type="button"
                        onClick={() => setActiveLanguageTab('en')}
                        className={`px-4 py-2 text-sm font-medium ${
                          activeLanguageTab === 'en'
                            ? 'text-orange-600 border-b-2 border-orange-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        English
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveLanguageTab('lt')}
                        className={`px-4 py-2 text-sm font-medium ${
                          activeLanguageTab === 'lt'
                            ? 'text-orange-600 border-b-2 border-orange-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Lithuanian
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveLanguageTab('fr')}
                        className={`px-4 py-2 text-sm font-medium ${
                          activeLanguageTab === 'fr'
                            ? 'text-orange-600 border-b-2 border-orange-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        French
                      </button>
                    </div>
                  </div>

                  {/* Rich Text Toolbar */}
                  <div className="border border-gray-300 rounded-t-lg bg-gradient-to-r from-gray-50 to-gray-100 p-3">
                    <div className="flex flex-wrap items-center gap-1">
                      {/* Undo/Redo */}
                      <button
                        type="button"
                        onClick={handleUndo}
                        disabled={undoHistory.length === 0}
                        className="p-2 text-gray-600 hover:bg-white hover:text-orange-600 rounded transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Undo (Cmd/Ctrl + Z)"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={handleRedo}
                        disabled={redoHistory.length === 0}
                        className="p-2 text-gray-600 hover:bg-white hover:text-orange-600 rounded transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Redo (Cmd/Ctrl + Shift + Z)"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                        </svg>
                      </button>
                      
                      <div className="w-px h-6 bg-gray-300 mx-1" />
                      
                      {/* Text Formatting */}
                      <button
                        type="button"
                        onClick={insertBold}
                        className="p-2 text-gray-600 hover:bg-white hover:text-orange-600 rounded transition-all duration-200 hover:shadow-sm"
                        title="Bold (Cmd/Ctrl + B)"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={insertItalic}
                        className="p-2 text-gray-600 hover:bg-white hover:text-orange-600 rounded transition-all duration-200 hover:shadow-sm"
                        title="Italic (Cmd/Ctrl + I)"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={insertUnderline}
                        className="p-2 text-gray-600 hover:bg-white hover:text-orange-600 rounded transition-all duration-200 hover:shadow-sm"
                        title="Underline (Cmd/Ctrl + U)"
                      >
                        <Underline className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={insertLink}
                        className="p-2 text-gray-600 hover:bg-white hover:text-orange-600 rounded transition-all duration-200 hover:shadow-sm"
                        title="Insert Link (Cmd/Ctrl + K)"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={insertCode}
                        className="p-2 text-gray-600 hover:bg-white hover:text-orange-600 rounded transition-all duration-200 hover:shadow-sm"
                        title="Inline Code"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      
                      <div className="w-px h-6 bg-gray-300 mx-1" />
                      
                      {/* Text Alignment */}
                      <button
                        type="button"
                        onClick={insertLeftAlign}
                        className="p-2 text-gray-600 hover:bg-white hover:text-orange-600 rounded transition-all duration-200 hover:shadow-sm"
                        title="Align Left"
                      >
                        <AlignLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={insertCenterAlign}
                        className="p-2 text-gray-600 hover:bg-white hover:text-orange-600 rounded transition-all duration-200 hover:shadow-sm"
                        title="Align Center"
                      >
                        <AlignCenter className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={insertRightAlign}
                        className="p-2 text-gray-600 hover:bg-white hover:text-orange-600 rounded transition-all duration-200 hover:shadow-sm"
                        title="Align Right"
                      >
                        <AlignRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={insertJustifyAlign}
                        className="p-2 text-gray-600 hover:bg-white hover:text-orange-600 rounded transition-all duration-200 hover:shadow-sm"
                        title="Justify Text"
                      >
                        <AlignJustify className="w-4 h-4" />
                      </button>
                      
                      <div className="w-px h-6 bg-gray-300 mx-1" />
                      
                      {/* Headings */}
                      <button
                        type="button"
                        onClick={() => insertHeading(1)}
                        className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded transition-colors"
                        title="Heading 1"
                      >
                        H1
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHeading(2)}
                        className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded transition-colors"
                        title="Heading 2"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHeading(3)}
                        className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded transition-colors"
                        title="Heading 3"
                      >
                        H3
                      </button>
                      
                      <div className="w-px h-6 bg-gray-300 mx-1" />
                      
                      {/* Lists */}
                      <button
                        type="button"
                        onClick={() => insertList(false)}
                        className="p-2 text-gray-600 hover:bg-white hover:text-orange-600 rounded transition-all duration-200 hover:shadow-sm"
                        title="Bullet List"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertList(true)}
                        className="p-2 text-gray-600 hover:bg-white hover:text-orange-600 rounded transition-all duration-200 hover:shadow-sm"
                        title="Numbered List"
                      >
                        <ListOrdered className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={insertNestedList}
                        className="p-2 text-gray-600 hover:bg-white hover:text-orange-600 rounded transition-all duration-200 hover:shadow-sm"
                        title="Nested List Item"
                      >
                        <span className="text-sm font-mono">○</span>
                      </button>
                      
                      <div className="w-px h-6 bg-gray-300 mx-1" />
                      
                      {/* Media */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isImageUploading}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={isImageUploading ? "Uploading..." : "Upload Image"}
                      >
                        {isImageUploading ? (
                          <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ImageIcon className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowVideoEmbed(true)}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                        title="Embed Video"
                      >
                        <Video className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowVideoEmbed(true)}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                        title="Embed Music"
                      >
                        <Music className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={insertCodeBlock}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                        title="Code Block"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  {/* Image Upload Modal */}
                  {showImageUpload && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Insert Image</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Image URL or Path
                            </label>
                            <input
                              type="text"
                              value={imageUrl}
                              onChange={(e) => setImageUrl(e.target.value)}
                              placeholder="Enter URL or upload file below"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              💡 Upload a file below for automatic processing, or enter an image URL
                            </p>
                          </div>
                          
                          {imageUrl && !imageUrl.startsWith('data:') && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                              <img 
                                src={imageUrl} 
                                alt="Preview" 
                                className="max-w-full h-32 object-cover rounded border"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          
                          {imageUrl && imageUrl.startsWith('data:') && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <p className="text-sm text-green-800">
                                ✅ Image loaded successfully! Ready to insert.
                              </p>
                              <div className="mt-2">
                                <img 
                                  src={imageUrl} 
                                  alt="Preview" 
                                  className="max-w-full h-32 object-cover rounded border"
                                  style={{ maxWidth: '200px' }}
                                />
                              </div>
                            </div>
                          )}
                          
                          {imageUrl && !imageUrl.startsWith('data:') && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <p className="text-sm text-blue-800">
                                ℹ️ External URL entered. Image will display if URL is valid.
                              </p>
                              <div className="mt-2">
                                <img 
                                  src={imageUrl} 
                                  alt="Preview" 
                                  className="max-w-full h-32 object-cover rounded border"
                                  style={{ maxWidth: '200px' }}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setShowImageUpload(false);
                                setImageUrl('');
                              }}
                              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={insertImage}
                              disabled={!imageUrl.trim()}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                              Insert Image
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Video Embed Modal */}
                  {showVideoEmbed && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Embed Video/Music/Podcast</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              YouTube or Spotify URL
                            </label>
                            <input
                              type="url"
                              value={videoUrl}
                              onChange={(e) => setVideoUrl(e.target.value)}
                              placeholder="Paste your YouTube or Spotify link here..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Supported Content:</h4>
                            <div className="space-y-3 text-sm text-gray-600">
                              <div>
                                <p className="font-medium text-gray-800">📺 YouTube:</p>
                                <ul className="list-disc list-inside ml-2 space-y-1">
                                  <li>Videos: https://www.youtube.com/watch?v=VIDEO_ID</li>
                                  <li>Short links: https://youtu.be/VIDEO_ID</li>
                                </ul>
                              </div>
                              
                              <div>
                                <p className="font-medium text-gray-800">🎵 Spotify:</p>
                                <ul className="list-disc list-inside ml-2 space-y-1">
                                  <li>Tracks: https://open.spotify.com/track/...</li>
                                  <li>Albums: https://open.spotify.com/album/...</li>
                                  <li>Playlists: https://open.spotify.com/playlist/...</li>
                                  <li>Artists: https://open.spotify.com/artist/...</li>
                                  <li>Podcasts: https://open.spotify.com/show/...</li>
                                  <li>Episodes: https://open.spotify.com/episode/...</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-blue-800">
                              💡 <strong>Tip:</strong> You can copy the URL directly from YouTube or Spotify by clicking the share button and selecting "Copy Link"
                            </p>
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setShowVideoEmbed(false);
                                setVideoUrl('');
                              }}
                              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={insertVideo}
                              disabled={!videoUrl.trim()}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                              Embed Content
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <textarea
                    ref={activeLanguageTab === 'en' ? textareaRef : 
                         activeLanguageTab === 'lt' ? textareaRefLt : textareaRefFr}
                    value={getFormFieldValue(currentPost.content, activeLanguageTab)}
                    onChange={(e) => setCurrentPost(updatePostField(currentPost, 'content', activeLanguageTab, e.target.value))}
                    onKeyDown={handleKeyDown}
                    rows={15}
                    className="w-full px-3 py-2 border-l border-r border-b border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
                    placeholder={editorMode === 'markdown' 
                      ? `Write your content in Markdown (${activeLanguageTab.toUpperCase()})...\n\n**Bold text**\n*Italic text*\n# Heading 1\n## Heading 2\n- List item\n[Link](url)\n![Image](url)` 
                      : `Write your content in HTML (${activeLanguageTab.toUpperCase()})...`
                    }
                  />
                  
                  {/* Hidden textareas for ref management */}
                  {activeLanguageTab !== 'en' && (
                    <textarea
                      ref={textareaRef}
                      value={getFormFieldValue(currentPost.content, 'en')}
                      onChange={(e) => setCurrentPost(updatePostField(currentPost, 'content', 'en', e.target.value))}
                      className="hidden"
                    />
                  )}
                  {activeLanguageTab !== 'lt' && (
                    <textarea
                      ref={textareaRefLt}
                      value={getFormFieldValue(currentPost.content, 'lt')}
                      onChange={(e) => setCurrentPost(updatePostField(currentPost, 'content', 'lt', e.target.value))}
                      className="hidden"
                    />
                  )}
                  {activeLanguageTab !== 'fr' && (
                    <textarea
                      ref={textareaRefFr}
                      value={getFormFieldValue(currentPost.content, 'fr')}
                      onChange={(e) => setCurrentPost(updatePostField(currentPost, 'content', 'fr', e.target.value))}
                      className="hidden"
                    />
                  )}
                </div>
                
                {/* Editor Help Guide */}
                <div className="mt-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="text-sm font-semibold text-orange-800 mb-2">✨ Rich Text Editor Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-orange-700">
                    <div>
                      <p className="font-medium mb-1">Keyboard Shortcuts:</p>
                      <ul className="space-y-1">
                        <li>• <kbd className="bg-orange-100 px-1 rounded">Cmd/Ctrl + A</kbd> - Select All</li>
                        <li>• <kbd className="bg-orange-100 px-1 rounded">Cmd/Ctrl + Z</kbd> - Undo</li>
                        <li>• <kbd className="bg-orange-100 px-1 rounded">Cmd/Ctrl + Shift + Z</kbd> - Redo</li>
                        <li>• <kbd className="bg-orange-100 px-1 rounded">Cmd/Ctrl + B</kbd> - Bold</li>
                        <li>• <kbd className="bg-orange-100 px-1 rounded">Cmd/Ctrl + I</kbd> - Italic</li>
                        <li>• <kbd className="bg-orange-100 px-1 rounded">Cmd/Ctrl + U</kbd> - Underline</li>
                        <li>• <kbd className="bg-orange-100 px-1 rounded">Cmd/Ctrl + K</kbd> - Insert Link</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Media Embedding:</p>
                      <ul className="space-y-1">
                        <li>• Paste YouTube URLs - Auto-converts to embeds</li>
                        <li>• Paste Spotify URLs - Auto-converts to players</li>
                        <li>• Use toolbar for images and manual embeds</li>
                        <li>• Links appear as <span className="text-green-600 underline font-medium">green underlined</span></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.excerpt || 'Excerpt'} (LT)
                  </label>
                  <textarea
                    value={getFormFieldValue(currentPost.excerpt, 'lt')}
                    onChange={(e) => setCurrentPost(updatePostField(currentPost, 'excerpt', 'lt', e.target.value))}
                    onKeyDown={handleKeyDown}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.excerpt || 'Excerpt'} (FR)
                  </label>
                  <textarea
                    value={getFormFieldValue(currentPost.excerpt, 'fr')}
                    onChange={(e) => setCurrentPost(updatePostField(currentPost, 'excerpt', 'fr', e.target.value))}
                    onKeyDown={handleKeyDown}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.tags || 'Tags'} (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={currentPost.tags?.join(', ') || ''}
                    onChange={(e) => setCurrentPost({
                      ...currentPost,
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tech, programming, tutorial"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    value={currentPost.featuredImage || ''}
                    onChange={(e) => setCurrentPost({
                      ...currentPost,
                      featuredImage: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={currentPost.published}
                    onChange={(e) => setCurrentPost({
                      ...currentPost,
                      published: e.target.checked
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="published" className="text-sm font-medium text-gray-700">
                    {t.published || 'Published'}
                  </label>
                </div>
              </div>

              {/* Preview */}
              {showPreview && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">{t.preview || 'Preview'}</h4>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h5 className="text-lg font-semibold text-gray-900 mb-2">
                      {getLocalizedText(currentPost.title) || 'Untitled'}
                    </h5>
                    <p className="text-gray-600 text-sm mb-3">
                      {getLocalizedText(currentPost.excerpt)}
                    </p>
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <ContentRenderer
                        content={getLocalizedText(currentPost.content)}
                        posts={posts}
                        selectedPost={currentPost}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Category and Endpoint Filters */}
        <div className="mb-8 space-y-4">
          {/* Category Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">📂 {t.filterByCategory || 'Filter by Category'}</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t.allCategories || 'All Categories'}
              </button>
              {Object.entries(blogCategories).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {value.title[currentLanguage as LanguageCode]}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Endpoint Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">📍 {t.filterByDestination || 'Filter by Blog Destination'}</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedBlogEndpoint('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedBlogEndpoint === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t.allDestinations || 'All Destinations'}
              </button>
              {Object.entries(blogEndpoints).map(([key, endpoint]) => (
                <button
                  key={key}
                  onClick={() => setSelectedBlogEndpoint(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedBlogEndpoint === key
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {endpoint.name}
                </button>
              ))}
            </div>
          </div>
        </div>        {/* All Blog Posts */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            {t.allBlogPosts || 'All Blog Posts'}
          </h3>
          
          {displayedPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {displayedPosts.map((post) => (
                  <article
                    key={post.id}
                    className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group ${
                      isAuthenticated && !post.published ? 'ring-2 ring-gray-200 opacity-75' : ''
                    }`}
                  >
                    {post.featuredImage && (
                      <img
                        src={post.featuredImage}
                        alt={getLocalizedText(post.title)}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                          {blogCategories[post.category]?.title?.[currentLanguage as LanguageCode] || post.category}
                        </span>
                        {isAuthenticated && (
                          <span className={`px-2 py-1 rounded-full ${
                            post.published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {post.published ? '✓ Published' : '⏸ Draft'}
                          </span>
                        )}
                        {post.blogEndpoint && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            📍 {blogEndpoints[post.blogEndpoint as keyof typeof blogEndpoints]?.name || post.blogEndpoint}
                          </span>
                        )}
                        <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : post.date}</span>
                        <span>•</span>
                        <span>{getLocalizedText(post.readTime)}</span>
                      </div>
                      
                      <h3 className={`text-xl font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors ${
                        isAuthenticated && !post.published ? 'text-gray-600' : ''
                      }`}>
                        {getLocalizedText(post.title)}
                        {isAuthenticated && !post.published && (
                          <span className="ml-2 text-sm text-gray-500 font-normal">(Draft)</span>
                        )}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {getLocalizedText(post.excerpt)}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-xs text-gray-500">
                          <User className="w-3 h-3 mr-1" />
                          {getLocalizedText(post.author)}
                        </div>
                        
                        {isAuthenticated && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditPost(post);
                              }}
                              className="p-1 text-orange-600 hover:bg-orange-100 rounded transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePost(post.id);
                              }}
                              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* Read More Button */}
                      <Link
                        to={`/blogs/${post.category}/${encodeURIComponent(getLocalizedText(post.title).replace(/\s+/g, '-').toLowerCase())}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg hover:from-orange-500 hover:to-red-600 transition-colors w-full justify-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t.blogs?.readMore || 'Read More'}
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {postsToShow.length > 6 && (
                <div className="text-center">
                  <button
                    onClick={() => setShowMorePosts(!showMorePosts)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {showMorePosts ? (t.showLess || 'Show Less') : (t.showMore || 'Show More')}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t.noBlogPosts || 'No blog posts found'}
              </h3>
              <p className="text-gray-600">
                {selectedCategory 
                  ? (t.noBlogPostsInCategory || 'No posts found in this category.') 
                  : (t.noBlogPostsYet || 'No blog posts have been published yet.')
                }
              </p>
            </div>
          )}
        </div>

        {/* Newsletter Section */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t.stayUpdated || 'Stay Updated'}
            </h3>
            <p className="text-gray-600 mb-6">
              {t.newsletterDescription || 'Subscribe to get the latest posts and updates.'}
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={t.enterEmail || 'Enter your email'}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={newsletterStatus === 'loading'}
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {newsletterStatus === 'loading' ? (t.subscribing || 'Subscribing...') : (t.subscribe || 'Subscribe')}
                </button>
              </div>
              
              {newsletterMessage && (
                <p className={`mt-2 text-sm ${
                  newsletterStatus === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {newsletterMessage}
                </p>
              )}
            </form>

            {/* External links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-600 mb-4">
                {t.followMeOn || 'Or follow me on:'}
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://aurimasnausedas.substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Substack
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
