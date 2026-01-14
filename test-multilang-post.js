/**
 * Test script to create a multilingual blog post
 * Open browser console and paste this script to test the new language flag functionality
 */

function createMultilingualTestPost() {
  console.log('🌍 Creating multilingual test post...');
  
  const testPost = {
    id: 'test-multilang-' + Date.now(),
    title: 'Test Post: Multilingual Support 🌍',
    subtitle: 'Testing all three language flags display',
    excerpt: 'This post tests the new language flag display functionality showing EN, LT, and FR flags together.',
    content: `# Multilingual Test Post 🌍

This is a test post to verify that all language flags are displayed correctly.

## Language Support
- **English** 🇬🇧
- **Lithuanian** 🇱🇹  
- **French** 🇫🇷

This post should show all three flags in the blog section.`,
    category: 'molecule-to-machine',
    publishedAt: new Date().toISOString(),
    readTime: 2,
    isPremium: false,
    tags: ['Test', 'Multilingual', 'Flags'],
    author: 'Aurimas',
    status: 'published',
    language: 'en,lt,fr', // All three languages
    insights: {
      title: 'Test Insight:',
      content: 'This post demonstrates the new multilingual flag display feature.',
      emoji: '🌍'
    },
    uploadedFiles: []
  };
  
  // Save to localStorage
  const posts = JSON.parse(localStorage.getItem('blog-posts') || '[]');
  posts.push(testPost);
  localStorage.setItem('blog-posts', JSON.stringify(posts));
  
  console.log('✅ Multilingual test post created!');
  console.log(`📝 Post ID: ${testPost.id}`);
  console.log(`🌍 Languages: ${testPost.language}`);
  console.log('🔄 Refresh the page and check the Blog section');
  
  return testPost;
}

function createEnglishOnlyPost() {
  console.log('🇬🇧 Creating English-only test post...');
  
  const testPost = {
    id: 'test-en-only-' + Date.now(),
    title: 'English Only Post',
    subtitle: 'Testing single language flag display',
    excerpt: 'This post tests the English-only flag display.',
    content: `# English Only Post 🇬🇧

This post should only show the English flag.`,
    category: 'grace-to-life',
    publishedAt: new Date().toISOString(),
    readTime: 1,
    isPremium: false,
    tags: ['Test', 'English'],
    author: 'Aurimas',
    status: 'published',
    language: 'en',
    uploadedFiles: []
  };
  
  const posts = JSON.parse(localStorage.getItem('blog-posts') || '[]');
  posts.push(testPost);
  localStorage.setItem('blog-posts', JSON.stringify(posts));
  
  console.log('✅ English-only test post created!');
  return testPost;
}

function createLithuanianFrenchPost() {
  console.log('🇱🇹🇫🇷 Creating Lithuanian + French test post...');
  
  const testPost = {
    id: 'test-lt-fr-' + Date.now(),
    title: 'Lithuanian & French Post',
    subtitle: 'Testing dual language flag display',
    excerpt: 'This post tests the Lithuanian and French flag display.',
    content: `# Lithuanian & French Post 🇱🇹🇫🇷

This post should show both Lithuanian and French flags.

Šis įrašas turėtų rodyti ir lietuvišką, ir prancūzišką vėliavą.

Ce post devrait afficher les drapeaux lituanien et français.`,
    category: 'transcend-loneliness',
    publishedAt: new Date().toISOString(),
    readTime: 2,
    isPremium: false,
    tags: ['Test', 'Lithuanian', 'French'],
    author: 'Aurimas',
    status: 'published',
    language: 'lt,fr',
    uploadedFiles: []
  };
  
  const posts = JSON.parse(localStorage.getItem('blog-posts') || '[]');
  posts.push(testPost);
  localStorage.setItem('blog-posts', JSON.stringify(posts));
  
  console.log('✅ Lithuanian + French test post created!');
  return testPost;
}

// Auto-create test posts
console.log('🚀 Multilingual Flag Test Script Loaded!');
console.log('📋 Available commands:');
console.log('   createMultilingualTestPost() - Create post with all three languages');
console.log('   createEnglishOnlyPost() - Create English-only post');
console.log('   createLithuanianFrenchPost() - Create Lithuanian + French post');
console.log('');
console.log('▶️  Creating test posts automatically...');

createMultilingualTestPost();
createEnglishOnlyPost();
createLithuanianFrenchPost();

console.log('');
console.log('🎯 All test posts created! Refresh the page to see the new language flag display.');
