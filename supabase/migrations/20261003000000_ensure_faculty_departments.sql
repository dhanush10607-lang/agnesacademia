CREATE TABLE IF NOT EXISTS public.faculty_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(faculty_id, department_id)
);

INSERT INTO public.faculty_departments (faculty_id, department_id)
SELECT id, department_id
FROM public.profiles
WHERE role = 'faculty' AND department_id IS NOT NULL
ON CONFLICT (faculty_id, department_id) DO NOTHING;

ALTER TABLE public.faculty_departments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to all" ON public.faculty_departments;
CREATE POLICY "Allow read access to all"
    ON public.faculty_departments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all access to administrators" ON public.faculty_departments;
CREATE POLICY "Allow all access to administrators"
    ON public.faculty_departments FOR ALL USING (
        EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE id = auth.uid() AND role = 'administrator'
        )
    );
