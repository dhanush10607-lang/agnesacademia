-- Fix Storage Bucket Visibility
-- The 'resources' bucket was originally created as private, which causes 
-- "Bucket not found" errors when trying to access files via the public URL.
-- This script updates it to be a public bucket.

UPDATE storage.buckets 
SET public = true 
WHERE id IN ('resources', 'question_papers', 'avatars');
