-- Phase 11: Admin Dashboard + Analytics

-- 1. Audit Logs Table
CREATE TABLE public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL, -- e.g., 'resource', 'user', 'department'
    target_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Add Status Columns for Soft Deletion (If not already present)
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived'));
ALTER TABLE public.programmes ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived'));
ALTER TABLE public.academic_years ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived'));
ALTER TABLE public.semesters ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived'));
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived'));

-- Account Status for Profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended'));

-- Ensure RLS is enabled for Audit Logs
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON public.admin_audit_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'administrator')
);

-- Server functions or Admins can insert logs
CREATE POLICY "Admins can insert audit logs" ON public.admin_audit_logs FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrator', 'moderator'))
);

-- Analytics Views (Materialized views would be better for performance, but regular views are fine for MVP)
CREATE OR REPLACE VIEW admin_overview_stats AS
SELECT
    (SELECT COUNT(*) FROM profiles WHERE role = 'student') as total_students,
    (SELECT COUNT(*) FROM profiles WHERE role = 'faculty') as total_faculty,
    (SELECT COUNT(*) FROM departments WHERE status = 'active') as total_departments,
    (SELECT COUNT(*) FROM programmes WHERE status = 'active') as total_programmes,
    (SELECT COUNT(*) FROM subjects WHERE status = 'active') as total_subjects,
    (SELECT COUNT(*) FROM resources WHERE status = 'published') as total_resources,
    (SELECT COUNT(*) FROM resources WHERE status = 'pending_review') as pending_submissions,
    (SELECT COUNT(*) FROM notices WHERE status = 'published') as published_notices,
    (SELECT COUNT(*) FROM quizzes WHERE status = 'published') as active_quizzes;

