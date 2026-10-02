-- Phase 12: Advanced Search & Discovery

-- 1. Add view_count and download_count to content tables if they don't exist
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS view_count BIGINT DEFAULT 0;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS download_count BIGINT DEFAULT 0;

ALTER TABLE public.question_papers ADD COLUMN IF NOT EXISTS view_count BIGINT DEFAULT 0;
ALTER TABLE public.question_papers ADD COLUMN IF NOT EXISTS download_count BIGINT DEFAULT 0;

ALTER TABLE public.question_banks ADD COLUMN IF NOT EXISTS view_count BIGINT DEFAULT 0;
ALTER TABLE public.question_banks ADD COLUMN IF NOT EXISTS download_count BIGINT DEFAULT 0;

ALTER TABLE public.syllabi ADD COLUMN IF NOT EXISTS view_count BIGINT DEFAULT 0;
ALTER TABLE public.syllabi ADD COLUMN IF NOT EXISTS download_count BIGINT DEFAULT 0;

ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS view_count BIGINT DEFAULT 0;

-- 2. Add search_vector to tables that missed it
ALTER TABLE public.question_banks 
ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
) STORED;
CREATE INDEX IF NOT EXISTS question_banks_search_idx ON public.question_banks USING GIN (search_vector);

ALTER TABLE public.notices 
ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B')
) STORED;
CREATE INDEX IF NOT EXISTS notices_search_idx ON public.notices USING GIN (search_vector);

-- 3. Create Search History Table
CREATE TABLE public.search_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own search history" ON public.search_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own search history" ON public.search_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own search history" ON public.search_history FOR DELETE USING (auth.uid() = user_id);

-- 4. Create Global Search View
DROP VIEW IF EXISTS public.global_search;

CREATE VIEW public.global_search AS
-- RESOURCES
SELECT 
    r.id,
    r.title,
    r.description,
    c.name AS category_name,
    'resource' AS item_type,
    r.subject_id,
    s.name AS subject_name,
    pr.department_id,
    ay.programme_id,
    s.semester_id,
    sem.academic_year_id,
    r.status::text AS status,
    r.uploader_id AS author_id,
    p.full_name AS author_name,
    r.search_vector,
    r.view_count,
    r.download_count,
    r.created_at
FROM public.resources r
JOIN public.resource_categories c ON r.category_id = c.id
LEFT JOIN public.subjects s ON r.subject_id = s.id
LEFT JOIN public.semesters sem ON s.semester_id = sem.id
LEFT JOIN public.academic_years ay ON sem.academic_year_id = ay.id
LEFT JOIN public.programmes pr ON ay.programme_id = pr.id
LEFT JOIN public.profiles p ON r.uploader_id = p.id

UNION ALL

-- QUESTION PAPERS (Note: qp already has explicit programme/semester/academic_year IDs, but we can still pull department from programmes)
SELECT 
    qp.id,
    qp.title,
    qp.description,
    qp.exam_type::text AS category_name,
    'question_paper' AS item_type,
    qp.subject_id,
    s.name AS subject_name,
    pr.department_id,
    qp.programme_id,
    qp.semester_id,
    qp.academic_year_id,
    qp.status::text AS status,
    qp.uploader_id AS author_id,
    p.full_name AS author_name,
    qp.search_vector,
    qp.view_count,
    qp.download_count,
    qp.created_at
FROM public.question_papers qp
LEFT JOIN public.subjects s ON qp.subject_id = s.id
LEFT JOIN public.programmes pr ON qp.programme_id = pr.id
LEFT JOIN public.profiles p ON qp.uploader_id = p.id

UNION ALL

-- QUESTION BANKS
SELECT 
    qb.id,
    qb.title,
    qb.description,
    'Question Bank' AS category_name,
    'question_bank' AS item_type,
    qb.subject_id,
    s.name AS subject_name,
    pr.department_id,
    ay.programme_id,
    s.semester_id,
    sem.academic_year_id,
    qb.status::text AS status,
    qb.created_by AS author_id,
    p.full_name AS author_name,
    qb.search_vector,
    qb.view_count,
    qb.download_count,
    qb.created_at
FROM public.question_banks qb
LEFT JOIN public.subjects s ON qb.subject_id = s.id
LEFT JOIN public.semesters sem ON s.semester_id = sem.id
LEFT JOIN public.academic_years ay ON sem.academic_year_id = ay.id
LEFT JOIN public.programmes pr ON ay.programme_id = pr.id
LEFT JOIN public.profiles p ON qb.created_by = p.id

UNION ALL

-- SYLLABI
SELECT 
    sy.id,
    sy.course_code AS title,
    sy.course_objectives AS description,
    'Syllabus' AS category_name,
    'syllabus' AS item_type,
    sy.subject_id,
    s.name AS subject_name,
    pr.department_id,
    ay.programme_id,
    s.semester_id,
    sem.academic_year_id,
    sy.status::text AS status,
    sy.created_by AS author_id,
    p.full_name AS author_name,
    sy.search_vector,
    sy.view_count,
    sy.download_count,
    sy.created_at
FROM public.syllabi sy
LEFT JOIN public.subjects s ON sy.subject_id = s.id
LEFT JOIN public.semesters sem ON s.semester_id = sem.id
LEFT JOIN public.academic_years ay ON sem.academic_year_id = ay.id
LEFT JOIN public.programmes pr ON ay.programme_id = pr.id
LEFT JOIN public.profiles p ON sy.created_by = p.id

UNION ALL

-- NOTICES
SELECT 
    n.id,
    n.title,
    n.content AS description,
    nc.name AS category_name,
    'notice' AS item_type,
    n.subject_id,
    s.name AS subject_name,
    n.department_id,
    n.programme_id,
    n.semester_id,
    NULL::uuid AS academic_year_id,
    n.status,
    n.created_by AS author_id,
    p.full_name AS author_name,
    n.search_vector,
    n.view_count,
    0::BIGINT AS download_count,
    n.created_at
FROM public.notices n
JOIN public.notice_categories nc ON n.category_id = nc.id
LEFT JOIN public.subjects s ON n.subject_id = s.id
LEFT JOIN public.profiles p ON n.created_by = p.id;
