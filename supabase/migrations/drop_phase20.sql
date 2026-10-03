-- Revert Phase 20: Academic Structure Upgrade

-- 7. Remove targeting columns from notices and calendar_events
ALTER TABLE public.notices
DROP COLUMN IF EXISTS curriculum_id CASCADE,
DROP COLUMN IF EXISTS subject_id CASCADE;

ALTER TABLE public.calendar_events
DROP COLUMN IF EXISTS curriculum_id CASCADE,
DROP COLUMN IF EXISTS subject_id CASCADE;

-- 6. Remove from Profiles
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS curriculum_id;

-- 5. Revert Student Subjects (Enrollments)
-- Remove the unique constraint and add back the primary key constraint if possible.
-- Note: Re-adding the exact previous Primary Key depends on what it was before Phase 18.
ALTER TABLE public.student_subjects DROP CONSTRAINT IF EXISTS student_subjects_student_id_subject_id_academic_year_seme_key;
ALTER TABLE public.student_subjects DROP CONSTRAINT IF EXISTS student_subjects_student_id_subject_id_key;

ALTER TABLE public.student_subjects 
DROP COLUMN IF EXISTS id,
DROP COLUMN IF EXISTS curriculum_id,
DROP COLUMN IF EXISTS academic_year,
DROP COLUMN IF EXISTS semester,
DROP COLUMN IF EXISTS enrollment_status,
DROP COLUMN IF EXISTS source,
DROP COLUMN IF EXISTS created_at,
DROP COLUMN IF EXISTS updated_at;

-- Re-apply old primary key if needed (assuming student_id and subject_id)
-- ALTER TABLE public.student_subjects ADD PRIMARY KEY (student_id, subject_id);

-- 4. Drop Curriculum Subjects
DROP TABLE IF EXISTS public.curriculum_subjects CASCADE;

-- 3. Modify Subjects Table (Revert columns)
ALTER TABLE public.subjects 
DROP COLUMN IF EXISTS short_name CASCADE,
DROP COLUMN IF EXISTS description CASCADE,
DROP COLUMN IF EXISTS subject_type_id CASCADE,
DROP COLUMN IF EXISTS department_id CASCADE,
DROP COLUMN IF EXISTS credits CASCADE,
DROP COLUMN IF EXISTS is_active CASCADE;

-- 2. Drop Curricula / Combinations
DROP TABLE IF EXISTS public.curricula CASCADE;

-- 1. Drop Subject Types
DROP TABLE IF EXISTS public.subject_types CASCADE;
