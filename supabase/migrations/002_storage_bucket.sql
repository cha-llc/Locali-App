-- ============================================================================
-- SUPABASE STORAGE BUCKET SETUP
-- ============================================================================

-- This bucket is created via Supabase dashboard, but the RLS policies must be set up:

-- Storage Bucket: verifications
-- Purpose: Store neighborhood verification documents

-- RLS Policies for verifications bucket:
-- 1. Users can upload only to their own folder: /verifications/{uid}/*
-- 2. Users can read only their own files
-- 3. Only authenticated users can access

-- Enable RLS on storage
-- Note: RLS must be enabled in Supabase dashboard for the bucket

-- Policy: Users can upload to their own folder
CREATE POLICY "Users can upload own verification documents"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'verifications' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can read their own files
CREATE POLICY "Users can read own verification documents"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'verifications' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Admins can read all verification documents
CREATE POLICY "Admins can read all verification documents"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'verifications' AND
    (
      SELECT role FROM auth.users WHERE id = auth.uid()
    ) = 'admin'
  );
