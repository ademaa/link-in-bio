-- Create profiles table that references auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create links table
CREATE TABLE IF NOT EXISTS public.links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" ON public.profiles
  FOR DELETE USING (auth.uid() = id);

-- Create policies for links table
CREATE POLICY "Links are viewable by everyone" ON public.links
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own links" ON public.links
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = links.user_id 
      AND auth.uid() = profiles.id
    )
  );

CREATE POLICY "Users can update their own links" ON public.links
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = links.user_id 
      AND auth.uid() = profiles.id
    )
  );

CREATE POLICY "Users can delete their own links" ON public.links
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = links.user_id 
      AND auth.uid() = profiles.id
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);
CREATE INDEX IF NOT EXISTS links_user_id_idx ON public.links(user_id);
CREATE INDEX IF NOT EXISTS links_position_idx ON public.links(user_id, position);
