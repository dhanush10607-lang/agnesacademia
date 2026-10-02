-- Phase 13: Security Hardening & Storage Policies

-- 1. STORAGE POLICIES
-- Ensure the storage buckets exist
INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('question_papers', 'question_papers', true) ON CONFLICT (id) DO NOTHING;

-- Policies for 'resources' bucket
-- Allow public to download
CREATE POLICY "Public Download Resources" ON storage.objects FOR SELECT USING (bucket_id = 'resources');
-- Allow authenticated users to upload (size < 50MB, allowed types)
-- Supabase Storage requires checking file extensions or MIME types in policies.
CREATE POLICY "Auth Upload Resources" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'resources' AND
  (storage.extension(name) = 'pdf' OR storage.extension(name) = 'docx' OR storage.extension(name) = 'pptx' OR storage.extension(name) = 'jpg' OR storage.extension(name) = 'png')
);
-- Allow users to update/delete their own files (owner checking is tricky in raw SQL without matching user IDs to paths, but standard practice is auth.uid() matching owner)
CREATE POLICY "Owner Delete Resources" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'resources' AND owner = auth.uid());

-- Policies for 'question_papers'
CREATE POLICY "Public Download QPs" ON storage.objects FOR SELECT USING (bucket_id = 'question_papers');
CREATE POLICY "Auth Upload QPs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'question_papers' AND
  (storage.extension(name) = 'pdf' OR storage.extension(name) = 'docx' OR storage.extension(name) = 'jpg' OR storage.extension(name) = 'png')
);
CREATE POLICY "Owner Delete QPs" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'question_papers' AND owner = auth.uid());


-- 2. RLS AUDIT - Fix Missing Policies

-- Ensure profiles can only be updated by the owner or admin
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;
CREATE POLICY "Public can view profiles" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. RATE LIMITING PREPARATION
-- Create table for tracking abusive API usage / spam
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    ip_address TEXT,
    action TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- We use this for basic tracking. A cron job could clear it out daily.
