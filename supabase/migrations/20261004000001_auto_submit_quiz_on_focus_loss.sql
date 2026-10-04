DROP FUNCTION IF EXISTS public.record_quiz_focus_event(UUID);

CREATE FUNCTION public.record_quiz_focus_event(
  p_attempt_id UUID,
  p_answers JSONB DEFAULT '{}'::JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  attempt_row public.quiz_attempts%ROWTYPE;
  finalization_result JSONB;
  current_count INTEGER;
BEGIN
  UPDATE public.quiz_attempts
  SET tab_switch_count = tab_switch_count + 1,
      last_focus_event_at = clock_timestamp()
  WHERE id = p_attempt_id
    AND student_id = auth.uid()
    AND status = 'in_progress'
    AND (last_focus_event_at IS NULL OR last_focus_event_at < clock_timestamp() - INTERVAL '3 seconds')
  RETURNING * INTO attempt_row;

  IF NOT FOUND THEN
    SELECT tab_switch_count INTO current_count
    FROM public.quiz_attempts
    WHERE id = p_attempt_id
      AND student_id = auth.uid()
      AND status = 'in_progress';
    IF NOT FOUND THEN
      RETURN jsonb_build_object('success', false, 'error', 'Active attempt not found');
    END IF;
    RETURN jsonb_build_object('success', true, 'tabSwitchCount', current_count);
  END IF;

  finalization_result := public.finalize_quiz_attempt(p_attempt_id, p_answers);
  IF COALESCE((finalization_result->>'success')::BOOLEAN, false) IS NOT TRUE THEN
    RAISE EXCEPTION 'Could not finalize quiz attempt after focus loss';
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'tabSwitchCount', attempt_row.tab_switch_count,
    'autoSubmitted', true,
    'attemptId', p_attempt_id
  );
END;
$$;

REVOKE ALL ON FUNCTION public.record_quiz_focus_event(UUID, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_quiz_focus_event(UUID, JSONB) TO authenticated;
