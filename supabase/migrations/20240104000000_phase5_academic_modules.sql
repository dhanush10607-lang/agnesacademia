-- Phase 5: Question Papers, Question Banks & Syllabus

-- 1. Question Papers
CREATE TYPE public.exam_type AS ENUM (
    'mid_semester', 'internal', 'end_semester', 'model', 'previous_year', 'practice', 'other'
);

CREATE TABLE public.question_papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    programme_id UUID NOT NULL REFERENCES public.programmes(id) ON DELETE CASCADE,
    semester_id UUID NOT NULL REFERENCES public.semesters(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
    exam_type exam_type NOT NULL,
    exam_date DATE,
    status public.resource_status NOT NULL DEFAULT 'draft',
    uploader_id UUID NOT NULL REFERENCES public.profiles(id),
    file_path TEXT,
    file_type TEXT,
    file_size BIGINT,
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'B')
    ) STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX question_papers_search_idx ON public.question_papers USING GIN (search_vector);
CREATE INDEX question_papers_subject_idx ON public.question_papers (subject_id);
CREATE INDEX question_papers_status_idx ON public.question_papers (status);

-- 2. Question Banks & Questions
CREATE TABLE public.question_banks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status public.resource_status NOT NULL DEFAULT 'draft',
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.question_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_bank_id UUID NOT NULL REFERENCES public.question_banks(id) ON DELETE CASCADE,
    unit_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(question_bank_id, unit_number)
);

CREATE TYPE public.question_type AS ENUM (
    'short_answer', 'long_answer', 'mcq', 'fill_in_blank', 'true_false', 'descriptive'
);

CREATE TABLE public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL REFERENCES public.question_units(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    marks INTEGER NOT NULL,
    question_type question_type NOT NULL,
    answer_text TEXT, -- Optional answer/hints
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(question_text, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(answer_text, '')), 'C')
    ) STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX questions_search_idx ON public.questions USING GIN (search_vector);

-- 3. Syllabi
CREATE TABLE public.syllabi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL UNIQUE REFERENCES public.subjects(id) ON DELETE CASCADE,
    course_code TEXT,
    credits INTEGER,
    contact_hours INTEGER,
    course_objectives TEXT,
    learning_outcomes TEXT,
    recommended_books TEXT,
    reference_materials TEXT,
    status public.resource_status NOT NULL DEFAULT 'draft',
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    file_path TEXT,
    file_type TEXT,
    file_size BIGINT,
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(course_objectives, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(learning_outcomes, '')), 'B')
    ) STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX syllabi_search_idx ON public.syllabi USING GIN (search_vector);

CREATE TABLE public.syllabus_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    syllabus_id UUID NOT NULL REFERENCES public.syllabi(id) ON DELETE CASCADE,
    unit_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    contact_hours INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(syllabus_id, unit_number)
);

-- RLS Policies
ALTER TABLE public.question_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syllabi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syllabus_units ENABLE ROW LEVEL SECURITY;

-- Read Access: Published content viewable by everyone
CREATE POLICY "Published question papers viewable by everyone" ON public.question_papers FOR SELECT USING (status = 'published');
CREATE POLICY "Published question banks viewable by everyone" ON public.question_banks FOR SELECT USING (status = 'published');
CREATE POLICY "Question units viewable if bank is published" ON public.question_units FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.question_banks b WHERE b.id = question_bank_id AND b.status = 'published')
);
CREATE POLICY "Questions viewable if bank is published" ON public.questions FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.question_units u 
        JOIN public.question_banks b ON b.id = u.question_bank_id 
        WHERE u.id = unit_id AND b.status = 'published'
    )
);
CREATE POLICY "Published syllabi viewable by everyone" ON public.syllabi FOR SELECT USING (status = 'published');
CREATE POLICY "Syllabus units viewable if syllabus is published" ON public.syllabus_units FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.syllabi s WHERE s.id = syllabus_id AND s.status = 'published')
);

-- Uploader/Creator Read Access (can view their own drafts)
CREATE POLICY "Uploaders can view their question papers" ON public.question_papers FOR SELECT USING (auth.uid() = uploader_id);
CREATE POLICY "Creators can view their question banks" ON public.question_banks FOR SELECT USING (auth.uid() = created_by);
CREATE POLICY "Creators can view their syllabi" ON public.syllabi FOR SELECT USING (auth.uid() = created_by);

-- Upload/Update access (Only faculty/admins - assuming role checks are handled via DB triggers/functions or application logic)
-- For simplicity in phase 5, matching standard uploader logic
CREATE POLICY "Uploaders can insert question papers" ON public.question_papers FOR INSERT WITH CHECK (auth.uid() = uploader_id);
CREATE POLICY "Uploaders can update their question papers" ON public.question_papers FOR UPDATE USING (auth.uid() = uploader_id);

CREATE POLICY "Creators can insert question banks" ON public.question_banks FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators can update their question banks" ON public.question_banks FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Creators can insert syllabi" ON public.syllabi FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators can update their syllabi" ON public.syllabi FOR UPDATE USING (auth.uid() = created_by);

-- Note: units and questions assume creator of parent has access. In production, wrap in a function.
CREATE POLICY "Creators can manage question units" ON public.question_units FOR ALL USING (
    EXISTS (SELECT 1 FROM public.question_banks b WHERE b.id = question_bank_id AND b.created_by = auth.uid())
);
CREATE POLICY "Creators can manage questions" ON public.questions FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.question_units u 
        JOIN public.question_banks b ON b.id = u.question_bank_id 
        WHERE u.id = unit_id AND b.created_by = auth.uid()
    )
);
CREATE POLICY "Creators can manage syllabus units" ON public.syllabus_units FOR ALL USING (
    EXISTS (SELECT 1 FROM public.syllabi s WHERE s.id = syllabus_id AND s.created_by = auth.uid())
);
