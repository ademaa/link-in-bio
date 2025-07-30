-- Insert demo profile
INSERT INTO profiles (id, username, full_name, bio, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'demo',
  'Demo User', 
  'This is a demo profile showing how your LinkInBio page will look. Sign up to create your own!',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  bio = EXCLUDED.bio,
  updated_at = NOW();

-- Insert demo links
INSERT INTO links (id, user_id, title, url, order_index, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'My Website', 'https://example.com', 0, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'Twitter', 'https://twitter.com/username', 1, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'Instagram', 'https://instagram.com/username', 2, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'LinkedIn', 'https://linkedin.com/in/username', 3, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  url = EXCLUDED.url,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();
