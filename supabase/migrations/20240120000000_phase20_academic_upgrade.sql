-- Phase 20: Academic Structure Upgrade

-- 1. Subject Types
CREATE TABLE IF NOT EXISTS public.subject_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed basic subject types
INSERT INTO public.subject_types (name, code, display_order) VALUES 
('Major/Core', 'MAJOR', 10),
('Language', 'LANGUAGE', 20),
('Minor', 'MINOR', 30),
('Elective', 'ELECTIVE', 40),
('Open Elective', 'OPEN_ELECTIVE', 50),
('Skill Enhancement', 'SKILL_ENHANCEMENT', 60),
('Ability Enhancement', 'ABILITY_ENHANCEMENT', 70),
('Value Added', 'VALUE_ADDED', 80),
('Practical', 'PRACTICAL', 90),
('Project', 'PROJECT', 100),
('Other', 'OTHER', 110)
ON CONFLICT (code) DO NOTHING;

-- 2. Curricula / Combinations
CREATE TABLE IF NOT EXISTS public.curricula (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    programme_id UUID NOT NULL REFERENCES public.programmes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    description TEXT,
    academic_year TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Modify Subjects Table
ALTER TABLE public.subjects 
ADD COLUMN IF NOT EXISTS short_name TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS subject_type_id UUID REFERENCES public.subject_types(id),
ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id),
ADD COLUMN IF NOT EXISTS credits INTEGER,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 4. Curriculum Subjects
CREATE TABLE IF NOT EXISTS public.curriculum_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curriculum_id UUID NOT NULL REFERENCES public.curricula(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    year TEXT,
    semester TEXT,
    subject_type_id UUID REFERENCES public.subject_types(id),
    is_compulsory BOOLEAN DEFAULT true,
    is_selectable BOOLEAN DEFAULT false,
    minimum_selection INTEGER,
    maximum_selection INTEGER,
    credits INTEGER,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Student Subjects (Enrollments)
-- Note: We already have public.student_subjects from Phase 18.
ALTER TABLE public.student_subjects 
ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS curriculum_id UUID REFERENCES public.curricula(id),
ADD COLUMN IF NOT EXISTS academic_year TEXT,
ADD COLUMN IF NOT EXISTS semester TEXT,
ADD COLUMN IF NOT EXISTS enrollment_status TEXT DEFAULT 'ENROLLED',
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'SYSTEM',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 6. Add to Profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS curriculum_id UUID REFERENCES public.curricula(id);

-- Drop constraint if exists to allow multiple subjects and add unique constraint
ALTER TABLE public.student_subjects DROP CONSTRAINT IF EXISTS student_subjects_pkey;
ALTER TABLE public.student_subjects ADD UNIQUE (student_id, subject_id, academic_year, semester);

-- 7. Add targeting columns to notices and calendar_events
ALTER TABLE public.notices
ADD COLUMN IF NOT EXISTS curriculum_id UUID REFERENCES public.curricula(id),
ADD COLUMN IF NOT EXISTS subject_id UUID REFERENCES public.subjects(id);

ALTER TABLE public.calendar_events
ADD COLUMN IF NOT EXISTS curriculum_id UUID REFERENCES public.curricula(id),
ADD COLUMN IF NOT EXISTS subject_id UUID REFERENCES public.subjects(id);
