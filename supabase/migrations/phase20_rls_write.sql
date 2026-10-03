-- Add INSERT, UPDATE, DELETE policies for Phase 20 tables

-- 1. Subject Types
DROP POLICY IF EXISTS "Allow authenticated write access on subject_types" ON public.subject_types;
CREATE POLICY "Allow authenticated write access on subject_types" ON public.subject_types FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. Curricula
DROP POLICY IF EXISTS "Allow authenticated write access on curricula" ON public.curricula;
CREATE POLICY "Allow authenticated write access on curricula" ON public.curricula FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Curriculum Subjects
DROP POLICY IF EXISTS "Allow authenticated write access on curriculum_subjects" ON public.curriculum_subjects;
CREATE POLICY "Allow authenticated write access on curriculum_subjects" ON public.curriculum_subjects FOR ALL TO authenticated USING (true) WITH CHECK (true);
