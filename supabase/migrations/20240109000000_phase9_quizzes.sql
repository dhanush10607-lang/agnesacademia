-- Phase 9: Quizzes Schema

-- 1. Quizzes Table
CREATE TABLE public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    unit_name TEXT,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    duration_minutes INTEGER, -- if null, no time limit
    passing_score_percentage INTEGER DEFAULT 40,
    status TEXT NOT NULL DEFAULT 'draft', -- draft, published, archived
    max_attempts INTEGER, -- if null, infinite
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Quiz Questions Table
CREATE TABLE public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'mcq', -- mcq, tf, fitb, multiple
    marks INTEGER NOT NULL DEFAULT 1,
    explanation TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Quiz Options Table
CREATE TABLE public.quiz_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    order_index INTEGER NOT NULL DEFAULT 0
);

-- 4. Quiz Attempts Table
CREATE TABLE public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    score INTEGER,
    total_marks INTEGER,
    percentage DECIMAL(5,2),
    is_passed BOOLEAN,
    status TEXT NOT NULL DEFAULT 'in_progress' -- in_progress, completed, abandoned
);

-- 5. Quiz Answers Table
CREATE TABLE public.quiz_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
    selected_option_id UUID REFERENCES public.quiz_options(id),
    text_answer TEXT, -- For fill in the blank
    is_correct BOOLEAN,
    marks_awarded INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Quizzes
CREATE POLICY "Published quizzes are viewable by everyone" ON public.quizzes FOR SELECT USING (status = 'published');
CREATE POLICY "Faculty can view and manage their own quizzes" ON public.quizzes FOR ALL USING (auth.uid() = created_by);
CREATE POLICY "Admins can view all quizzes" ON public.quizzes FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'administrator'))
);

-- Quiz Questions
-- Students can only see questions of published quizzes
CREATE POLICY "Questions of published quizzes viewable by everyone" ON public.quiz_questions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.quizzes WHERE id = quiz_id AND status = 'published')
);
CREATE POLICY "Faculty manage their own quiz questions" ON public.quiz_questions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.quizzes WHERE id = quiz_id AND created_by = auth.uid())
);

-- Quiz Options
-- Crucial: Students can see options, but we shouldn't let them easily fetch `is_correct` in client if we can avoid it.
-- However, RLS returns all columns. We'll strip `is_correct` in the Next.js server before passing to client.
CREATE POLICY "Options of published quizzes viewable by everyone" ON public.quiz_options FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.quiz_questions q 
        JOIN public.quizzes qz ON q.quiz_id = qz.id 
        WHERE q.id = question_id AND qz.status = 'published'
    )
);
CREATE POLICY "Faculty manage their own quiz options" ON public.quiz_options FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.quiz_questions q 
        JOIN public.quizzes qz ON q.quiz_id = qz.id 
        WHERE q.id = question_id AND qz.created_by = auth.uid()
    )
);

-- Quiz Attempts
CREATE POLICY "Students can view and manage their own attempts" ON public.quiz_attempts FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Faculty can view attempts for their quizzes" ON public.quiz_attempts FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.quizzes WHERE id = quiz_id AND created_by = auth.uid())
);

-- Quiz Answers
CREATE POLICY "Students can view and manage their own answers" ON public.quiz_answers FOR ALL USING (
    EXISTS (SELECT 1 FROM public.quiz_attempts WHERE id = attempt_id AND student_id = auth.uid())
);
CREATE POLICY "Faculty can view answers for their quizzes" ON public.quiz_answers FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.quiz_attempts a
        JOIN public.quizzes q ON a.quiz_id = q.id
        WHERE a.id = attempt_id AND q.created_by = auth.uid()
    )
);
