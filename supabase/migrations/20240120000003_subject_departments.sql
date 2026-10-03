CREATE TABLE IF NOT EXISTS public.subject_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(subject_id, department_id)
);

-- Migrate existing data
INSERT INTO public.subject_departments (subject_id, department_id)
SELECT id, department_id FROM public.subjects WHERE department_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- RLS Policies
ALTER TABLE public.subject_departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all" ON public.subject_departments FOR SELECT USING (true);
CREATE POLICY "Allow all access to administrators" ON public.subject_departments FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'administrator')
);
