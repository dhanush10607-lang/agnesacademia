-- Create tables for the academic hierarchy

-- Departments
CREATE TABLE public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Programmes
CREATE TABLE public.programmes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Academic Years
CREATE TABLE public.academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    programme_id UUID NOT NULL REFERENCES public.programmes(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., "I Year", "II Year"
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Semesters
CREATE TABLE public.semesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., "Semester I", "Semester II"
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subjects
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    semester_id UUID NOT NULL REFERENCES public.semesters(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_programmes_department_id ON public.programmes(department_id);
CREATE INDEX idx_academic_years_programme_id ON public.academic_years(programme_id);
CREATE INDEX idx_semesters_academic_year_id ON public.semesters(academic_year_id);
CREATE INDEX idx_subjects_semester_id ON public.subjects(semester_id);

-- Insert Demo Data (safe seed data as requested)
WITH new_dept AS (
    INSERT INTO public.departments (name, description) 
    VALUES ('Computer Science (Demo)', 'Department of Computer Science (Demo Data)')
    RETURNING id
),
new_prog AS (
    INSERT INTO public.programmes (department_id, name, description)
    SELECT id, 'B.Sc Data Science (Demo)', 'Bachelor of Science in Data Science' FROM new_dept
    RETURNING id
),
new_year AS (
    INSERT INTO public.academic_years (programme_id, name)
    SELECT id, 'II Year' FROM new_prog
    RETURNING id
),
new_sem AS (
    INSERT INTO public.semesters (academic_year_id, name)
    SELECT id, 'Semester III' FROM new_year
    RETURNING id
)
INSERT INTO public.subjects (semester_id, name, code)
SELECT id, 'Database Management Systems (Demo)', 'DBMS-301' FROM new_sem
UNION ALL
SELECT id, 'Data Structures Using Python (Demo)', 'DS-302' FROM new_sem
UNION ALL
SELECT id, 'Probability and Statistics (Demo)', 'PS-303' FROM new_sem;
