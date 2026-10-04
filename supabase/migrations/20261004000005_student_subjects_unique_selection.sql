-- Keep one enrollment row for each student-subject pair.
WITH ranked_enrollments AS (
  SELECT
    ctid,
    row_number() OVER (
      PARTITION BY student_id, subject_id
      ORDER BY
        (enrollment_status = 'ENROLLED') DESC NULLS LAST,
        updated_at DESC NULLS LAST,
        created_at DESC NULLS LAST,
        selected_at DESC NULLS LAST,
        ctid DESC
    ) AS row_number
  FROM public.student_subjects
)
DELETE FROM public.student_subjects AS enrollments
USING ranked_enrollments
WHERE enrollments.ctid = ranked_enrollments.ctid
  AND ranked_enrollments.row_number > 1;

CREATE UNIQUE INDEX IF NOT EXISTS student_subjects_student_subject_uidx
  ON public.student_subjects (student_id, subject_id);

DROP FUNCTION IF EXISTS public.save_student_subjects(UUID[]);

CREATE FUNCTION public.save_student_subjects(
  p_subject_ids UUID[],
  p_managed_subject_ids UUID[]
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_student_id UUID := auth.uid();
  academic_selection_locked BOOLEAN;
BEGIN
  IF current_student_id IS NULL THEN
    RAISE EXCEPTION 'Authentication is required to save subjects.'
      USING ERRCODE = '42501';
  END IF;

  SELECT is_academic_locked
  INTO academic_selection_locked
  FROM public.profiles
  WHERE id = current_student_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Student profile was not found.'
      USING ERRCODE = '42501';
  END IF;

  IF academic_selection_locked THEN
    RAISE EXCEPTION 'Subject selection is locked.'
      USING ERRCODE = '42501';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM unnest(COALESCE(p_subject_ids, ARRAY[]::UUID[])) AS selected(subject_id)
    WHERE selected.subject_id IS NOT NULL
      AND NOT (
        selected.subject_id = ANY(COALESCE(p_managed_subject_ids, ARRAY[]::UUID[]))
      )
  ) THEN
    RAISE EXCEPTION 'Selected subjects must belong to the available subject list.'
      USING ERRCODE = '22023';
  END IF;

  DELETE FROM public.student_subjects AS enrollment
  WHERE enrollment.student_id = current_student_id
    AND enrollment.subject_id = ANY(COALESCE(p_managed_subject_ids, ARRAY[]::UUID[]))
    AND NOT (
      enrollment.subject_id = ANY(COALESCE(p_subject_ids, ARRAY[]::UUID[]))
    );

  INSERT INTO public.student_subjects (student_id, subject_id, enrollment_status)
  SELECT current_student_id, selected.subject_id, 'ENROLLED'
  FROM (
    SELECT DISTINCT unnest(COALESCE(p_subject_ids, ARRAY[]::UUID[])) AS subject_id
  ) AS selected
  WHERE selected.subject_id IS NOT NULL
  ON CONFLICT (student_id, subject_id)
  DO UPDATE SET
    enrollment_status = 'ENROLLED',
    updated_at = now();
END;
$$;

REVOKE ALL ON FUNCTION public.save_student_subjects(UUID[], UUID[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.save_student_subjects(UUID[], UUID[]) TO authenticated;
