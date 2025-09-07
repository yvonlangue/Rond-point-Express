-- Secure RLS Setup for Rond-point Express
-- This script sets up proper Row Level Security policies

-- ==============================================
-- USERS TABLE RLS POLICIES
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations on users" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (clerk_id = auth.jwt() ->> 'sub');

-- Policy: Users can insert their own profile
CREATE POLICY "Users can create their own profile" ON users
  FOR INSERT WITH CHECK (clerk_id = auth.jwt() ->> 'sub');

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (clerk_id = auth.jwt() ->> 'sub')
  WITH CHECK (clerk_id = auth.jwt() ->> 'sub');

-- ==============================================
-- EVENTS TABLE RLS POLICIES
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations on events" ON events;
DROP POLICY IF EXISTS "Anyone can view approved events" ON events;
DROP POLICY IF EXISTS "Users can view their own events" ON events;
DROP POLICY IF EXISTS "Users can create events" ON events;
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Users can delete their own events" ON events;

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view approved events (public events)
CREATE POLICY "Anyone can view approved events" ON events
  FOR SELECT USING (status = 'approved');

-- Policy: Users can view their own events (regardless of status)
CREATE POLICY "Users can view their own events" ON events
  FOR SELECT USING (created_by = auth.jwt() ->> 'sub');

-- Policy: Authenticated users can create events
CREATE POLICY "Authenticated users can create events" ON events
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'sub' IS NOT NULL AND
    created_by = auth.jwt() ->> 'sub'
  );

-- Policy: Users can update their own events
CREATE POLICY "Users can update their own events" ON events
  FOR UPDATE USING (created_by = auth.jwt() ->> 'sub')
  WITH CHECK (created_by = auth.jwt() ->> 'sub');

-- Policy: Users can delete their own events
CREATE POLICY "Users can delete their own events" ON events
  FOR DELETE USING (created_by = auth.jwt() ->> 'sub');

-- ==============================================
-- STORAGE BUCKET SETUP
-- ==============================================

-- Create the event-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- STORAGE RLS POLICIES
-- ==============================================

-- Drop existing storage policies
DROP POLICY IF EXISTS "Allow all operations on event-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload event images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own event images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own event images" ON storage.objects;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view images in event-images bucket
CREATE POLICY "Anyone can view event images" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-images');

-- Policy: Authenticated users can upload to event-images bucket
CREATE POLICY "Authenticated users can upload event images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'event-images' AND
    auth.jwt() ->> 'sub' IS NOT NULL
  );

-- Policy: Users can update their own images
CREATE POLICY "Users can update their own event images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'event-images' AND
    auth.jwt() ->> 'sub' IS NOT NULL
  ) WITH CHECK (
    bucket_id = 'event-images' AND
    auth.jwt() ->> 'sub' IS NOT NULL
  );

-- Policy: Users can delete their own images
CREATE POLICY "Users can delete their own event images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'event-images' AND
    auth.jwt() ->> 'sub' IS NOT NULL
  );

-- ==============================================
-- VERIFICATION QUERIES
-- ==============================================

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('users', 'events') 
AND schemaname = 'public';

-- Check policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('users', 'events')
ORDER BY tablename, policyname;

-- Check storage bucket exists
SELECT * FROM storage.buckets WHERE id = 'event-images';

-- Check storage policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;
