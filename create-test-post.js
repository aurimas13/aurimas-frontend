// Simple test to create a blog post with a small test image
function createTestPost() {
  console.log('🧪 Creating test blog post...');
  
  // Create a small test image (1x1 pixel red dot)
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 1, 1);
  const testImageDataUrl = canvas.toDataURL('image/png');
  
  // Generate test filename
  const testFileName = 'test123.png';
  
  // Store in localStorage 'blog-files'
  const existingFiles = JSON.parse(localStorage.getItem('blog-files') || '{}');
  existingFiles[testFileName] = testImageDataUrl;
  localStorage.setItem('blog-files', JSON.stringify(existingFiles));
  
  // Create test post
  const testPost = {
    id: 'test-post-' + Date.now(),
    title: 'Test Post with Image',
    excerpt: 'Testing image display functionality',
    content: `# Test Post\n\nThis is a test post with an image:\n\n![Test Image](${testFileName})\n*This is a test image caption*\n\nEnd of test.`,
    category: 'molecule-to-machine',
    publishedAt: new Date().toISOString(),
    readTime: 1,
    isPremium: false,
    tags: ['test'],
    author: 'Test Author',
    status: 'published',
    subtitle: '',
    featuredImage: '',
    language: 'en',
    insights: {
      title: '',
      content: '',
      emoji: ''
    },
    uploadedFiles: [{
      id: testFileName,
      name: testFileName,
      originalName: 'test-image.png',
      url: testImageDataUrl,
      type: 'image/png',
      size: testImageDataUrl.length
    }]
  };
  
  // Save to localStorage 'blog-posts'
  const existingPosts = JSON.parse(localStorage.getItem('blog-posts') || '[]');
  existingPosts.push(testPost);
  localStorage.setItem('blog-posts', JSON.stringify(existingPosts));
  
  console.log('✅ Test post created successfully!');
  console.log('📄 Post:', testPost.title);
  console.log('🖼️ Image:', testFileName);
  console.log('💾 Data stored in localStorage');
  console.log('🔄 Refresh the page to see the test post');
  
  return testPost;
}

// Run the test
createTestPost();
