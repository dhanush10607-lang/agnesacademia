-- academic_years represents a programme's study level (I/II/III Year).
-- Calendar sessions such as 2026-2027 are stored independently.

CREATE TABLE IF NOT EXISTS public.academic_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programme_id UUID NOT NULL REFERENCES public.programmes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (programme_id, name)
);

ALTER TABLE public.academic_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view active academic sessions" ON public.academic_sessions;
CREATE POLICY "Everyone can view active academic sessions"
ON public.academic_sessions
FOR SELECT
USING (status = 'active');

DROP POLICY IF EXISTS "Admins can manage academic sessions" ON public.academic_sessions;
CREATE POLICY "Admins can manage academic sessions"
ON public.academic_sessions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'administrator'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'administrator'
  )
);

GRANT SELECT ON public.academic_sessions TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.academic_sessions TO authenticated;

INSERT INTO public.academic_sessions (
  id, programme_id, name, start_date, end_date, status, created_at, updated_at
)
SELECT
  id,
  programme_id,
  name,
  start_date,
  end_date,
  COALESCE(status, 'active'),
  created_at,
  updated_at
FROM public.academic_years
WHERE name ~ '^[0-9]{4}-[0-9]{4}$'
ON CONFLICT (programme_id, name) DO UPDATE SET
  id = EXCLUDED.id,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  status = EXCLUDED.status,
  updated_at = EXCLUDED.updated_at;

ALTER TABLE public.semesters
  ADD COLUMN IF NOT EXISTS academic_session_id UUID
    REFERENCES public.academic_sessions(id) ON DELETE RESTRICT;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS academic_session_id UUID
    REFERENCES public.academic_sessions(id) ON DELETE SET NULL;

ALTER TABLE public.question_papers
  ADD COLUMN IF NOT EXISTS academic_session_id UUID
    REFERENCES public.academic_sessions(id) ON DELETE RESTRICT;

UPDATE public.semesters AS semesters
SET academic_session_id = sessions.id
FROM public.academic_years AS study_year,
     public.academic_sessions AS sessions
WHERE semesters.academic_year_id = study_year.id
  AND sessions.programme_id = COALESCE(semesters.programme_id, study_year.programme_id)
  AND sessions.name = study_year.name
  AND study_year.name ~ '^[0-9]{4}-[0-9]{4}$'
  AND semesters.academic_session_id IS NULL;

UPDATE public.profiles AS profiles
SET academic_session_id = sessions.id
FROM public.academic_years AS study_year,
     public.academic_sessions AS sessions
WHERE profiles.academic_year_id = study_year.id
  AND sessions.programme_id = COALESCE(profiles.programme_id, study_year.programme_id)
  AND sessions.name = study_year.name
  AND study_year.name ~ '^[0-9]{4}-[0-9]{4}$'
  AND profiles.academic_session_id IS NULL;

UPDATE public.question_papers AS papers
SET academic_session_id = sessions.id
FROM public.academic_years AS study_year,
     public.academic_sessions AS sessions
WHERE papers.academic_year_id = study_year.id
  AND sessions.programme_id = COALESCE(papers.programme_id, study_year.programme_id)
  AND sessions.name = study_year.name
  AND study_year.name ~ '^[0-9]{4}-[0-9]{4}$'
  AND papers.academic_session_id IS NULL;

DO $validate_semesters$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.semesters
    WHERE name !~* '^semester[[:space:]]+(1|2|3|4|5|6|i|ii|iii|iv|v|vi)$'
  ) THEN
    RAISE EXCEPTION
      'Cannot assign study years: a semester name is not a supported Semester 1–6 (or I–VI) label.';
  END IF;
END
$validate_semesters$;

UPDATE public.academic_years
SET name = 'I Year',
    start_date = NULL,
    end_date = NULL,
    updated_at = NOW()
WHERE name ~ '^[0-9]{4}-[0-9]{4}$';

INSERT INTO public.academic_years (id, programme_id, name, status)
SELECT md5(programme_id::TEXT || ':II Year')::UUID, programme_id, 'II Year', 'active'
FROM public.academic_years AS first_year
WHERE first_year.name = 'I Year'
  AND NOT EXISTS (
    SELECT 1
    FROM public.academic_years AS existing
    WHERE existing.programme_id = first_year.programme_id
      AND existing.name = 'II Year'
  );

INSERT INTO public.academic_years (id, programme_id, name, status)
SELECT md5(programme_id::TEXT || ':III Year')::UUID, programme_id, 'III Year', 'active'
FROM public.academic_years AS first_year
WHERE first_year.name = 'I Year'
  AND NOT EXISTS (
    SELECT 1
    FROM public.academic_years AS existing
    WHERE existing.programme_id = first_year.programme_id
      AND existing.name = 'III Year'
  );

UPDATE public.semesters AS semesters
SET academic_year_id = study_year.id
FROM public.academic_years AS old_year,
     public.academic_years AS study_year
WHERE semesters.academic_year_id = old_year.id
  AND old_year.name = 'I Year'
  AND study_year.programme_id = COALESCE(semesters.programme_id, old_year.programme_id)
  AND study_year.name = CASE
    WHEN regexp_replace(lower(semesters.name), '^semester[[:space:]]+', '') IN ('1', 'i', '2', 'ii')
      THEN 'I Year'
    WHEN regexp_replace(lower(semesters.name), '^semester[[:space:]]+', '') IN ('3', 'iii', '4', 'iv')
      THEN 'II Year'
    WHEN regexp_replace(lower(semesters.name), '^semester[[:space:]]+', '') IN ('5', 'v', '6', 'vi')
      THEN 'III Year'
  END;

UPDATE public.profiles AS profiles
SET academic_year_id = semesters.academic_year_id
FROM public.semesters AS semesters
WHERE profiles.semester_id = semesters.id
  AND profiles.academic_year_id IS DISTINCT FROM semesters.academic_year_id;

UPDATE public.profiles AS profiles
SET academic_session_id = semesters.academic_session_id
FROM public.semesters AS semesters
WHERE profiles.semester_id = semesters.id
  AND profiles.academic_session_id IS NULL;

UPDATE public.question_papers AS papers
SET academic_year_id = semesters.academic_year_id
FROM public.semesters AS semesters
WHERE papers.semester_id = semesters.id
  AND papers.academic_year_id IS DISTINCT FROM semesters.academic_year_id;

UPDATE public.question_papers AS papers
SET academic_session_id = semesters.academic_session_id
FROM public.semesters AS semesters
WHERE papers.semester_id = semesters.id
  AND papers.academic_session_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_academic_sessions_programme_id
  ON public.academic_sessions(programme_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_academic_years_programme_name
  ON public.academic_years(programme_id, name);

CREATE INDEX IF NOT EXISTS idx_semesters_academic_session_id
  ON public.semesters(academic_session_id);

CREATE INDEX IF NOT EXISTS idx_profiles_academic_session_id
  ON public.profiles(academic_session_id);

CREATE INDEX IF NOT EXISTS idx_question_papers_academic_session_id
  ON public.question_papers(academic_session_id);
