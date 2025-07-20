import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Only create client if both URL and key are provided
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  const isConfigured = !!(supabaseUrl && supabaseAnonKey && supabase);
  console.log('Supabase configuration check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    hasClient: !!supabase,
    isConfigured
  });
  return isConfigured;
}

// Blog post types for Supabase
export interface BlogPostDB {
  id: string
  title: string
  excerpt?: string
  content: string
  category: string
  published_at?: string
  scheduled_at?: string
  read_time: number
  is_premium: boolean
  tags: string[]
  author: string
  status: 'draft' | 'published' | 'scheduled'
  created_at: string
  updated_at: string
}

// Create a new blog post
export const createBlogPost = async (post: Omit<BlogPostDB, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPostDB | null> => {
  if (!supabase) {
    console.log('Supabase not configured, cannot save to database');
    return null
  }

  try {
    console.log('Creating blog post in Supabase:', post);
    console.log('Supabase client:', supabase);
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select()
      .single();

    if (error) {
      console.error('Supabase create error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    console.log('Blog post created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating blog post - full error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return null;
  }
}

// Update a blog post
export const updateBlogPost = async (id: string, updates: Partial<BlogPostDB>): Promise<BlogPostDB | null> => {
  if (!supabase) {
    console.log('Supabase not configured, cannot update in database');
    return null
  }

  try {
    console.log('Updating blog post in Supabase:', id, updates);
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }
    console.log('Blog post updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error updating blog post:', error);
    return null;
  }
}

// Get all blog posts
export const getBlogPosts = async (): Promise<BlogPostDB[]> => {
  if (!supabase) {
    console.log('Supabase not configured, cannot fetch from database');
    return [];
  }

  try {
    console.log('Fetching blog posts from Supabase...');
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      throw error;
    }
    console.log('Blog posts fetched successfully:', data?.length || 0, 'posts');
    return data || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// Delete a blog post
export const deleteBlogPost = async (id: string): Promise<boolean> => {
  if (!supabase) {
    console.log('Supabase not configured, cannot delete from database');
    return false;
  }

  try {
    console.log('Deleting blog post from Supabase:', id);
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }
    console.log('Blog post deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return false;
  }
}

// Transaction types for Supabase
export interface Transaction {
  id: string
  stripe_session_id?: string
  customer_email: string
  amount: number
  currency: string
  payment_type: 'subscription' | 'one-time'
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  stripe_customer_id?: string
  subscription_id?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

// Create a new transaction record
export const createTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction | null> => {
  if (!supabase) {
    console.log('Supabase not configured, cannot create transaction');
    return null
  }

  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    return null;
  }
}