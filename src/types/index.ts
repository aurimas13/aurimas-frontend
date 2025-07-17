export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'molecule-to-machine' | 'grace-to-life' | 'transcend-loneliness' | 'story-time';
  publishedAt: string;
  readTime: number;
  isPremium: boolean;
  tags: string[];
  author: string;
  status: 'draft' | 'published';
}

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