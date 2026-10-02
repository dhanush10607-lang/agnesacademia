-- Phase 11: Fix Admin RLS for Academic Structure

-- 1. Enable RLS explicitly
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if they conflict (to be safe)
DROP POLICY IF EXISTS "Admins can manage departments" ON public.departments;
DROP POLICY IF EXISTS "Everyone can view active departments" ON public.departments;
DROP POLICY IF EXISTS "Admins can manage programmes" ON public.programmes;
DROP POLICY IF EXISTS "Everyone can view active programmes" ON public.programmes;
DROP POLICY IF EXISTS "Admins can manage academic years" ON public.academic_years;
DROP POLICY IF EXISTS "Everyone can view active academic years" ON public.academic_years;
DROP POLICY IF EXISTS "Admins can manage semesters" ON public.semesters;
DROP POLICY IF EXISTS "Everyone can view active semesters" ON public.semesters;
DROP POLICY IF EXISTS "Admins can manage subjects" ON public.subjects;
DROP POLICY IF EXISTS "Everyone can view active subjects" ON public.subjects;

-- 3. Departments
CREATE POLICY "Admins can manage departments" ON public.departments FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'administrator')
);
CREATE POLICY "Everyone can view active departments" ON public.departments FOR SELECT USING (status = 'active');

-- 4. Programmes
CREATE POLICY "Admins can manage programmes" ON public.programmes FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'administrator')
);
CREATE POLICY "Everyone can view active programmes" ON public.programmes FOR SELECT USING (status = 'active');

-- 5. Academic Years
CREATE POLICY "Admins can manage academic years" ON public.academic_years FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'administrator')
);
CREATE POLICY "Everyone can view active academic years" ON public.academic_years FOR SELECT USING (status = 'active');

-- 6. Semesters
CREATE POLICY "Admins can manage semesters" ON public.semesters FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'administrator')
);
CREATE POLICY "Everyone can view active semesters" ON public.semesters FOR SELECT USING (status = 'active');

-- 7. Subjects
CREATE POLICY "Admins can manage subjects" ON public.subjects FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'administrator')
);
CREATE POLICY "Everyone can view active subjects" ON public.subjects FOR SELECT USING (status = 'active');
