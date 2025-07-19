import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Only create client if both URL and key are provided
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Blog post types for future Supabase integration
export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  published_at: string
  author: string
  category: string
  tags: string[]
  is_premium: boolean
}

// Future function to fetch blog posts from Supabase
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  if (!supabase) {
    console.log('Supabase not configured, using local storage')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}