/*
  # Create blog posts table

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `excerpt` (text, nullable)
      - `content` (text)
      - `category` (text)
      - `published_at` (timestamp, nullable)
      - `scheduled_at` (timestamp, nullable)
      - `read_time` (integer)
      - `is_premium` (boolean)
      - `tags` (text array)
      - `author` (text)
      - `status` (text: 'draft', 'published', 'scheduled')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `blog_posts` table
    - Add policy for public to read published posts
    - Add policy for authenticated users to manage posts

  3. Indexes
    - Index on status for filtering
    - Index on published_at for sorting
    - Index on category for filtering
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text,
  content text NOT NULL,
  category text NOT NULL,
  published_at timestamptz,
  scheduled_at timestamptz,
  read_time integer DEFAULT 0,
  is_premium boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  author text NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy for public to read published posts
CREATE POLICY "Public can read published posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Policy for authenticated users to manage all posts
CREATE POLICY "Authenticated users can manage posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true);

-- Policy for service role to manage all posts
CREATE POLICY "Service role can manage all posts"
  ON blog_posts
  FOR ALL
  TO service_role
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();