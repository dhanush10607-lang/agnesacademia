CREATE OR REPLACE FUNCTION public.update_semester_session(
  p_semester_id UUID,
  p_academic_session_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  semester_programme_id UUID;
  session_programme_id UUID;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'administrator'
  ) THEN
    RAISE EXCEPTION 'Only administrators can update semester sessions.';
  END IF;

  SELECT programme_id
  INTO semester_programme_id
  FROM public.semesters
  WHERE id = p_semester_id;

  IF semester_programme_id IS NULL THEN
    RAISE EXCEPTION 'The selected semester does not exist.';
  END IF;

  SELECT programme_id
  INTO session_programme_id
  FROM public.academic_sessions
  WHERE id = p_academic_session_id
    AND status = 'active';

  IF session_programme_id IS NULL THEN
    RAISE EXCEPTION 'Select an active academic session.';
  END IF;

  IF semester_programme_id <> session_programme_id THEN
    RAISE EXCEPTION 'The session must belong to the semester programme.';
  END IF;

  UPDATE public.semesters
  SET academic_session_id = p_academic_session_id,
      updated_at = NOW()
  WHERE id = p_semester_id;

  UPDATE public.profiles
  SET academic_session_id = p_academic_session_id,
      updated_at = NOW()
  WHERE semester_id = p_semester_id;

  UPDATE public.question_papers
  SET academic_session_id = p_academic_session_id
  WHERE semester_id = p_semester_id;

  INSERT INTO public.admin_audit_logs (
    actor_id,
    action,
    target_type,
    target_id,
    metadata
  )
  VALUES (
    auth.uid(),
    'update',
    'semester_session',
    p_semester_id,
    jsonb_build_object('academic_session_id', p_academic_session_id)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.update_semester_session(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_semester_session(UUID, UUID) TO authenticated;
