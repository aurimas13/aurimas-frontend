import { BlogPost } from '../types';

export const blogPostTemplates: BlogPost[] = [
  {
    id: 'molecule-to-machine-template',
    title: 'Molecule To Machine: Prototype Issue',
    subtitle: 'Exploring the thread between chemistry, compute, and quiet reflection',
    excerpt: 'A compact Molecule To Machine sample entry highlighting responsible AI, scientific discovery, and the human moments that tie them together.',
    content: `# Molecule To Machine

Welcome to a lighter template that keeps the focus on the ideas underpinning Molecule To Machine.

## Why This Matters

- Map molecular insights to clinically safe AI tooling.
- Document how first-principles chemistry research shapes emerging computation.
- Hold space for faith-informed reflections without losing scientific rigor.

## Signals Worth Following

1. Transparent browser builds like Comet that prioritize trust.
2. Laboratory copilots that acknowledge physician oversight.
3. Student robotics kits that democratize quadruped design.

## Slice Of Life

> "Simplicity arrives when you cut away the noise and sit with the signal." — personal lab notes, Jul 2025

## Keep Exploring

Subscribe for full-length issues, Substack essays, and newsletter drops as the long-form story unfolds.

🧪 Molecule → 🤖 Machine → 💛 Humanity,

A.`,
    category: 'molecule-to-machine',
    publishedAt: new Date().toISOString(),
    readTime: 5,
    isPremium: false,
    tags: ['Molecule To Machine', 'AI', 'Science', 'Newsletter'],
    author: 'Aurimas',
    status: 'draft',
    language: 'en',
    insights: {
      title: 'Creator Note:',
      content: 'Keep the editorial lean so every future essay starts from the same intentional foundation.',
      emoji: '🧭'
    },
    featuredImage: '',
    uploadedFiles: []
  }
];

export const getBlogPostTemplates = () => blogPostTemplates;

export const loadSamplePosts = () => {
  const existingPosts = localStorage.getItem('blog-posts');
  if (existingPosts) {
    try {
      return JSON.parse(existingPosts);
    } catch (error) {
      console.error('Error parsing stored posts:', error);
    }
  }
  
  // If no posts exist, restore the user's published posts that were lost
  const restoredPosts: BlogPost[] = [
    {
      id: 'molecule-to-machine-55',
      title: 'Molecule To Machine #55',
      subtitle: 'Latest insights into molecular engineering and biotechnology',
      excerpt: 'Exploring the fascinating world of molecular engineering and its applications in modern biotechnology.',
      content: `# Molecule To Machine #55

Welcome to the 55th edition of Molecule To Machine, where we explore the fascinating intersection of molecular engineering and biotechnology.

## Overview

This edition covers the latest developments in molecular engineering, from basic research to practical applications.

## Key Topics

- Molecular assembly techniques
- Biotechnology applications
- Recent research findings
- Future directions

## Conclusion

The field continues to evolve rapidly with new discoveries and applications emerging regularly.

*Stay tuned for more insights in future editions.*`,
      category: 'molecule-to-machine',
      publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      readTime: 5,
      isPremium: false,
      tags: ['biotechnology', 'molecular-engineering', 'science'],
      author: 'Aurimas',
      status: 'published' as const,
    },
    {
      id: 'from-grace-to-life-19',
      title: 'From Grace To Life #19',
      subtitle: 'A journey of contemplation and spiritual reflection',
      excerpt: 'The nineteenth edition of From Grace To Life - sharing wisdom, peace, and contemplative insights.',
      content: `# From Grace To Life #19

Welcome to the nineteenth edition of "From Grace To Life" - a journey of quiet contemplations and spiritual reflections.

## This Week's Focus

In this edition, we explore themes of:

- **Wisdom in Daily Life**: Finding profound meaning in simple moments
- **Peace and Tranquility**: Cultivating inner calm in a busy world  
- **Compassionate Listening**: The art of truly hearing others
- **Grace in Action**: Living with intentional kindness

## Daily Reflections

Each day brings new opportunities for growth and understanding. Through careful observation and mindful presence, we can discover extraordinary insights in ordinary moments.

## Community and Connection

This journey is enriched by sharing and community. Your reflections and insights contribute to the collective wisdom we build together.

## Closing Thoughts

May this edition bring you moments of peace and inspiration in your own spiritual journey.

*With gratitude and blessings.*`,
      category: 'grace-to-life', 
      publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      readTime: 7,
      isPremium: false,
      tags: ['spirituality', 'contemplation', 'wisdom', 'peace'],
      author: 'Aurimas',
      status: 'published' as const,
    }
  ];

  // Save these restored posts to localStorage
  try {
    localStorage.setItem('blog-posts', JSON.stringify(restoredPosts));
    console.log('Restored missing blog posts to localStorage');
  } catch (error) {
    console.error('Error saving restored posts:', error);
  }

  return restoredPosts;
};
