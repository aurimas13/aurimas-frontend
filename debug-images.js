/**
 * Debug Image System
 * Run this in browser console to diagnose image issues
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
    console.log('   3. Upload an image');
    console.log('   4. Save the post');
    console.log('   5. Set status to "Published"');
    return;
  }
  
  posts.forEach((post, i) => {
    console.log(`\n📄 Post ${i + 1}: "${post.title}"`);
    console.log(`   Status: ${post.status}`);
    console.log(`   UploadedFiles: ${post.uploadedFiles?.length || 0}`);
    
    if (post.uploadedFiles && post.uploadedFiles.length > 0) {
      post.uploadedFiles.forEach((file, j) => {
        console.log(`     File ${j + 1}: ${file.name} (${file.originalName})`);
        const hasStoredData = files[file.name] ? '✅' : '❌';
        console.log(`       In localStorage: ${hasStoredData}`);
      });
    }
    
    const imageMatches = post.content.match(/!\[[^\]]*\]\([^)]+\)/g);
    if (imageMatches) {
      console.log(`   Images in content: ${imageMatches.length}`);
      imageMatches.forEach((match, k) => {
        const src = match.match(/\]\(([^)]+)\)/)?.[1];
        const hasStoredData = files[src] ? '✅' : '❌';
        console.log(`     Image ${k + 1}: ${src} ${hasStoredData}`);
      });
    }
  });
  
  console.log('\n🗂️ Files in localStorage:');
  Object.keys(files).forEach(key => {
    const size = files[key].length;
    console.log(`  ${key}: ${size} chars (${(size/1024).toFixed(1)}KB)`);
  });
  
  console.log('\n🎯 Next steps:');
  console.log('   1. If no files in localStorage: Upload images in BlogManager');
  console.log('   2. If files exist but images not showing: Check BlogSection image resolution');
  console.log('   3. If published post shows "Image not found": Issue with BlogSection component');
}

// Auto-run on page load
debugImageSystem();
