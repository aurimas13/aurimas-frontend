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
  
  // Return empty array - no sample posts
  return [];
};
