-- Create storage bucket for event images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-images', 'event-images', true);

-- Create policy to allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'event-images' AND auth.role() = 'authenticated');

-- Create policy to allow public access to view images
CREATE POLICY "Allow public access to view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-images');
