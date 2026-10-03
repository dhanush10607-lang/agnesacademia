DROP VIEW IF EXISTS public.global_search;

CREATE VIEW public.global_search
WITH (security_invoker = true)
AS
SELECT
    r.id,
    r.title,
    r.description,
    c.name AS category_name,
    'resource'::text AS item_type,
    r.subject_id,
    s.name AS subject_name,
    pr.department_id,
    ay.programme_id,
    s.semester_id,
    sem.academic_year_id,
    r.status::text AS status,
    r.uploader_id AS author_id,
    p.full_name AS author_name,
    p.role AS author_role,
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

SELECT
    qp.id,
    qp.title,
    qp.description,
    qp.exam_type::text AS category_name,
    'question_paper'::text AS item_type,
    qp.subject_id,
    s.name AS subject_name,
    pr.department_id,
    qp.programme_id,
    qp.semester_id,
    qp.academic_year_id,
    qp.status::text AS status,
    qp.uploader_id AS author_id,
    p.full_name AS author_name,
    p.role AS author_role,
    qp.search_vector,
    qp.view_count,
    qp.download_count,
    qp.created_at
FROM public.question_papers qp
LEFT JOIN public.subjects s ON qp.subject_id = s.id
LEFT JOIN public.programmes pr ON qp.programme_id = pr.id
LEFT JOIN public.profiles p ON qp.uploader_id = p.id

UNION ALL

SELECT
    qb.id,
    qb.title,
    qb.description,
    'Question Bank'::text AS category_name,
    'question_bank'::text AS item_type,
    qb.subject_id,
    s.name AS subject_name,
    pr.department_id,
    ay.programme_id,
    s.semester_id,
    sem.academic_year_id,
    qb.status::text AS status,
    qb.created_by AS author_id,
    p.full_name AS author_name,
    p.role AS author_role,
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

SELECT
    sy.id,
    sy.course_code AS title,
    sy.course_objectives AS description,
    'Syllabus'::text AS category_name,
    'syllabus'::text AS item_type,
    sy.subject_id,
    s.name AS subject_name,
    pr.department_id,
    ay.programme_id,
    s.semester_id,
    sem.academic_year_id,
    sy.status::text AS status,
    sy.created_by AS author_id,
    p.full_name AS author_name,
    p.role AS author_role,
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

SELECT
    n.id,
    n.title,
    n.content AS description,
    nc.name AS category_name,
    'notice'::text AS item_type,
    n.subject_id,
    s.name AS subject_name,
    n.department_id,
    n.programme_id,
    n.semester_id,
    NULL::uuid AS academic_year_id,
    n.status::text AS status,
    n.created_by AS author_id,
    p.full_name AS author_name,
    p.role AS author_role,
    n.search_vector,
    n.view_count,
    0::bigint AS download_count,
    n.created_at
FROM public.notices n
JOIN public.notice_categories nc ON n.category_id = nc.id
LEFT JOIN public.subjects s ON n.subject_id = s.id
LEFT JOIN public.profiles p ON n.created_by = p.id;

GRANT SELECT ON public.global_search TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload schema';
