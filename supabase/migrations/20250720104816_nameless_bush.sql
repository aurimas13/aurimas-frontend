/*
  # Fix RLS policies for blog posts

  1. Security Updates
    - Add policy for anonymous users to insert blog posts
    - Add policy for anonymous users to update blog posts
    - Keep existing read policies for public access
  
  2. Changes
    - Allow INSERT operations for anon role
    - Allow UPDATE operations for anon role
    - Maintain existing SELECT policies
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anon can insert blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Anon can update blog posts" ON blog_posts;

-- Allow anonymous users to insert blog posts
CREATE POLICY "Anon can insert blog posts"
  ON blog_posts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to update blog posts
CREATE POLICY "Anon can update blog posts"
  ON blog_posts
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to delete blog posts
CREATE POLICY "Anon can delete blog posts"
  ON blog_posts
  FOR DELETE
  TO anon
  USING (true);