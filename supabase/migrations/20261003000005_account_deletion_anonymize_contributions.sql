ALTER TABLE public.admin_settings
    ALTER COLUMN updated_by DROP NOT NULL;

ALTER TABLE public.announcements
    ALTER COLUMN created_by DROP NOT NULL;

ALTER TABLE public.app_settings
    ALTER COLUMN updated_by DROP NOT NULL;

ALTER TABLE public.assignments
    ALTER COLUMN created_by DROP NOT NULL;

ALTER TABLE public.audit_logs
    ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.calendar_events
    ALTER COLUMN created_by DROP NOT NULL;

ALTER TABLE public.notices
    ALTER COLUMN created_by DROP NOT NULL;

ALTER TABLE public.question_banks
    ALTER COLUMN created_by DROP NOT NULL;

ALTER TABLE public.question_papers
    ALTER COLUMN uploader_id DROP NOT NULL;

ALTER TABLE public.quizzes
    ALTER COLUMN created_by DROP NOT NULL;

ALTER TABLE public.resources
    ALTER COLUMN uploader_id DROP NOT NULL;

ALTER TABLE public.syllabi
    ALTER COLUMN created_by DROP NOT NULL;
