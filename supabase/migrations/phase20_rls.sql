-- Enable RLS and add SELECT policies for Phase 20 tables

-- 1. Subject Types
ALTER TABLE public.subject_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on subject_types" ON public.subject_types;
CREATE POLICY "Allow public read access on subject_types" ON public.subject_types FOR SELECT USING (true);

-- 2. Curricula
ALTER TABLE public.curricula ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on curricula" ON public.curricula;
CREATE POLICY "Allow public read access on curricula" ON public.curricula FOR SELECT USING (true);

-- 3. Curriculum Subjects
ALTER TABLE public.curriculum_subjects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on curriculum_subjects" ON public.curriculum_subjects;
CREATE POLICY "Allow public read access on curriculum_subjects" ON public.curriculum_subjects FOR SELECT USING (true);
