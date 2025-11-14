-- Add foreign key constraints to reference profiles table
-- This allows Supabase to automatically join with profiles

-- First, create profiles for any users that don't have them yet
INSERT INTO profiles (id, full_name, created_at)
SELECT DISTINCT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', u.email, 'Unknown User'),
  NOW()
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing foreign key on posts.created_by
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_created_by_fkey;

-- Add new foreign key to posts.created_by referencing profiles
ALTER TABLE posts 
  ADD CONSTRAINT posts_created_by_fkey 
  FOREIGN KEY (created_by) 
  REFERENCES profiles(id) 
  ON DELETE SET NULL;

-- Drop existing foreign key on timeline_events.created_by
ALTER TABLE timeline_events DROP CONSTRAINT IF EXISTS timeline_events_created_by_fkey;

-- Add new foreign key to timeline_events.created_by referencing profiles
ALTER TABLE timeline_events 
  ADD CONSTRAINT timeline_events_created_by_fkey 
  FOREIGN KEY (created_by) 
  REFERENCES profiles(id) 
  ON DELETE SET NULL;
