/**
 * Blog Category Selection Test Script
 * 
 * This script creates test posts for each blog category to verify the new
 * blog selection functionality works correctly.
 */

function createTestPostsForAllCategories() {
  console.log('🌍 === BLOG CATEGORY SELECTION TEST ===');
  
  // Clear any existing test posts
  const allPosts = JSON.parse(localStorage.getItem('blog-posts') || '[]');
  const nonTestPosts = allPosts.filter(post => !post.id.startsWith('test-category-'));
  localStorage.setItem('blog-posts', JSON.stringify(nonTestPosts));
  
  console.log('🧹 Cleared existing test posts');
  
  // Create test posts for each category
  const categories = [
    {
      key: 'molecule-to-machine',
      title: 'Test: Molecule To Machine Post',
      content: 'This is a test post for the Molecule To Machine blog category. It should appear when you select this blog.',
      language: 'en'
    },
    {
      key: 'grace-to-life',
      title: 'Test: From Grace To Life Post',
      content: 'This is a test post for the From Grace To Life blog category. This blog supports multiple languages.',
      language: 'en,lt,fr'
    },
    {
      key: 'transcend-loneliness',
      title: 'Test: Transcend Loneliness Post',
      content: 'This is a test post for the Transcend Loneliness blog category. Early posts in EN & LT, later ones in all three.',
      language: 'en,lt'
    }
    // Note: Not creating for 'other-story-time' to test "Coming Soon" functionality
  ];
  
  const testPosts = categories.map((cat, index) => ({
    id: `test-category-${cat.key}-${Date.now() + index}`,
    title: cat.title,
    subtitle: `Testing category: ${cat.key}`,
    excerpt: `This post tests the blog category selection for ${cat.key}`,
    content: cat.content,
    category: cat.key,
    publishedAt: new Date().toISOString(),
    readTime: 2,
    isPremium: false,
    tags: ['Test', 'Category', cat.key],
    author: 'Aurimas',
    status: 'published',
    language: cat.language,
    uploadedFiles: []
  }));
  
  // Save to localStorage
  const updatedPosts = [...nonTestPosts, ...testPosts];
  localStorage.setItem('blog-posts', JSON.stringify(updatedPosts));
  
  console.log('✅ Created test posts for categories:');
  testPosts.forEach(post => {
    console.log(`  📝 ${post.category}: "${post.title}"`);
    console.log(`     Language: ${post.language}`);
  });
  
  console.log('');
  console.log('🔍 === TEST INSTRUCTIONS ===');
  console.log('1. 🔄 Refresh the page');
  console.log('2. 🏠 Navigate to Blog section');
  console.log('3. 🎯 Click "View All Posts" button');
  console.log('4. 👀 Verify you see blog category selection screen with:');
  console.log('   - 4 blog category cards');
  console.log('   - Post counts for each category');
  console.log('   - Language information');
  console.log('   - Links to original Substack');
  console.log('5. 📖 Click on categories with posts (should show posts)');
  console.log('6. 🚀 Click on "Other Story Time" (should show "Coming Soon")');
  console.log('7. 🔙 Test back navigation between views');
  
  console.log('');
  console.log('🎯 Expected behavior:');
  console.log('  - Molecule To Machine: 1 post (EN only)');
  console.log('  - From Grace To Life: 1 post (EN/LT/FR flags)'); 
  console.log('  - Transcend Loneliness: 1 post (EN/LT flags)');
  console.log('  - Other Story Time: Coming Soon page with newsletter signup');
  
  return {
    totalTestPosts: testPosts.length,
    categories: categories.map(c => c.key),
    comingSoonCategory: 'other-story-time'
  };
}

function cleanupCategoryTestPosts() {
  console.log('🧹 Cleaning up category test posts...');
  const allPosts = JSON.parse(localStorage.getItem('blog-posts') || '[]');
  const nonTestPosts = allPosts.filter(post => !post.id.startsWith('test-category-'));
  localStorage.setItem('blog-posts', JSON.stringify(nonTestPosts));
  console.log(`✅ Removed ${allPosts.length - nonTestPosts.length} test posts`);
  console.log('🔄 Refresh page to see changes');
}

function verifyBlogCategories() {
  console.log('🔍 === BLOG CATEGORY VERIFICATION ===');
  
  const posts = JSON.parse(localStorage.getItem('blog-posts') || '[]');
  const categories = ['molecule-to-machine', 'grace-to-life', 'transcend-loneliness', 'other-story-time'];
  
  console.log('📊 Posts per category:');
  categories.forEach(category => {
    const categoryPosts = posts.filter(post => post.category === category && post.status === 'published');
    console.log(`  ${category}: ${categoryPosts.length} posts`);
    
    if (categoryPosts.length > 0) {
      categoryPosts.forEach(post => {
        console.log(`    - "${post.title}" (${post.language || 'no language'})`);
      });
    }
  });
  
  const totalPublished = posts.filter(post => post.status === 'published').length;
  console.log(`📝 Total published posts: ${totalPublished}`);
  
  return {
    totalPosts: totalPublished,
    categoryCounts: categories.reduce((acc, cat) => {
      acc[cat] = posts.filter(post => post.category === cat && post.status === 'published').length;
      return acc;
    }, {})
  };
}

// Auto-run initial verification
console.log('🚀 Blog Category Selection Test Suite Loaded!');
console.log('📋 Available commands:');
console.log('   createTestPostsForAllCategories() - Create test posts for category testing');
console.log('   cleanupCategoryTestPosts() - Remove all category test posts');
console.log('   verifyBlogCategories() - Check current post distribution');
console.log('');
console.log('▶️ Running initial verification...');
verifyBlogCategories();
