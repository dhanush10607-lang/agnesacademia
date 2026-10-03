-- Allow the website to read active curricula while keeping curriculum
-- management restricted to administrators.
ALTER TABLE public.curricula ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view active curricula" ON public.curricula;
CREATE POLICY "Everyone can view active curricula"
ON public.curricula
FOR SELECT
USING (is_active IS TRUE);

DROP POLICY IF EXISTS "Admins can manage curricula" ON public.curricula;
CREATE POLICY "Admins can manage curricula"
ON public.curricula
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

DROP POLICY IF EXISTS "Everyone can view active curriculum subjects" ON public.curriculum_subjects;
CREATE POLICY "Everyone can view active curriculum subjects"
ON public.curriculum_subjects
FOR SELECT
USING (is_active IS TRUE);

DROP POLICY IF EXISTS "Admins can manage curriculum subjects" ON public.curriculum_subjects;
CREATE POLICY "Admins can manage curriculum subjects"
ON public.curriculum_subjects
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

DROP POLICY IF EXISTS "Everyone can view active subject types" ON public.subject_types;
CREATE POLICY "Everyone can view active subject types"
ON public.subject_types
FOR SELECT
USING (is_active IS TRUE);

DROP POLICY IF EXISTS "Admins can manage subject types" ON public.subject_types;
CREATE POLICY "Admins can manage subject types"
ON public.subject_types
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
