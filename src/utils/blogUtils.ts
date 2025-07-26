// Utility functions for blog file management

export interface CompressedFile {
  id: string;
  name: string;
  originalName: string;
  url: string;
  type: string;
  size: number;
  compressedSize?: number;
}

// Generate a compressed filename with timestamp and random string
export const generateCompressedFileName = (originalFile: File): string => {
  const extension = originalFile.name.split('.').pop() || '';
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substr(2, 9);
  return `${timestamp}_${randomString}.${extension}`;
};

// Compress image files before storing
export const compressImage = async (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressedDataUrl = canvas.toDataURL(file.type, quality);
      resolve(compressedDataUrl);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Store file metadata in localStorage with compression info
export const storeFileMetadata = (files: CompressedFile[], postId: string) => {
  const key = `blog-files-${postId}`;
  localStorage.setItem(key, JSON.stringify(files));
};

// Retrieve file metadata from localStorage
export const retrieveFileMetadata = (postId: string): CompressedFile[] => {
  const key = `blog-files-${postId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

// Clean up unused file data
export const cleanupUnusedFiles = (activePostIds: string[]) => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('blog-files-')) {
      const postId = key.replace('blog-files-', '');
      if (!activePostIds.includes(postId)) {
        localStorage.removeItem(key);
      }
    }
  });
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Create Substack-style content template
export const createSubstackTemplate = (title: string, emoji: string, imageSource?: string): string => {
  return `# ${emoji} ${title}

${imageSource ? `## Image Source: ${imageSource}\n\n` : ''}### Title: "💡 [Your insight title here]"

**Synopsis:** [Brief synopsis of your content - 1-2 sentences describing the main points]

[Your main content goes here. Write in a conversational, engaging style. Break up text with headers, bullet points, and insights.]

## Key Points

- **Point 1:** [First main takeaway]
- **Point 2:** [Second main takeaway]  
- **Point 3:** [Third main takeaway]

## Analysis

[Deeper dive into the topic. This is where you can expand on the key points and provide your expert analysis.]

## Conclusion

[Wrap up your thoughts and perhaps pose a question to engage readers]

---

*What are your thoughts on this topic? Share your insights in the comments below.*`;
};

// Parse content to extract metadata for insights
export const extractInsightsFromContent = (content: string): { emoji: string; title: string; insights: string } => {
  const lines = content.split('\n');
  
  // Extract emoji from first heading
  const titleLine = lines.find(line => line.startsWith('# '));
  const emojiMatch = titleLine?.match(/^# ([^\s]+)/);
  const emoji = emojiMatch ? emojiMatch[1] : '💡';
  
  // Extract insight title
  const insightTitleLine = lines.find(line => line.includes('Title:'));
  const titleMatch = insightTitleLine?.match(/Title:\s*"([^"]+)"/);
  const insightTitle = titleMatch ? titleMatch[1] : 'My Insight:';
  
  // Extract synopsis as insight
  const synopsisLine = lines.find(line => line.includes('Synopsis:'));
  const synopsisMatch = synopsisLine?.match(/Synopsis:\s*(.+)/);
  const insights = synopsisMatch ? synopsisMatch[1] : '';
  
  return { emoji, title: insightTitle, insights };
};
