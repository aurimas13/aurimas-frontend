/**
 * Browser Debug Script - Copy and Paste into Browser Console
 * 
 * This script helps diagnose image display issues between BlogManager and BlogSection
 * 
 * TO USE:
 * 1. Open your website in browser
 * 2. Open Developer Tools (F12)
 * 3. Go to Console tab
 * 4. Copy and paste this entire script
 * 5. Run: debugImageSystem()
 */

function debugImageSystem() {
  console.log('🔍 === IMAGE SYSTEM DEBUG ===');
  
  // Check localStorage
  const posts = JSON.parse(localStorage.getItem('blog-posts') || '[]');
  const files = JSON.parse(localStorage.getItem('blog-files') || '{}');
  
  console.log('📊 Storage Status:');
  console.log(`  Posts: ${posts.length} found`);
  console.log(`  Files: ${Object.keys(files).length} found`);
  
  if (posts.length === 0) {
    console.log('❌ No posts found in localStorage. Create a blog post first!');
    console.log('📝 To test:');
    console.log('   1. Go to Blog Manager');
    console.log('   2. Create a new post');
    console.log('   3. Add an image');
    console.log('   4. Save the post');
    console.log('   5. Return to Blog section');
    console.log('   6. Run this debug again');
    return;
  }
  
  console.log('📝 Posts found:');
  posts.forEach((post, index) => {
    console.log(`  Post ${index + 1}: "${post.title.en || post.title}" (${post.id})`);
    
    // Find images in content
    const content = post.content.en || post.content;
    const imageMatches = content.match(/!\[.*?\]\((.*?)\)/g) || [];
    
    console.log(`    Images in content: ${imageMatches.length}`);
    imageMatches.forEach((match, imgIndex) => {
      const src = match.match(/!\[.*?\]\((.*?)\)/)?.[1];
      console.log(`      Image ${imgIndex + 1}: ${src}`);
      
      // Check if image exists in files
      if (files[src]) {
        console.log(`        ✅ Found in localStorage: ${files[src].substring(0, 50)}...`);
      } else {
        console.log(`        ❌ NOT found in localStorage files`);
        
        // Try to find by searching all posts' uploadedFiles
        let foundInUploadedFiles = false;
        posts.forEach(p => {
          if (p.uploadedFiles && p.uploadedFiles[src]) {
            console.log(`        🔍 Found in post uploadedFiles: ${p.uploadedFiles[src].substring(0, 50)}...`);
            foundInUploadedFiles = true;
          }
        });
        
        if (!foundInUploadedFiles) {
          console.log(`        💀 Image completely missing from storage`);
        }
      }
    });
  });
  
  console.log('📁 All Files in localStorage:');
  Object.keys(files).forEach(filename => {
    console.log(`  ${filename}: ${files[filename].substring(0, 50)}...`);
  });
  
  console.log('🔧 === RECOMMENDATIONS ===');
  if (Object.keys(files).length === 0) {
    console.log('❌ No files in localStorage - this is likely the problem!');
    console.log('💡 Try:');
    console.log('   1. Go to BlogManager');
    console.log('   2. Edit a post');
    console.log('   3. Re-upload the image');
    console.log('   4. Save the post');
  } else {
    console.log('✅ Files exist in localStorage');
    console.log('💡 Check if image filenames in post content match files exactly');
  }
}

function createTestPost() {
  console.log('🧪 Creating test post with image...');
  
  // Create a simple test image (1x1 red pixel)
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 1, 1);
  const testImageData = canvas.toDataURL('image/png');
  
  const testFilename = 'test123.png';
  const testPost = {
    id: 'test-' + Date.now(),
    title: {
      en: 'Test Post with Image',
      lt: 'Testinis įrašas su paveiksliuku',
      fr: 'Article de test avec image'
    },
    content: {
      en: `This is a test post.\n\n![Test Image](${testFilename})\n\nEnd of test.`,
      lt: `Tai testinis įrašas.\n\n![Testinis paveiksliukas](${testFilename})\n\nTestas baigtas.`,
      fr: `Ceci est un article de test.\n\n![Image de test](${testFilename})\n\nFin du test.`
    },
    excerpt: {
      en: 'A test post to verify image functionality',
      lt: 'Testinis įrašas patikrinti paveiksliukų veikimą',
      fr: 'Un article de test pour vérifier la fonctionnalité des images'
    },
    category: 'test',
    publishDate: new Date().toISOString(),
    readTime: 1,
    uploadedFiles: {
      [testFilename]: testImageData
    }
  };
  
  // Save to localStorage
  const posts = JSON.parse(localStorage.getItem('blog-posts') || '[]');
  posts.push(testPost);
  localStorage.setItem('blog-posts', JSON.stringify(posts));
  
  // Save file to blog-files
  const files = JSON.parse(localStorage.getItem('blog-files') || '{}');
  files[testFilename] = testImageData;
  localStorage.setItem('blog-files', JSON.stringify(files));
  
  console.log('✅ Test post created successfully!');
  console.log('🔄 Refresh the page and check the Blog section');
  console.log(`📝 Post ID: ${testPost.id}`);
  console.log(`🖼️  Image filename: ${testFilename}`);
}

// Auto-run debug when script is pasted
console.log('🚀 Image Debug Tools Loaded!');
console.log('📋 Available commands:');
console.log('   debugImageSystem() - Inspect current storage state');
console.log('   createTestPost() - Create a test post with image');
console.log('');
console.log('▶️  Running initial debug...');
debugImageSystem();
