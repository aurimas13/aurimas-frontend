#!/usr/bin/env node

// Test script to verify flag emojis are correctly displayed
console.log('🧪 Testing Flag Emojis Display');
console.log('================================');

console.log('🇬🇧 English (British) Flag - Should display as flag');
console.log('🇱🇹 Lithuanian Flag - Should display as flag');
console.log('🇫🇷 French Flag - Should display as flag');

console.log('\n🔍 Testing language mapping:');
const languages = ['en', 'lt', 'fr'];
languages.forEach(lang => {
  const flagEmoji = lang.trim() === 'en' ? '🇬🇧' : lang.trim() === 'lt' ? '🇱🇹' : '🇫🇷';
  console.log(`${lang.toUpperCase()}: ${flagEmoji}`);
});

console.log('\n✅ All flag emojis should display correctly above.');
console.log('If you see question marks (??) instead of flags, there may be an encoding issue.');
