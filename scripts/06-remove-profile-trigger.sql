-- Remove the profile creation trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Clean up any existing demo profile that might conflict
DELETE FROM profiles WHERE id = '00000000-0000-0000-0000-000000000000';
DELETE FROM links WHERE user_id = '00000000-0000-0000-0000-000000000000';
