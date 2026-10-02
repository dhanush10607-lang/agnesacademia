-- Fix Academic Structure Tables to support soft-deletion (status column)

ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE public.programmes ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE public.academic_years ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE public.semesters ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
