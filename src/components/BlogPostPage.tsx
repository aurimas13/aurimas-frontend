import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { blogCategories } from '../data/blogCategories';
import { translations } from '../data/translations';
import { LanguageCode } from '../contexts/LanguageContext';
import { BlogPost, LocalizedText } from '../types';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';

// YouTube Embed Component (same as BlogSection)
const YouTubeEmbed: React.FC<{ url: string; videoId: string }> = ({ url, videoId }) => {
  const [title, setTitle] = useState('Loading...');
  
  // Get video title from cache or fetch it
  React.useEffect(() => {
    const titleCache = new Map<string, string>();
    if (titleCache.has(videoId)) {
      setTitle(titleCache.get(videoId)!);
      return;
    }
    
    // Simple title from video ID for now
    setTitle('YouTube Video');
  }, [videoId]);

  return (
    <div className="my-6" style={{ margin: '32px 0' }}>
      <div 
        className="relative w-full bg-black rounded-lg overflow-hidden shadow-lg"
        style={{ 
          paddingBottom: '56.25%', // 16:9 aspect ratio
          height: 0,
          position: 'relative'
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
          style={{
            border: 'none',
            borderRadius: '8px'
          }}
        />
      </div>
    </div>
  );
};

// Spotify Embed Component (same as BlogSection)
const SpotifyEmbed: React.FC<{ url: string; itemType: string; itemId: string }> = ({ url, itemType, itemId }) => {
  return (
    <div className="my-6 flex justify-center" style={{ margin: '32px 0' }}>
      <iframe
        src={`https://open.spotify.com/embed/${itemType}/${itemId}?utm_source=generator&theme=0`}
        width="100%"
        height="152"
        frameBorder="0"
        allowTransparency={true}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{
          borderRadius: '12px',
          maxWidth: '100%',
          width: '100%',
          height: '152px',
          minHeight: '152px'
        }}
      />
    </div>
  );
};

// Poll Component (same as BlogSection)
const PollComponent: React.FC<{
  pollId: string;
  question: string;
  options: string[];
}> = ({ pollId, question, options }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState<{[option: string]: number}>({});
  const [totalVotes, setTotalVotes] = useState(0);

  // Initialize poll data
  useEffect(() => {
    const storedVotes = localStorage.getItem(`poll-${pollId}`);
    const storedUserVote = localStorage.getItem(`poll-user-${pollId}`);
    
    if (storedVotes) {
      const parsedVotes = JSON.parse(storedVotes);
      setVotes(parsedVotes);
      setTotalVotes(Object.values(parsedVotes).reduce((sum: number, count: any) => sum + (count as number), 0));
    } else {
      // Initialize with zero votes for all options
      const initialVotes = options.reduce((acc, option) => {
        acc[option] = 0;
        return acc;
      }, {} as {[option: string]: number});
      setVotes(initialVotes);
    }
    
    if (storedUserVote) {
      setSelectedOption(storedUserVote);
      setHasVoted(true);
    }
  }, [pollId, options]);

  const handleVote = (option: string) => {
    if (hasVoted) return;
    
    const newVotes = { ...votes };
    newVotes[option] = (newVotes[option] || 0) + 1;
    const newTotal = totalVotes + 1;
    
    setVotes(newVotes);
    setTotalVotes(newTotal);
    setSelectedOption(option);
    setHasVoted(true);
    
    // Store in localStorage
    localStorage.setItem(`poll-${pollId}`, JSON.stringify(newVotes));
    localStorage.setItem(`poll-user-${pollId}`, option);
  };

  return (
    <div className="poll-component p-6 bg-white rounded-lg border-2 border-blue-100 shadow-sm">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">{question}</h4>
      
      <div className="space-y-3">
        {options.map((option, index) => {
          const voteCount = votes[option] || 0;
          const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
          const isSelected = selectedOption === option;
          
          return (
            <div
              key={index}
              className={`relative p-3 rounded-md border cursor-pointer transition-all duration-200 ${
                hasVoted
                  ? isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                  : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
              } ${!hasVoted ? 'hover:shadow-sm' : ''}`}
              onClick={() => handleVote(option)}
            >
              {hasVoted && (
                <div
                  className="absolute left-0 top-0 h-full bg-blue-100 rounded-md transition-all duration-500"
                  style={{ width: `${percentage}%`, zIndex: 1 }}
                />
              )}
              
              <div className="relative z-10 flex justify-between items-center">
                <span className={`text-sm ${isSelected ? 'font-medium text-blue-700' : 'text-gray-700'}`}>
                  {option}
                </span>
                {hasVoted && (
                  <span className="text-sm font-medium text-gray-600">
                    {voteCount} ({percentage.toFixed(1)}%)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {hasVoted && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Total votes: {totalVotes}
        </div>
      )}
    </div>
  );
};

// Simple Image Component (same as BlogSection)
const SimpleImage: React.FC<{
  src: string;
  alt: string;
  caption?: string;
  width?: 'normal' | 'wide' | 'full';
}> = ({ src, alt, caption, width = 'normal' }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const widthClasses = {
    normal: 'max-w-2xl',
    wide: 'max-w-4xl', 
    full: 'max-w-full'
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  if (imageError) {
    return (
      <div className="my-8 text-center">
        <div className="inline-block p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 text-sm">Image not found</p>
          <p className="text-xs text-gray-400 mt-1">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`my-8 ${widthClasses[width]} mx-auto`}>
      {isLoading && (
        <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
          <span className="text-gray-500">Loading...</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`w-full h-auto rounded-lg shadow-md ${isLoading ? 'hidden' : 'block'}`}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      {caption && (
        <p className="text-center text-sm text-gray-600 italic mt-2">
          {caption}
        </p>
      )}
    </div>
  );
};

// Inline markdown processor (same as BlogSection)
  const processInlineMarkdown = (text: string): string => {
    let processedText = text;
    
    // Handle both [Text](URL) and [Text|URL] formats - GREEN & ROBUST
    // Process [Text|URL] format first (pipe separator)
    processedText = processedText.replace(/\[([^\]]+)\|([^\]]+)\]/g, (match, linkText, url) => {
      let processedUrl = url.trim();
      if (!processedUrl.startsWith('http')) {
        processedUrl = `https://${processedUrl}`;
      }
      return `<a href="${processedUrl}" target="_blank" rel="noopener noreferrer" style="color: #16a34a; text-decoration: underline; font-weight: 500;">${linkText.trim()}</a>`;
    });
    
    // Process [Text](URL) format second (parentheses format)
    processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
      let processedUrl = url.trim();
      if (!processedUrl.startsWith('http')) {
        processedUrl = `https://${processedUrl}`;
      }
      return `<a href="${processedUrl}" target="_blank" rel="noopener noreferrer" style="color: #16a34a; text-decoration: underline; font-weight: 500;">${linkText.trim()}</a>`;
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

// MAIN COMPONENT - Named export to match import in AppRouter
export const BlogPostPage: React.FC = () => {
  const { category, postId } = useParams<{ category: string; postId: string }>();
  const { currentLanguage } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get localized text
  const getLocalizedText = (text: any): string => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    if (typeof text === 'object') {
      return text[currentLanguage as keyof typeof text] || text.en || '';
    }
    return '';
  };

  // Helper function to get localized number
  const getLocalizedNumber = (num: any): string => {
    if (!num) return '';
    if (typeof num === 'number') return num.toString();
    if (typeof num === 'object') {
      return (num[currentLanguage as keyof typeof num] || num.en || '').toString();
    }
    return num.toString();
  };

  useEffect(() => {
    if (!category || !postId) {
      setLoading(false);
      return;
    }

    // Load the specific post
    const posts = JSON.parse(localStorage.getItem('blog-posts') || '[]');
    const foundPost = posts.find((p: BlogPost) => 
      p.category?.toLowerCase() === category.toLowerCase() && 
      p.id === postId
    );

    setPost(foundPost || null);
    setLoading(false);
  }, [category, postId]);

  // Redirect if category doesn't exist
  if (!category || !blogCategories[category as keyof typeof blogCategories]) {
    return <Navigate to="/blogs" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-25 to-yellow-25 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-25 to-yellow-25 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">The requested blog post could not be found.</p>
          <Link
            to={`/blogs/${category}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {blogCategories[category as keyof typeof blogCategories].title[currentLanguage as LanguageCode]}
          </Link>
        </div>
      </div>
    );
  }

  const categoryData = blogCategories[category as keyof typeof blogCategories];

  // Content renderer using the same renderLine system as BlogSection (FIXED VERSION)
  const renderContent = (content: string) => {
    const allLines = content.split('\n');
    
    // Main renderLine function (same as BlogSection)
    const renderLine = (line: string, index: number, allLines: string[]) => {
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
            </div>
          );
        }
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

      // Handle images - ![alt](src) with optional caption
      if (line.match(/!\[([^\]]*)\]\(([^)]+)\)/)) {
        const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)(?:\{([^}]*)\})?(?:<!--\s*FULL_DATA:([^>]+)\s*-->)?/);
        if (imageMatch) {
          const [, alt, src, attributes, fullData] = imageMatch;
          
          // Get caption from next line if it exists and matches italic format
          let caption = '';
          if (index + 1 < allLines.length) {
            const nextLine = allLines[index + 1];
            const captionMatch = nextLine.match(/^\*(.+)\*$/);
            if (captionMatch) {
              caption = captionMatch[1];
            }
          }
          
          // Resolve image source
          let actualSrc = src;
          if (!src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('/')) {
            // Try to find in blog-files localStorage
            const blogFiles = JSON.parse(localStorage.getItem('blog-files') || '{}');
            if (blogFiles[src]) {
              actualSrc = blogFiles[src];
            }
          }
          
          return (
            <SimpleImage
              key={index}
              src={actualSrc}
              alt={alt}
              caption={caption}
              width="normal"
            />
          );
        }
      }

      // Handle lists
      if (line.match(/^[\s]*[-*+]\s+/) || line.match(/^[\s]*\d+\.\s+/)) {
        const isOrdered = line.match(/^[\s]*\d+\.\s+/);
        const content = line.replace(/^[\s]*(?:[-*+]|\d+\.)\s+/, '');
        const processedContent = processInlineMarkdown(content);
        
        return (
          <div key={index} className={`ml-6 ${isOrdered ? 'list-decimal' : 'list-disc'} list-inside`}>
            <li dangerouslySetInnerHTML={{ __html: processedContent }} />
          </div>
        );
      }

      // Handle blockquotes
      if (line.startsWith('>')) {
        const quoteContent = line.substring(1).trim();
        const processedContent = processInlineMarkdown(quoteContent);
        return (
          <blockquote key={index} className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-600">
            <span dangerouslySetInnerHTML={{ __html: processedContent }} />
          </blockquote>
        );
      }

      // Regular paragraph with inline markdown
      const processedLine = processInlineMarkdown(line);
      return (
        <p key={index} className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: processedLine }} />
      );
    };

    try {
      const renderedLines = allLines
        .map((line, index) => renderLine(line, index, allLines))
        .filter(Boolean);
      
      return (
        <div className="prose prose-lg max-w-none text-gray-700 blog-content leading-relaxed">
          <style>{`
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
      console.error('❌ BlogPostPage PUBLISHED CONTENT PROCESSING ERROR:', error);
      return (
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Content Processing Error</h4>
          <p className="text-sm">{(error as Error).message}</p>
          <p className="text-xs mt-2">Check console for details</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-25 to-yellow-25">
      <div className="container mx-auto px-4 py-12">
        {/* Navigation */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link to="/blogs" className="hover:text-blue-600 transition-colors">
              All Blogs
            </Link>
            <span>/</span>
            <Link to={`/blogs/${category}`} className="hover:text-blue-600 transition-colors">
              {categoryData.title[currentLanguage as LanguageCode]}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{getLocalizedText(post?.title)}</span>
          </nav>
          
          <Link 
            to={`/blogs/${category}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to {categoryData.title[currentLanguage as LanguageCode]}
          </Link>
        </div>

        {/* Article */}
        <article className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8 md:p-12">
              {/* Article Header */}
              <header className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl">📚</span>
                  <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                    {categoryData.title[currentLanguage as LanguageCode]}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {getLocalizedText(post?.title)}
                </h1>

                {post?.subtitle && (
                  <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                    {getLocalizedText(post.subtitle)}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-200 pb-6">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{getLocalizedText(post?.author)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <time>
                      {new Date(post?.publishedAt || post?.date || '').toLocaleDateString(
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
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{getLocalizedNumber(post?.readTime)}</span>
                  </div>
                </div>
              </header>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none blog-content">
                {post && renderContent(getLocalizedText(post.content))}
              </div>

              {/* Article Footer */}
              <footer className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap gap-2 mb-6">
                  {post?.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    to={`/blogs/${category}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    More from {categoryData.title[currentLanguage as LanguageCode]}
                  </Link>
                  
                  <a
                    href={categoryData.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-orange-600 hover:text-orange-800 transition-colors duration-200"
                  >
                    Read on Substack
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </footer>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
