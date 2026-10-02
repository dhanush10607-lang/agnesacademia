-- Phase 4: Resources Database schema

-- Create Resource Status Enum
CREATE TYPE public.resource_status AS ENUM ('draft', 'pending_review', 'published', 'rejected', 'archived');

-- Create Resource Categories Table
CREATE TABLE public.resource_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert Default Categories
INSERT INTO public.resource_categories (name, description, icon) VALUES 
('Notes', 'Lecture notes and study materials', 'BookOpen'),
('Question Papers', 'Previous year exam papers', 'FileText'),
('Question Bank', 'Collection of important questions', 'Database'),
('Assignments', 'Course assignments and projects', 'ClipboardList'),
('Videos', 'Recorded lectures and tutorials', 'Video');

-- Create Resources Table
CREATE TABLE public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.resource_categories(id),
    status resource_status NOT NULL DEFAULT 'draft',
    uploader_id UUID NOT NULL REFERENCES public.profiles(id),
    file_path TEXT,
    file_type TEXT,
    file_size BIGINT,
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'B')
    ) STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for Full-Text Search
CREATE INDEX resources_search_idx ON public.resources USING GIN (search_vector);
CREATE INDEX resources_subject_idx ON public.resources (subject_id);
CREATE INDEX resources_status_idx ON public.resources (status);

-- Create Bookmarks Table
CREATE TABLE public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, resource_id)
);

-- Enable RLS
ALTER TABLE public.resource_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Categories: Anyone can read
CREATE POLICY "Categories are viewable by everyone" ON public.resource_categories FOR SELECT USING (true);

-- Resources: 
-- 1. Anyone can read 'published' resources
CREATE POLICY "Published resources are viewable by everyone" ON public.resources FOR SELECT USING (status = 'published');
-- 2. Uploader can read/update their own resources regardless of status
CREATE POLICY "Uploaders can view their own resources" ON public.resources FOR SELECT USING (auth.uid() = uploader_id);
CREATE POLICY "Uploaders can insert their own resources" ON public.resources FOR INSERT WITH CHECK (auth.uid() = uploader_id);
CREATE POLICY "Uploaders can update their own resources" ON public.resources FOR UPDATE USING (auth.uid() = uploader_id);

-- Bookmarks: Users can only see and manage their own bookmarks
CREATE POLICY "Users can manage their own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Storage bucket setup (for 'resources')
INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
CREATE POLICY "Anyone can read published resources files" ON storage.objects FOR SELECT USING ( bucket_id = 'resources' );
CREATE POLICY "Users can upload resource files" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'resources' AND auth.uid() = owner );
CREATE POLICY "Users can update their own resource files" ON storage.objects FOR UPDATE USING ( bucket_id = 'resources' AND auth.uid() = owner );
CREATE POLICY "Users can delete their own resource files" ON storage.objects FOR DELETE USING ( bucket_id = 'resources' AND auth.uid() = owner );
