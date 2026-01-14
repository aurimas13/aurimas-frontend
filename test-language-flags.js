/**
 * Comprehensive Language Flag Testing Script
 * 
 * This script verifies that all language flag functionality is working correctly
 * across the entire blog system. Run this in the browser console.
 */

function testLanguageFlagSystem() {
  console.log('🌍 === COMPREHENSIVE LANGUAGE FLAG TEST ===');
  
  // Clear any existing test posts
  const allPosts = JSON.parse(localStorage.getItem('blog-posts') || '[]');
  const nonTestPosts = allPosts.filter(post => !post.id.startsWith('test-'));
  localStorage.setItem('blog-posts', JSON.stringify(nonTestPosts));
  
  console.log('🧹 Cleared existing test posts');
  
  // Test Case 1: Single Language Posts
  const singleLangTests = [
    {
      id: 'test-single-en-' + Date.now(),
      title: 'Test: English Only 🇬🇧',
      excerpt: 'Testing single English flag display',
      content: 'This post should show only the British flag 🇬🇧',
      language: 'en',
      expectedFlags: ['🇬🇧 EN']
    },
    {
      id: 'test-single-lt-' + Date.now() + 1,
      title: 'Test: Lithuanian Only 🇱🇹',
      excerpt: 'Testing single Lithuanian flag display',
      content: 'Šis įrašas turėtų rodyti tik lietuvišką vėliavą 🇱🇹',
      language: 'lt',
      expectedFlags: ['🇱🇹 LT']
    },
    {
      id: 'test-single-fr-' + Date.now() + 2,
      title: 'Test: French Only 🇫🇷',
      excerpt: 'Testing single French flag display',
      content: 'Ce post devrait afficher seulement le drapeau français 🇫🇷',
      language: 'fr',
      expectedFlags: ['🇫🇷 FR']
    }
  ];
  
  // Test Case 2: Multiple Language Posts
  const multiLangTests = [
    {
      id: 'test-multi-en-lt-' + Date.now() + 10,
      title: 'Test: English + Lithuanian 🇬🇧🇱🇹',
      excerpt: 'Testing dual flag display',
      content: 'This post should show English and Lithuanian flags',
      language: 'en,lt',
      expectedFlags: ['🇬🇧 EN', '🇱🇹 LT']
    },
    {
      id: 'test-multi-en-fr-' + Date.now() + 11,
      title: 'Test: English + French 🇬🇧🇫🇷',
      excerpt: 'Testing dual flag display',
      content: 'This post should show English and French flags',
      language: 'en,fr',
      expectedFlags: ['🇬🇧 EN', '🇫🇷 FR']
    },
    {
      id: 'test-multi-lt-fr-' + Date.now() + 12,
      title: 'Test: Lithuanian + French 🇱🇹🇫🇷',
      excerpt: 'Testing dual flag display',
      content: 'This post should show Lithuanian and French flags',
      language: 'lt,fr',
      expectedFlags: ['🇱🇹 LT', '🇫🇷 FR']
    },
    {
      id: 'test-multi-all-' + Date.now() + 13,
      title: 'Test: All Languages 🇬🇧🇱🇹🇫🇷',
      excerpt: 'Testing triple flag display',
      content: 'This post should show all three flags',
      language: 'en,lt,fr',
      expectedFlags: ['🇬🇧 EN', '🇱🇹 LT', '🇫🇷 FR']
    }
  ];
  
  // Create all test posts
  const allTestPosts = [...singleLangTests, ...multiLangTests].map(test => ({
    ...test,
    category: 'molecule-to-machine',
    publishedAt: new Date().toISOString(),
    readTime: 1,
    isPremium: false,
    tags: ['Test', 'Flags', 'Languages'],
    author: 'Aurimas',
    status: 'published',
    subtitle: `Expected flags: ${test.expectedFlags.join(', ')}`,
    uploadedFiles: []
  }));
  
  // Save to localStorage
  const updatedPosts = [...nonTestPosts, ...allTestPosts];
  localStorage.setItem('blog-posts', JSON.stringify(updatedPosts));
  
  console.log('✅ Created test posts:');
  allTestPosts.forEach(post => {
    console.log(`  📝 ${post.title}`);
    console.log(`     Language: ${post.language}`);
    console.log(`     Expected: ${post.expectedFlags.join(', ')}`);
  });
  
  console.log('');
  console.log('🔍 === TEST INSTRUCTIONS ===');
  console.log('1. 🔄 Refresh the page');
  console.log('2. 🏠 Navigate to Blog section');
  console.log('3. 👀 Verify each post shows the correct flags');
  console.log('4. 🎯 Check that:');
  console.log('   - Single language posts show 1 flag');
  console.log('   - Dual language posts show 2 flags');
  console.log('   - Triple language posts show 3 flags');
  console.log('   - English flag is 🇬🇧 (British) not 🇺🇸 (US)');
  console.log('   - Lithuanian flag is 🇱🇹');
  console.log('   - French flag is 🇫🇷');
  
  console.log('');
  console.log('🎨 === VISUAL VERIFICATION ===');
  console.log('Each post should display flags like:');
  console.log('  Single: [🇬🇧 EN] or [🇱🇹 LT] or [🇫🇷 FR]');
  console.log('  Dual:   [🇬🇧 EN] [🇱🇹 LT] or [🇬🇧 EN] [🇫🇷 FR] etc.');
  console.log('  Triple: [🇬🇧 EN] [🇱🇹 LT] [🇫🇷 FR]');
  
  console.log('');
  console.log('🧪 Test posts ready! Go check the Blog section now.');
  
  return {
    totalTests: allTestPosts.length,
    singleLanguageTests: singleLangTests.length,
    multiLanguageTests: multiLangTests.length,
    testPosts: allTestPosts
  };
}

function cleanupTestPosts() {
  console.log('🧹 Cleaning up test posts...');
  const allPosts = JSON.parse(localStorage.getItem('blog-posts') || '[]');
  const nonTestPosts = allPosts.filter(post => !post.id.startsWith('test-'));
  localStorage.setItem('blog-posts', JSON.stringify(nonTestPosts));
  console.log(`✅ Removed ${allPosts.length - nonTestPosts.length} test posts`);
  console.log('🔄 Refresh page to see changes');
}

function verifyFlagImplementation() {
  console.log('🔍 === FLAG IMPLEMENTATION VERIFICATION ===');
  
  // Check if British flag is used instead of US flag
  const hasUSFlag = document.body.innerHTML.includes('🇺🇸');
  const hasBritishFlag = document.body.innerHTML.includes('🇬🇧');
  
  console.log(`🇺🇸 US Flag found: ${hasUSFlag ? '❌ YES (should be removed)' : '✅ NO (correct)'}`);
  console.log(`🇬🇧 British Flag found: ${hasBritishFlag ? '✅ YES (correct)' : '❌ NO (should be present)'}`);
  
  // Check if multiple flags can be displayed
  const flagContainers = document.querySelectorAll('.bg-blue-100.text-blue-800');
  console.log(`📊 Flag containers found: ${flagContainers.length}`);
  
  if (flagContainers.length > 0) {
    console.log('🏷️ Flag display examples:');
    flagContainers.forEach((container, index) => {
      console.log(`  ${index + 1}: "${container.textContent}"`);
    });
  }
  
  return {
    hasUSFlag,
    hasBritishFlag,
    flagContainerCount: flagContainers.length
  };
}

// Auto-run initial verification
console.log('🚀 Language Flag Test Suite Loaded!');
console.log('📋 Available commands:');
console.log('   testLanguageFlagSystem() - Create comprehensive test posts');
console.log('   cleanupTestPosts() - Remove all test posts');
console.log('   verifyFlagImplementation() - Check current flag display');
console.log('');
console.log('▶️ Running initial verification...');
verifyFlagImplementation();
