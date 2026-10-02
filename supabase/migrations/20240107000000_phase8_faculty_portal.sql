-- Phase 8: Faculty Portal Schema

-- 1. App Settings for configuration
CREATE TABLE public.app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id)
);

-- Insert default setting for faculty bypassing moderation
INSERT INTO public.app_settings (key, value, description) 
VALUES ('faculty_bypass_moderation', 'true', 'If true, faculty uploads bypass the moderation queue and are published immediately.');

-- 2. Faculty Subjects Mapping
CREATE TABLE public.faculty_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(faculty_id, subject_id)
);

-- 3. Assignments Table
CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    due_date TIMESTAMPTZ,
    file_path TEXT,
    status TEXT NOT NULL DEFAULT 'draft', -- draft, published, archived
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Announcements Table
CREATE TABLE public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    programme_id UUID REFERENCES public.programmes(id) ON DELETE CASCADE,
    semester_id UUID REFERENCES public.semesters(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'published', -- draft, published, archived
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- App Settings: Everyone can read, only admin can update
CREATE POLICY "App settings are viewable by everyone" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "App settings updateable by admins" ON public.app_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'administrator')
);

-- Faculty Subjects: Everyone can read
CREATE POLICY "Faculty subjects are viewable by everyone" ON public.faculty_subjects FOR SELECT USING (true);
CREATE POLICY "Faculty subjects managed by admins" ON public.faculty_subjects FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'administrator')
);

-- Assignments: 
-- Anyone can view published assignments
CREATE POLICY "Published assignments are viewable by everyone" ON public.assignments FOR SELECT USING (status = 'published');
-- Creator can manage their own assignments
CREATE POLICY "Creators can manage their assignments" ON public.assignments FOR ALL USING (auth.uid() = created_by);
-- Admins/Moderators can view all
CREATE POLICY "Admins/Moderators can view all assignments" ON public.assignments FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'administrator'))
);

-- Announcements:
-- Anyone can view published announcements
CREATE POLICY "Published announcements viewable by everyone" ON public.announcements FOR SELECT USING (status = 'published');
-- Creator can manage their announcements
CREATE POLICY "Creators can manage their announcements" ON public.announcements FOR ALL USING (auth.uid() = created_by);
-- Admins/Moderators can view all
CREATE POLICY "Admins/Moderators can view all announcements" ON public.announcements FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'administrator'))
);
