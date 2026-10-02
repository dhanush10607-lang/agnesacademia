-- Phase 11: Fix Missing Academic Columns for Admin Forms

-- 1. Programmes: Add "code" (e.g. BSCDS)
ALTER TABLE public.programmes ADD COLUMN IF NOT EXISTS code TEXT;

-- 2. Academic Years: Add "start_date" and "end_date"
ALTER TABLE public.academic_years ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE public.academic_years ADD COLUMN IF NOT EXISTS end_date DATE;

-- 3. Semesters: Add "programme_id" (allows semesters to directly reference their programme, which the UI form expects)
ALTER TABLE public.semesters ADD COLUMN IF NOT EXISTS programme_id UUID REFERENCES public.programmes(id) ON DELETE CASCADE;

-- 4. Subjects: Add "department_id" (allows subjects to be explicitly tied to a department, as requested by UI)
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL;
