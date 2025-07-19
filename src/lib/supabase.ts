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