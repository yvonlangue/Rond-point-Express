-- Update storage policies to allow anonymous uploads (for Clerk users)
-- This is a temporary solution for development

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Create more permissive policies for development
CREATE POLICY "Allow all operations on event-images" ON storage.objects
  FOR ALL USING (bucket_id = 'event-images') 
  WITH CHECK (bucket_id = 'event-images');

-- Alternative: Allow anonymous uploads specifically
-- CREATE POLICY "Allow anonymous uploads" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'event-images');
-- 
-- CREATE POLICY "Allow public reads" ON storage.objects
--   FOR SELECT USING (bucket_id = 'event-images');
