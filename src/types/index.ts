export interface BlogPost {
  id: string;
<<<<<<< HEAD
  title: LocalizedText | string;
  excerpt: LocalizedText | string;
  content: LocalizedText | string;
  category: 'molecule-to-machine' | 'grace-to-life' | 'transcend-loneliness' | 'other-story-time';
  publishedAt?: string;
  date?: string;
  readTime: LocalizedText | string | number;
  isPremium?: boolean;
  published?: boolean;
=======
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategoryKey;
  publishedAt: string;
  readTime: number;
  isPremium: boolean;
>>>>>>> 699639a006f3aab4478c5b979d20688f310f0efa
  tags: string[];
  author: LocalizedText | string;
  status?: 'draft' | 'published' | 'scheduled';
  featuredImage?: string;
  subtitle?: string;
  language?: 'en' | 'lt' | 'fr' | 'en,lt' | 'en,fr' | 'lt,fr' | 'en,lt,fr';
  insights?: {
    title: string;
    content: string;
    emoji: string;
  };
  uploadedFiles?: {
    id: string;
    name: string;
    originalName: string;
    url: string;
    type: string;
    size: number;
  }[];
  blogEndpoint?: string;
  destinationUrl?: string;
}

export interface LocalizedText {
  en: string;
  lt: string;
  fr: string;
}

export interface BlogCategory {
  title: LocalizedText;
  description: LocalizedText;
  originalUrl: string;
  languages: LocalizedText;
}

export type BlogCategoryKey = 'molecule-to-machine';

export type BlogCategories = Record<BlogCategoryKey, BlogCategory>;

export interface User {
  id: string;
  email: string;
  name: string;
  subscription: 'free' | 'premium';
  subscriptionExpiry?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Language {
  code: 'en' | 'lt' | 'fr';
  name: string;
  flag: string;
}

export interface PaymentOption {
  type: 'subscription' | 'one-time';
  amount: number;
  currency: string;
  duration?: string;
}

export interface Character {
  id: string;
  name: string;
  emoji: string;
  type: 'disney' | 'lotr';
  description: string;
}