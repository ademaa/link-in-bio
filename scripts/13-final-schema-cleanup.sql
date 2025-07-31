-- Ensure consistent schema matching requirements exactly
-- Clean up any inconsistencies and ensure proper field names

-- Update links table to use 'position' consistently (as per requirements)
ALTER TABLE links DROP COLUMN IF EXISTS order_index;

-- Ensure all required columns exist with correct names
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE profiles DROP COLUMN IF EXISTS full_name;

-- Update any existing full_name data to display_name
UPDATE profiles 
SET display_name = COALESCE(display_name, 
  (SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE auth.users.id = profiles.id)
)
WHERE display_name IS NULL;

-- Ensure position column exists and is properly indexed
ALTER TABLE links ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_links_user_position ON links(user_id, position);

-- Update any links that don't have proper position values
UPDATE links 
SET position = subquery.row_num - 1
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) as row_num
  FROM links
  WHERE position IS NULL OR position = 0
) AS subquery
WHERE links.id = subquery.id;

-- Ensure RLS policies are correctly named and implemented
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Links policies
DROP POLICY IF EXISTS "Public links are viewable by everyone" ON links;
DROP POLICY IF EXISTS "Users can insert their own links" ON links;
DROP POLICY IF EXISTS "Users can update their own links" ON links;
DROP POLICY IF EXISTS "Users can delete their own links" ON links;

CREATE POLICY "links_select_policy" ON links
  FOR SELECT USING (true);

CREATE POLICY "links_insert_policy" ON links
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "links_update_policy" ON links
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "links_delete_policy" ON links
  FOR DELETE USING (auth.uid() = user_id);
