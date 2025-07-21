/*
  # Fix blog posts permissions

  1. Security
    - Drop existing restrictive policies
    - Add permissive policies for anon users to manage blog posts
    - Enable full CRUD operations for blog management
*/

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Public can read published posts" ON blog_posts;
DROP POLICY IF EXISTS "Anon can insert blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Anon can update blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Anon can delete blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can manage posts" ON blog_posts;
DROP POLICY IF EXISTS "Service role can manage all posts" ON blog_posts;

-- Create new permissive policies for blog management
CREATE POLICY "Allow all operations for anon users"
  ON blog_posts
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations for service role"
  ON blog_posts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);