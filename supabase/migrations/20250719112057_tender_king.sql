/*
  # Create transactions tracking table

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `stripe_session_id` (text, unique)
      - `customer_email` (text)
      - `amount` (integer, in cents)
      - `currency` (text)
      - `payment_type` (text: 'subscription' or 'one-time')
      - `status` (text: 'pending', 'completed', 'failed', 'cancelled')
      - `stripe_customer_id` (text, nullable)
      - `subscription_id` (text, nullable for subscriptions)
      - `metadata` (jsonb, for additional data)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `transactions` table
    - Add policy for authenticated users to read their own transactions
    - Add policy for service role to manage all transactions
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id text UNIQUE,
  customer_email text NOT NULL,
  amount integer NOT NULL, -- amount in cents
  currency text NOT NULL DEFAULT 'eur',
  payment_type text NOT NULL CHECK (payment_type IN ('subscription', 'one-time')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  stripe_customer_id text,
  subscription_id text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own transactions
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (customer_email = auth.jwt() ->> 'email');

-- Policy for service role to manage all transactions
CREATE POLICY "Service role can manage all transactions"
  ON transactions
  FOR ALL
  TO service_role
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_customer_email ON transactions(customer_email);
CREATE INDEX IF NOT EXISTS idx_transactions_stripe_session_id ON transactions(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);