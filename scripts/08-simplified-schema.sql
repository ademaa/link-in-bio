-- Simplified schema - only links table needed
-- Profiles are handled by Supabase Auth user_metadata

-- Create links table if it doesn't exist
CREATE TABLE IF NOT EXISTS links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add order_index column if it doesn't exist
ALTER TABLE links ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Enable RLS on links table
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Links policies  
DROP POLICY IF EXISTS "Public links are viewable by everyone" ON links;
DROP POLICY IF EXISTS "Users can insert their own links" ON links;
DROP POLICY IF EXISTS "Users can update their own links" ON links;
DROP POLICY IF EXISTS "Users can delete their own links" ON links;

CREATE POLICY "Public links are viewable by everyone" ON links
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own links" ON links
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own links" ON links
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own links" ON links
  FOR DELETE USING (auth.uid() = user_id);

-- Drop the profiles table if it exists (we're using Supabase Auth instead)
DROP TABLE IF EXISTS profiles CASCADE;
