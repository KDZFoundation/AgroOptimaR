-- Ensure the storage bucket 'wnioski' exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('wnioski', 'wnioski', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects (usually enabled by default, but good to ensure)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to upload files to 'wnioski' bucket
-- They can only upload to their own folder (user_id/...)
CREATE POLICY "Allow authenticated uploads to wnioski"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'wnioski'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to read their own files from 'wnioski' bucket
CREATE POLICY "Allow authenticated reads from wnioski"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'wnioski'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated deletes from wnioski"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'wnioski'
    AND (storage.foldername(name))[1] = auth.uid()::text
);
