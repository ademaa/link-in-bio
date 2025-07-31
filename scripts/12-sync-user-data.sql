-- Function to sync user metadata with profiles table
CREATE OR REPLACE FUNCTION sync_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Update profiles table when user metadata changes
  UPDATE profiles 
  SET 
    display_name = COALESCE(NEW.raw_user_meta_data->>'full_name', display_name),
    bio = COALESCE(NEW.raw_user_meta_data->>'bio', bio),
    avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', avatar_url),
    updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to sync user metadata changes to profiles
DROP TRIGGER IF EXISTS sync_user_profile_trigger ON auth.users;
CREATE TRIGGER sync_user_profile_trigger
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data)
  EXECUTE FUNCTION sync_user_profile();

-- Update existing profiles with user metadata if they exist
UPDATE profiles 
SET 
  display_name = COALESCE(auth_users.raw_user_meta_data->>'full_name', profiles.display_name),
  bio = COALESCE(auth_users.raw_user_meta_data->>'bio', profiles.bio),
  avatar_url = COALESCE(auth_users.raw_user_meta_data->>'avatar_url', profiles.avatar_url),
  updated_at = NOW()
FROM auth.users AS auth_users
WHERE profiles.id = auth_users.id
  AND (
    profiles.display_name IS NULL OR 
    profiles.bio IS NULL OR 
    profiles.avatar_url IS NULL
  );
