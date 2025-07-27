// Enhanced renderContent function to replace in BlogSection.tsx
// This should be copied and pasted to replace the existing renderContent function

const renderContent = (content: string) => {
  try {
    const lines = content.split('\n');
    const processedLines = lines.map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      
      // Skip caption lines that are already handled by images
      if (line.match(/^\*(.+)\*$/) && index > 0) {
        const prevLine = lines[index - 1];
        if (prevLine && prevLine.match(/!\[([^\]]*)\]\(([^)]+)\)/)) {
          return null; // Skip this line as it's handled as a caption
        }
      }
      
      // Define enhanced processInlineMarkdown function (same as BlogManager)
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

      // Handle headers with enhanced markdown support (including links)
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

      // Handle bullet points
      if (line.startsWith('- ')) {
        const bulletText = line.substring(2);
        const processedText = processInlineMarkdown(bulletText);
        return (
          <div key={index} className="flex items-start mb-2">
            <span className="inline-block w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span dangerouslySetInnerHTML={{ __html: processedText }} />
          </div>
        );
      }
      
      if (line.startsWith('-- ')) {
        const bulletText = line.substring(3);
        const processedText = processInlineMarkdown(bulletText);
        return (
          <div key={index} className="flex items-start mb-2">
            <span className="inline-block w-2 h-2 border border-gray-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span dangerouslySetInnerHTML={{ __html: processedText }} />
          </div>
        );
      }

      // Handle polls - [POLL:Question|Option1|Option2|Option3] (same as BlogManager)
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

      // Handle images - ![alt](url) with optional width and caption
      const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)(\{width=(wide|full)\})?/);
      if (imageMatch) {
        const [, alt, src, , widthValue] = imageMatch;
        const width = widthValue as 'normal' | 'wide' | 'full' || 'normal';
        
        // Check if next line is a caption (italic text)
        const nextLine = lines[index + 1];
        const caption = nextLine && nextLine.match(/^\*(.+)\*$/) ? nextLine.match(/^\*(.+)\*$/)![1] : undefined;
        
        // Resolve image source (check for uploaded files)
        let actualSrc = src;
        if (!src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('/')) {
          // Try to find the image in uploadedFiles (if this is a published post with uploaded files)
          const currentPost = posts.find(p => p.content.includes(line));
          if (currentPost?.uploadedFiles) {
            const uploadedFile = currentPost.uploadedFiles.find(f => f.name === src || f.id === src);
            if (uploadedFile?.url) {
              actualSrc = uploadedFile.url;
            }
          }
        }
        
        return (
          <div key={index} className="mb-4">
            <img 
              src={actualSrc}
              alt={alt}
              className={`rounded-lg shadow-md mx-auto ${
                width === 'wide' ? 'w-4/5 max-w-4xl' :
                width === 'full' ? 'w-full max-w-none' : 'max-w-2xl'
              }`}
              style={{ 
                maxHeight: width === 'full' ? '600px' : '400px',
                objectFit: 'cover'
              }}
            />
            {caption && (
              <p className="text-center text-gray-600 text-sm italic mt-2">{caption}</p>
            )}
          </div>
        );
      }

      // Handle horizontal dividers
      if (line.trim() === '---') {
        return <hr key={index} className="my-6 border-gray-300" />;
      }

      // Handle code blocks
      if (line.startsWith('```')) {
        const language = line.slice(3).trim();
        let codeContent = '';
        let endIndex = index + 1;
        
        // Find the closing ```
        for (let i = index + 1; i < lines.length; i++) {
          if (lines[i].trim() === '```') {
            endIndex = i;
            break;
          }
          if (i > index + 1) codeContent += '\n';
          codeContent += lines[i];
        }
        
        return (
          <div key={index} className="mb-4">
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              {language && (
                <div className="text-xs text-gray-400 mb-2 uppercase font-mono">{language}</div>
              )}
              <pre className="text-sm font-mono whitespace-pre-wrap">{codeContent}</pre>
            </div>
          </div>
        );
      }

      // Handle blockquotes
      if (line.startsWith('> ')) {
        const quoteText = line.substring(2);
        const processedText = processInlineMarkdown(quoteText);
        return (
          <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic text-gray-700 mb-4">
            <div dangerouslySetInnerHTML={{ __html: processedText }} />
          </blockquote>
        );
      }

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
            <div key={index} className="my-4">
              {/* Actual YouTube embed iframe */}
              <div className="relative w-full mb-3" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                  title={videoTitle}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg" data-video-id={videoId}>
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
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Watch Video →
                  </a>
                </div>
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
          
          return (
            <div key={index} className="my-4">
              <div className="relative w-full mb-3">
                <iframe
                  className="w-full rounded-lg shadow-lg"
                  src={`https://open.spotify.com/embed/${itemType}/${itemId}?utm_source=generator`}
                  height="352"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-green-600">
                    <span className="text-2xl">🎵</span>
                    <div>
                      <div className="font-bold">{itemTitle}</div>
                      <div className="text-sm text-gray-600">Spotify {itemType}</div>
                    </div>
                  </div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Open in Spotify →
                  </a>
                </div>
              </div>
            </div>
          );
        }
      }
      
      // Handle text with inline formatting (bold, italic, links)
      if (line.trim()) {
        return (
          <p 
            key={index} 
            className="mb-2" 
            dangerouslySetInnerHTML={{ __html: processInlineMarkdown(line) }}
          />
        );
      }
      
      // Empty line
      return <br key={index} />;
    }).filter(Boolean); // Remove null elements (like skipped captions)
    
    return <div className="prose max-w-none">{processedLines}</div>;
  } catch (error) {
    console.error('Error rendering content:', error);
    return <div className="text-red-500">Error rendering content</div>;
  }
};
