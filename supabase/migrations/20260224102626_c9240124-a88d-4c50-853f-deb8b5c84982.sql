
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('truck-photos', 'truck-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('documents', 'documents', false, 20971520, ARRAY['application/pdf', 'image/jpeg', 'image/png']),
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- truck-photos: anyone can SELECT
CREATE POLICY "Anyone can view truck photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'truck-photos');

-- truck-photos: authenticated can INSERT
CREATE POLICY "Authenticated can upload truck photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'truck-photos' AND auth.role() = 'authenticated');

-- truck-photos: authenticated can DELETE
CREATE POLICY "Authenticated can delete truck photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'truck-photos' AND auth.role() = 'authenticated');

-- documents: authenticated can SELECT
CREATE POLICY "Authenticated can view documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- documents: authenticated can INSERT
CREATE POLICY "Authenticated can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- documents: authenticated can DELETE
CREATE POLICY "Authenticated can delete documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- avatars: anyone can SELECT
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- avatars: authenticated can INSERT
CREATE POLICY "Authenticated can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- avatars: authenticated can DELETE
CREATE POLICY "Authenticated can delete avatars"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Add file URL columns to food_trucks
ALTER TABLE public.food_trucks
  ADD COLUMN IF NOT EXISTS street_photo_1_url text,
  ADD COLUMN IF NOT EXISTS street_photo_2_url text,
  ADD COLUMN IF NOT EXISTS aerial_photo_url text,
  ADD COLUMN IF NOT EXISTS vehicle_photo_url text,
  ADD COLUMN IF NOT EXISTS business_license_url text,
  ADD COLUMN IF NOT EXISTS design_mockup_url text;
