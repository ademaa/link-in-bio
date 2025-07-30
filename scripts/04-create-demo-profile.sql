-- First, let's create the demo profile directly in the profiles table
-- without trying to create an auth user (which requires special permissions)

-- Create demo profile
INSERT INTO profiles (
  id,
  username,
  display_name,
  bio,
  avatar_url,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
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
  updated_at = NOW()
RETURNING id;

-- Get the demo profile ID for creating links
-- We'll use a variable to store the ID
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    -- Get or create the demo profile
    INSERT INTO profiles (
        id,
        username,
        display_name,
        bio,
        avatar_url,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
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
        updated_at = NOW()
    RETURNING id INTO demo_user_id;

    -- If no ID was returned (because of conflict), get the existing one
    IF demo_user_id IS NULL THEN
        SELECT id INTO demo_user_id FROM profiles WHERE username = 'demo';
    END IF;

    -- Delete existing demo links to avoid conflicts
    DELETE FROM links WHERE user_id = demo_user_id;

    -- Create demo links
    INSERT INTO links (
        id,
        user_id,
        title,
        url,
        position,
        created_at,
        updated_at
    ) VALUES 
        (
            gen_random_uuid(),
            demo_user_id,
            '🌐 My Website',
            'https://example.com',
            0,
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            demo_user_id,
            '💻 GitHub Profile',
            'https://github.com',
            1,
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            demo_user_id,
            '💼 LinkedIn',
            'https://linkedin.com',
            2,
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            demo_user_id,
            '🐦 Twitter',
            'https://twitter.com',
            3,
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            demo_user_id,
            '📧 Contact Me',
            'mailto:demo@example.com',
            4,
            NOW(),
            NOW()
        );
END $$;
