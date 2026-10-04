-- Secure quiz attempts: keep answer keys server-side and make attempt state authoritative.

ALTER TABLE public.quiz_attempts
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS tab_switch_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_focus_event_at TIMESTAMPTZ;

ALTER TABLE public.quiz_answers
  ADD COLUMN IF NOT EXISTS question_text_snapshot TEXT,
  ADD COLUMN IF NOT EXISTS explanation_snapshot TEXT,
  ADD COLUMN IF NOT EXISTS selected_option_text_snapshot TEXT,
  ADD COLUMN IF NOT EXISTS correct_option_text_snapshot TEXT,
  ADD COLUMN IF NOT EXISTS question_marks_snapshot INTEGER;

WITH duplicate_attempts AS (
  SELECT id, ROW_NUMBER() OVER (
    PARTITION BY quiz_id, student_id
    ORDER BY started_at DESC, id DESC
  ) AS position
  FROM public.quiz_attempts
  WHERE status = 'in_progress'
)
UPDATE public.quiz_attempts AS attempts
SET status = 'abandoned'
FROM duplicate_attempts
WHERE attempts.id = duplicate_attempts.id
  AND duplicate_attempts.position > 1;

CREATE UNIQUE INDEX IF NOT EXISTS quiz_attempts_one_active_per_student
  ON public.quiz_attempts (quiz_id, student_id)
  WHERE status = 'in_progress';

WITH duplicate_answers AS (
  SELECT id, ROW_NUMBER() OVER (
    PARTITION BY attempt_id, question_id
    ORDER BY created_at DESC, id DESC
  ) AS position
  FROM public.quiz_answers
)
DELETE FROM public.quiz_answers AS answers
USING duplicate_answers
WHERE answers.id = duplicate_answers.id
  AND duplicate_answers.position > 1;

CREATE UNIQUE INDEX IF NOT EXISTS quiz_answers_one_per_question
  ON public.quiz_answers (attempt_id, question_id);

CREATE TABLE IF NOT EXISTS public.quiz_attempt_question_order (
  attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL,
  option_order UUID[] NOT NULL,
  PRIMARY KEY (attempt_id, question_id),
  UNIQUE (attempt_id, display_order)
);

ALTER TABLE public.quiz_attempt_question_order ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.quiz_attempt_question_order FROM anon, authenticated;

DROP POLICY IF EXISTS "Questions of published quizzes viewable by everyone" ON public.quiz_questions;
DROP POLICY IF EXISTS "Options of published quizzes viewable by everyone" ON public.quiz_options;
DROP POLICY IF EXISTS "Students can view and manage their own attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Faculty can view attempts for their quizzes" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Students can view and manage their own answers" ON public.quiz_answers;
DROP POLICY IF EXISTS "Faculty can view answers for their quizzes" ON public.quiz_answers;
DROP POLICY IF EXISTS "Faculty can view and manage their own quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Faculty manage their own quiz questions" ON public.quiz_questions;
DROP POLICY IF EXISTS "Faculty manage their own quiz options" ON public.quiz_options;

CREATE POLICY "Faculty can view and manage their own quizzes"
  ON public.quizzes FOR ALL TO authenticated
  USING (
    auth.uid() = created_by
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'faculty')
  )
  WITH CHECK (
    auth.uid() = created_by
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'faculty')
  );
CREATE POLICY "Faculty can view attempts for their quizzes"
  ON public.quiz_attempts FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.quizzes
    JOIN public.profiles ON profiles.id = auth.uid() AND profiles.role = 'faculty'
    WHERE quizzes.id = quiz_attempts.quiz_id AND quizzes.created_by = auth.uid()
  ));
CREATE POLICY "Students can view their own attempts"
  ON public.quiz_attempts FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Faculty can view answers for their quizzes"
  ON public.quiz_answers FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1
    FROM public.quiz_attempts AS attempts
    JOIN public.quizzes ON quizzes.id = attempts.quiz_id
    JOIN public.profiles ON profiles.id = auth.uid() AND profiles.role = 'faculty'
    WHERE attempts.id = quiz_answers.attempt_id
      AND quizzes.created_by = auth.uid()
  ));
CREATE POLICY "Students can view completed answers for their attempts"
  ON public.quiz_answers FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1
    FROM public.quiz_attempts AS attempts
    WHERE attempts.id = quiz_answers.attempt_id
      AND attempts.student_id = auth.uid()
      AND attempts.status = 'completed'
  ));

CREATE POLICY "Faculty can view questions for their quizzes"
  ON public.quiz_questions FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.quizzes
    JOIN public.profiles ON profiles.id = auth.uid() AND profiles.role = 'faculty'
    WHERE quizzes.id = quiz_questions.quiz_id
      AND quizzes.created_by = auth.uid()
  ));
CREATE POLICY "Faculty manage their own quiz questions"
  ON public.quiz_questions FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.quizzes
    JOIN public.profiles ON profiles.id = auth.uid() AND profiles.role = 'faculty'
    WHERE quizzes.id = quiz_questions.quiz_id AND quizzes.created_by = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.quizzes
    JOIN public.profiles ON profiles.id = auth.uid() AND profiles.role = 'faculty'
    WHERE quizzes.id = quiz_questions.quiz_id AND quizzes.created_by = auth.uid()
  ));
CREATE POLICY "Students can review questions from completed attempts"
  ON public.quiz_questions FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1
    FROM public.quiz_answers AS answers
    JOIN public.quiz_attempts AS attempts ON attempts.id = answers.attempt_id
    WHERE answers.question_id = quiz_questions.id
      AND attempts.student_id = auth.uid()
      AND attempts.status = 'completed'
  ));
CREATE POLICY "Faculty can view options for their quizzes"
  ON public.quiz_options FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1
    FROM public.quiz_questions AS questions
    JOIN public.quizzes ON quizzes.id = questions.quiz_id
    JOIN public.profiles ON profiles.id = auth.uid() AND profiles.role = 'faculty'
    WHERE questions.id = quiz_options.question_id
      AND quizzes.created_by = auth.uid()
  ));
CREATE POLICY "Faculty manage their own quiz options"
  ON public.quiz_options FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1
    FROM public.quiz_questions AS questions
    JOIN public.quizzes ON quizzes.id = questions.quiz_id
    JOIN public.profiles ON profiles.id = auth.uid() AND profiles.role = 'faculty'
    WHERE questions.id = quiz_options.question_id
      AND quizzes.created_by = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1
    FROM public.quiz_questions AS questions
    JOIN public.quizzes ON quizzes.id = questions.quiz_id
    JOIN public.profiles ON profiles.id = auth.uid() AND profiles.role = 'faculty'
    WHERE questions.id = quiz_options.question_id
      AND quizzes.created_by = auth.uid()
  ));

REVOKE INSERT, UPDATE, DELETE ON public.quiz_attempts FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.quiz_answers FROM anon, authenticated;
REVOKE ALL ON public.quiz_options FROM anon, authenticated;
GRANT SELECT (id, question_id, option_text, order_index)
  ON public.quiz_options TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.quiz_options TO authenticated;

CREATE OR REPLACE VIEW public.quiz_public_options
  WITH (security_barrier = true)
AS
  SELECT options.id, options.question_id, options.option_text, options.order_index
  FROM public.quiz_options AS options
  JOIN public.quiz_questions AS questions ON questions.id = options.question_id
  JOIN public.quizzes ON quizzes.id = questions.quiz_id
  WHERE quizzes.status = 'published'
    AND auth.uid() IS NOT NULL;

CREATE OR REPLACE VIEW public.quiz_public_question_counts
  WITH (security_barrier = true)
AS
  SELECT quiz_id, COUNT(*)::INTEGER AS question_count
  FROM public.quiz_questions
  JOIN public.quizzes ON quizzes.id = quiz_questions.quiz_id
  WHERE quizzes.status = 'published'
    AND auth.uid() IS NOT NULL
  GROUP BY quiz_id;

CREATE OR REPLACE VIEW public.quiz_faculty_options
  WITH (security_barrier = true)
AS
  SELECT options.id, options.question_id, options.option_text, options.is_correct, options.order_index
  FROM public.quiz_options AS options
  JOIN public.quiz_questions AS questions ON questions.id = options.question_id
  JOIN public.quizzes ON quizzes.id = questions.quiz_id
  WHERE quizzes.created_by = auth.uid()
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'faculty')
    AND auth.uid() IS NOT NULL;

GRANT SELECT ON public.quiz_public_options TO authenticated;
GRANT SELECT ON public.quiz_public_question_counts TO authenticated;
GRANT SELECT ON public.quiz_faculty_options TO authenticated;

CREATE OR REPLACE FUNCTION public.prevent_quiz_content_changes_after_attempt()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  target_quiz_id UUID;
BEGIN
  IF TG_TABLE_NAME = 'quiz_questions' THEN
    target_quiz_id := COALESCE(NEW.quiz_id, OLD.quiz_id);
  ELSE
    SELECT quiz_id INTO target_quiz_id
    FROM public.quiz_questions
    WHERE id = COALESCE(NEW.question_id, OLD.question_id);
  END IF;

  PERFORM 1 FROM public.quizzes WHERE id = target_quiz_id FOR UPDATE;

  IF EXISTS (
    SELECT 1 FROM public.quiz_attempts
    WHERE quiz_id = target_quiz_id
  ) THEN
    RAISE EXCEPTION 'Quiz content cannot be changed after an attempt has started';
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.prevent_unpublishing_active_quiz()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF OLD.status = 'published'
    AND NEW.status <> 'published'
    AND EXISTS (
      SELECT 1 FROM public.quiz_attempts
      WHERE quiz_id = OLD.id AND status = 'in_progress'
    )
  THEN
    RAISE EXCEPTION 'Quiz has an in-progress attempt';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.add_quiz_question(
  p_quiz_id UUID,
  p_question_text TEXT,
  p_marks INTEGER,
  p_explanation TEXT,
  p_options JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  question_id UUID;
  option_entry JSONB;
  next_order INTEGER;
  option_count INTEGER;
  correct_count INTEGER;
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'faculty'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only faculty can add quiz questions');
  END IF;

  PERFORM 1
  FROM public.quizzes
  WHERE id = p_quiz_id AND created_by = auth.uid() AND status = 'draft'
  FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'You can only add questions to your own draft quiz');
  END IF;

  IF p_question_text IS NULL OR LENGTH(BTRIM(p_question_text)) = 0
    OR LENGTH(p_question_text) > 4000
    OR LENGTH(COALESCE(p_explanation, '')) > 4000
    OR p_marks IS NULL OR p_marks < 1 OR p_marks > 1000
    OR jsonb_typeof(p_options) <> 'array'
  THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid question data');
  END IF;

  SELECT COUNT(*), COUNT(*) FILTER (WHERE item->>'is_correct' = 'true')
  INTO option_count, correct_count
  FROM jsonb_array_elements(p_options) AS option_rows(item);

  IF option_count < 2 OR option_count > 4 OR correct_count <> 1 OR EXISTS (
    SELECT 1 FROM jsonb_array_elements(p_options) AS option_rows(item)
    WHERE COALESCE(LENGTH(BTRIM(item->>'option_text')), 0) = 0
      OR LENGTH(item->>'option_text') > 1000
      OR COALESCE(item->>'order_index', '') !~ '^[0-3]$'
      OR jsonb_typeof(item->'is_correct') IS DISTINCT FROM 'boolean'
  ) OR (
    SELECT COUNT(DISTINCT item->>'order_index')
    FROM jsonb_array_elements(p_options) AS option_rows(item)
  ) <> option_count THEN
    RETURN jsonb_build_object('success', false, 'error', 'Add two to four options and mark exactly one correct answer');
  END IF;

  SELECT COALESCE(MAX(order_index), -1) + 1
  INTO next_order
  FROM public.quiz_questions
  WHERE quiz_id = p_quiz_id;

  INSERT INTO public.quiz_questions (quiz_id, question_text, question_type, marks, explanation, order_index)
  VALUES (p_quiz_id, BTRIM(p_question_text), 'mcq', p_marks, NULLIF(BTRIM(p_explanation), ''), next_order)
  RETURNING id INTO question_id;

  FOR option_entry IN SELECT value FROM jsonb_array_elements(p_options)
  LOOP
    INSERT INTO public.quiz_options (question_id, option_text, is_correct, order_index)
    VALUES (
      question_id,
      BTRIM(option_entry->>'option_text'),
      option_entry->>'is_correct' = 'true',
      (option_entry->>'order_index')::INTEGER
    );
  END LOOP;

  RETURN jsonb_build_object('success', true, 'questionId', question_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.finalize_quiz_attempt(
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
  answer_entry RECORD;
  question_row RECORD;
  selected_option UUID;
  correct_option UUID;
  correct_option_text TEXT;
  selected_option_text TEXT;
  earned_marks INTEGER;
  total_score INTEGER := 0;
  maximum_score INTEGER := 0;
  pass_percentage INTEGER;
  now_at TIMESTAMPTZ := clock_timestamp();
BEGIN
  SELECT * INTO attempt_row
  FROM public.quiz_attempts
  WHERE id = p_attempt_id
  FOR UPDATE;

  IF NOT FOUND OR attempt_row.student_id <> auth.uid() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Attempt not found');
  END IF;

  IF attempt_row.status = 'completed' THEN
    RETURN jsonb_build_object('success', true, 'attemptId', p_attempt_id, 'status', 'completed');
  END IF;

  IF attempt_row.status <> 'in_progress' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Attempt has already been submitted');
  END IF;

  IF attempt_row.expires_at IS NULL OR now_at < attempt_row.expires_at THEN
    IF p_answers IS NULL OR jsonb_typeof(p_answers) <> 'object' THEN
      RETURN jsonb_build_object('success', false, 'error', 'Invalid answer data');
    END IF;

    FOR answer_entry IN
      SELECT key AS question_id, value AS option_id
      FROM jsonb_each(p_answers)
    LOOP
      IF answer_entry.option_id = 'null'::JSONB THEN
        CONTINUE;
      END IF;

      IF NOT EXISTS (
        SELECT 1
        FROM public.quiz_attempt_question_order AS attempt_questions
        WHERE attempt_questions.attempt_id = p_attempt_id
          AND attempt_questions.question_id = answer_entry.question_id::UUID
          AND (answer_entry.option_id #>> '{}') IN (
            SELECT option_id::TEXT FROM unnest(attempt_questions.option_order) AS option_rows(option_id)
          )
      ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Answer does not belong to this attempt');
      END IF;

      INSERT INTO public.quiz_answers (attempt_id, question_id, selected_option_id, is_correct, marks_awarded)
      VALUES (p_attempt_id, answer_entry.question_id::UUID, (answer_entry.option_id #>> '{}')::UUID, NULL, 0)
      ON CONFLICT (attempt_id, question_id)
      DO UPDATE SET selected_option_id = EXCLUDED.selected_option_id, is_correct = NULL, marks_awarded = 0;
    END LOOP;
  END IF;

  SELECT passing_score_percentage INTO pass_percentage
  FROM public.quizzes WHERE id = attempt_row.quiz_id;

  FOR question_row IN
    SELECT questions.id, questions.question_text, questions.explanation, questions.marks,
           answers.selected_option_id
    FROM public.quiz_attempt_question_order AS attempt_questions
    JOIN public.quiz_questions AS questions ON questions.id = attempt_questions.question_id
    LEFT JOIN public.quiz_answers AS answers
      ON answers.attempt_id = p_attempt_id
      AND answers.question_id = questions.id
    WHERE attempt_questions.attempt_id = p_attempt_id
    ORDER BY attempt_questions.display_order
  LOOP
    SELECT options.id, options.option_text
    INTO correct_option, correct_option_text
    FROM public.quiz_options AS options
    WHERE options.question_id = question_row.id
      AND options.is_correct
    LIMIT 1;

    selected_option := question_row.selected_option_id;
    SELECT option_text INTO selected_option_text
    FROM public.quiz_options
    WHERE id = selected_option;

    earned_marks := CASE
      WHEN selected_option IS NOT NULL AND selected_option = correct_option THEN question_row.marks
      ELSE 0
    END;

    maximum_score := maximum_score + question_row.marks;
    total_score := total_score + earned_marks;

    INSERT INTO public.quiz_answers (
      attempt_id, question_id, selected_option_id, is_correct, marks_awarded,
      question_text_snapshot, explanation_snapshot, selected_option_text_snapshot,
      correct_option_text_snapshot, question_marks_snapshot
    )
    VALUES (
      p_attempt_id, question_row.id, selected_option, earned_marks > 0, earned_marks,
      question_row.question_text, question_row.explanation, selected_option_text,
      correct_option_text, question_row.marks
    )
    ON CONFLICT (attempt_id, question_id)
    DO UPDATE SET
      selected_option_id = EXCLUDED.selected_option_id,
      is_correct = EXCLUDED.is_correct,
      marks_awarded = EXCLUDED.marks_awarded,
      question_text_snapshot = EXCLUDED.question_text_snapshot,
      explanation_snapshot = EXCLUDED.explanation_snapshot,
      selected_option_text_snapshot = EXCLUDED.selected_option_text_snapshot,
      correct_option_text_snapshot = EXCLUDED.correct_option_text_snapshot,
      question_marks_snapshot = EXCLUDED.question_marks_snapshot;
  END LOOP;

  UPDATE public.quiz_attempts
  SET completed_at = now_at,
      score = total_score,
      total_marks = maximum_score,
      percentage = CASE WHEN maximum_score > 0 THEN ROUND(total_score * 100.0 / maximum_score, 2) ELSE 0 END,
      is_passed = CASE
        WHEN maximum_score > 0 THEN total_score * 100.0 / maximum_score >= COALESCE(pass_percentage, 40)
        ELSE false
      END,
      status = 'completed'
  WHERE id = p_attempt_id;

  RETURN jsonb_build_object('success', true, 'attemptId', p_attempt_id, 'status', 'completed');
END;
$$;

CREATE OR REPLACE FUNCTION public.start_quiz_attempt(p_quiz_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  quiz_row public.quizzes%ROWTYPE;
  attempt_row public.quiz_attempts%ROWTYPE;
  question_total INTEGER;
  attempt_total INTEGER;
  questions_json JSONB;
  answers_json JSONB;
BEGIN
  IF current_user_id IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = current_user_id AND role = 'student'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only signed-in students can take quizzes');
  END IF;
  IF p_quiz_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid quiz');
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(current_user_id::TEXT || p_quiz_id::TEXT, 0));

  SELECT * INTO quiz_row
  FROM public.quizzes
  WHERE id = p_quiz_id AND status = 'published'
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Quiz is not available');
  END IF;

  SELECT * INTO attempt_row
  FROM public.quiz_attempts
  WHERE quiz_id = p_quiz_id
    AND student_id = current_user_id
    AND status = 'in_progress'
  FOR UPDATE;

  IF FOUND THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.quiz_attempt_question_order
      WHERE attempt_id = attempt_row.id
    ) THEN
      UPDATE public.quiz_attempts SET status = 'abandoned' WHERE id = attempt_row.id;
    ELSIF attempt_row.expires_at IS NOT NULL AND attempt_row.expires_at <= clock_timestamp() THEN
      PERFORM public.finalize_quiz_attempt(attempt_row.id, '{}'::JSONB);
      RETURN jsonb_build_object(
        'success', true,
        'completedAttemptId', attempt_row.id,
        'quizId', quiz_row.id
      );
    ELSE
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', questions.id,
          'question_text', questions.question_text,
          'marks', questions.marks,
          'options', (
            SELECT jsonb_agg(
              jsonb_build_object('id', options.id, 'option_text', options.option_text)
              ORDER BY array_position(attempt_questions.option_order, options.id)
            )
            FROM unnest(attempt_questions.option_order) AS option_ids(option_id)
            JOIN public.quiz_options AS options ON options.id = option_ids.option_id
          )
        ) ORDER BY attempt_questions.display_order
      ) INTO questions_json
      FROM public.quiz_attempt_question_order AS attempt_questions
      JOIN public.quiz_questions AS questions ON questions.id = attempt_questions.question_id
      WHERE attempt_questions.attempt_id = attempt_row.id;

      SELECT COALESCE(jsonb_object_agg(question_id::TEXT, selected_option_id::TEXT), '{}'::JSONB)
      INTO answers_json
      FROM public.quiz_answers
      WHERE attempt_id = attempt_row.id
        AND selected_option_id IS NOT NULL;

      RETURN jsonb_build_object(
        'success', true,
        'attemptId', attempt_row.id,
        'startedAt', attempt_row.started_at,
        'expiresAt', attempt_row.expires_at,
        'tabSwitchCount', attempt_row.tab_switch_count,
        'quiz', jsonb_build_object('id', quiz_row.id, 'title', quiz_row.title, 'duration_minutes', quiz_row.duration_minutes),
        'questions', COALESCE(questions_json, '[]'::JSONB),
        'answers', COALESCE(answers_json, '{}'::JSONB)
      );
    END IF;
  END IF;

  IF quiz_row.max_attempts IS NOT NULL THEN
    SELECT COUNT(*) INTO attempt_total
    FROM public.quiz_attempts
    WHERE quiz_id = p_quiz_id
      AND student_id = current_user_id
      AND status <> 'abandoned';

    IF attempt_total >= quiz_row.max_attempts THEN
      RETURN jsonb_build_object('success', false, 'error', 'Maximum quiz attempts reached');
    END IF;
  END IF;

  SELECT COUNT(*) INTO question_total
  FROM public.quiz_questions WHERE quiz_id = p_quiz_id;

  IF question_total = 0 OR EXISTS (
    SELECT 1
    FROM public.quiz_questions AS questions
    WHERE questions.quiz_id = p_quiz_id
      AND (
        (SELECT COUNT(*) FROM public.quiz_options WHERE question_id = questions.id) < 2
        OR (SELECT COUNT(*) FROM public.quiz_options WHERE question_id = questions.id AND is_correct) <> 1
      )
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Quiz is not ready to be attempted');
  END IF;

  INSERT INTO public.quiz_attempts (quiz_id, student_id, status, expires_at)
  VALUES (
    p_quiz_id,
    current_user_id,
    'in_progress',
    CASE WHEN quiz_row.duration_minutes IS NULL THEN NULL
      ELSE clock_timestamp() + make_interval(mins => quiz_row.duration_minutes)
    END
  )
  RETURNING * INTO attempt_row;

  INSERT INTO public.quiz_attempt_question_order (attempt_id, question_id, display_order, option_order)
  SELECT attempt_row.id, questions.id,
         ROW_NUMBER() OVER (ORDER BY random())::INTEGER,
         option_data.option_ids
  FROM public.quiz_questions AS questions
  CROSS JOIN LATERAL (
    SELECT array_agg(options.id ORDER BY random()) AS option_ids
    FROM public.quiz_options AS options
    WHERE options.question_id = questions.id
  ) AS option_data
  WHERE questions.quiz_id = p_quiz_id;

  SELECT jsonb_agg(
    jsonb_build_object(
      'id', questions.id,
      'question_text', questions.question_text,
      'marks', questions.marks,
      'options', (
        SELECT jsonb_agg(
          jsonb_build_object('id', options.id, 'option_text', options.option_text)
          ORDER BY array_position(attempt_questions.option_order, options.id)
        )
        FROM unnest(attempt_questions.option_order) AS option_ids(option_id)
        JOIN public.quiz_options AS options ON options.id = option_ids.option_id
      )
    ) ORDER BY attempt_questions.display_order
  ) INTO questions_json
  FROM public.quiz_attempt_question_order AS attempt_questions
  JOIN public.quiz_questions AS questions ON questions.id = attempt_questions.question_id
  WHERE attempt_questions.attempt_id = attempt_row.id;

  SELECT '{}'::JSONB INTO answers_json;

  RETURN jsonb_build_object(
    'success', true,
    'attemptId', attempt_row.id,
    'startedAt', attempt_row.started_at,
    'expiresAt', attempt_row.expires_at,
    'tabSwitchCount', attempt_row.tab_switch_count,
    'quiz', jsonb_build_object('id', quiz_row.id, 'title', quiz_row.title, 'duration_minutes', quiz_row.duration_minutes),
    'questions', COALESCE(questions_json, '[]'::JSONB),
    'answers', COALESCE(answers_json, '{}'::JSONB)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.save_quiz_answer(
  p_attempt_id UUID,
  p_question_id UUID,
  p_option_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  attempt_row public.quiz_attempts%ROWTYPE;
BEGIN
  SELECT * INTO attempt_row
  FROM public.quiz_attempts
  WHERE id = p_attempt_id
    AND student_id = auth.uid()
  FOR UPDATE;

  IF NOT FOUND OR attempt_row.status <> 'in_progress' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Active attempt not found');
  END IF;

  IF attempt_row.expires_at IS NOT NULL AND attempt_row.expires_at <= clock_timestamp() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Quiz time has expired');
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.quiz_attempt_question_order AS attempt_questions
    WHERE attempt_questions.attempt_id = p_attempt_id
      AND attempt_questions.question_id = p_question_id
      AND p_option_id = ANY(attempt_questions.option_order)
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Answer does not belong to this attempt');
  END IF;

  INSERT INTO public.quiz_answers (attempt_id, question_id, selected_option_id, is_correct, marks_awarded)
  VALUES (p_attempt_id, p_question_id, p_option_id, NULL, 0)
  ON CONFLICT (attempt_id, question_id)
  DO UPDATE SET selected_option_id = EXCLUDED.selected_option_id, is_correct = NULL, marks_awarded = 0;

  RETURN jsonb_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.record_quiz_focus_event(p_attempt_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  attempt_row public.quiz_attempts%ROWTYPE;
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

  RETURN jsonb_build_object('success', true, 'tabSwitchCount', attempt_row.tab_switch_count);
END;
$$;

CREATE OR REPLACE FUNCTION public.submit_quiz_attempt(p_attempt_id UUID, p_answers JSONB DEFAULT '{}'::JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN public.finalize_quiz_attempt(p_attempt_id, p_answers);
END;
$$;

REVOKE ALL ON FUNCTION public.prevent_quiz_content_changes_after_attempt() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.prevent_unpublishing_active_quiz() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.add_quiz_question(UUID, TEXT, INTEGER, TEXT, JSONB) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.finalize_quiz_attempt(UUID, JSONB) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.start_quiz_attempt(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.save_quiz_answer(UUID, UUID, UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.record_quiz_focus_event(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.submit_quiz_attempt(UUID, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.start_quiz_attempt(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_quiz_question(UUID, TEXT, INTEGER, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.save_quiz_answer(UUID, UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_quiz_focus_event(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_quiz_attempt(UUID, JSONB) TO authenticated;

DROP TRIGGER IF EXISTS prevent_question_changes_after_attempt ON public.quiz_questions;
CREATE TRIGGER prevent_question_changes_after_attempt
  BEFORE INSERT OR UPDATE OR DELETE ON public.quiz_questions
  FOR EACH ROW EXECUTE FUNCTION public.prevent_quiz_content_changes_after_attempt();
DROP TRIGGER IF EXISTS prevent_option_changes_after_attempt ON public.quiz_options;
CREATE TRIGGER prevent_option_changes_after_attempt
  BEFORE INSERT OR UPDATE OR DELETE ON public.quiz_options
  FOR EACH ROW EXECUTE FUNCTION public.prevent_quiz_content_changes_after_attempt();
DROP TRIGGER IF EXISTS prevent_unpublishing_active_quiz ON public.quizzes;
CREATE TRIGGER prevent_unpublishing_active_quiz
  BEFORE UPDATE OF status ON public.quizzes
  FOR EACH ROW EXECUTE FUNCTION public.prevent_unpublishing_active_quiz();
