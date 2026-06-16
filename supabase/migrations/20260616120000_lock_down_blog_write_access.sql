/*
  # Lock down blog write access (security hardening)

  ## Why
  Earlier migrations granted the `anon` role INSERT / UPDATE / DELETE on
  `blog_posts` with `WITH CHECK (true)`. Because the Supabase anon key ships in
  the public client bundle, this allowed ANY visitor to create, modify or delete
  posts — and, since blog content is rendered with `dangerouslySetInnerHTML`,
  to store persistent XSS that executes in every reader's browser.

  ## What this does
  - Removes all anonymous write policies.
  - Keeps public READ access to published content only.
  - Restricts INSERT / UPDATE / DELETE to authenticated users (the site owner,
    signed in via Supabase Auth). For a single-author blog you may further scope
    this to a specific UID using auth.uid().

  After applying this migration, the BlogManager must authenticate through
  Supabase Auth (or write through a trusted backend using the service-role key)
  rather than relying on the anon key.
*/

-- 1. Remove the permissive anonymous write policies.
DROP POLICY IF EXISTS "Anon can insert blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Anon can update blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Anon can delete blog posts" ON blog_posts;

-- 2. Make sure RLS is on.
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- 3. Public read access (published posts only). Adjust the predicate if your
--    schema uses a different "published" representation.
DROP POLICY IF EXISTS "Public can read published posts" ON blog_posts;
CREATE POLICY "Public can read published posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- 4. Authenticated owner can read everything (drafts/scheduled included).
DROP POLICY IF EXISTS "Authenticated can read all posts" ON blog_posts;
CREATE POLICY "Authenticated can read all posts"
  ON blog_posts
  FOR SELECT
  TO authenticated
  USING (true);

-- 5. Only authenticated users may write.
DROP POLICY IF EXISTS "Authenticated can insert posts" ON blog_posts;
CREATE POLICY "Authenticated can insert posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update posts" ON blog_posts;
CREATE POLICY "Authenticated can update posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can delete posts" ON blog_posts;
CREATE POLICY "Authenticated can delete posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (true);
