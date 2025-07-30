-- Create demo profile (standalone, not linked to auth.users)
INSERT INTO public.profiles (
  id,
  username,
  display_name,
  bio,
  avatar_url,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'demo',
  'Demo User',
  'This is a demo profile showing how LinkInBio works! 🚀 Create your own profile to get started.',
  '/placeholder.svg?height=128&width=128&text=Demo',
  NOW(),
  NOW()
) ON CONFLICT (username) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = NOW();

-- Create demo links
INSERT INTO public.links (
    user_id,
    title,
    url,
    position,
    created_at,
    updated_at
) VALUES 
    ('00000000-0000-0000-0000-000000000000', '🌐 My Website', 'https://example.com', 0, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000000', '💻 GitHub Profile', 'https://github.com', 1, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000000', '💼 LinkedIn', 'https://linkedin.com', 2, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000000', '🐦 Twitter', 'https://twitter.com', 3, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000000', '📧 Contact Me', 'mailto:demo@example.com', 4, NOW(), NOW())
ON CONFLICT (user_id, position) DO UPDATE SET
    title = EXCLUDED.title,
    url = EXCLUDED.url,
    updated_at = NOW();
