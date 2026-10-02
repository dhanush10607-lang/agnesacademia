-- Phase 18: Profile, Settings & Account Management

-- 1. Extend profiles with academic lock
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_academic_locked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS academic_locked_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS academic_locked_by UUID REFERENCES public.profiles(id);

-- 2. Student Subjects Selection Table
CREATE TABLE IF NOT EXISTS public.student_subjects (
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    selected_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (student_id, subject_id)
);

-- Enable RLS for student_subjects
ALTER TABLE public.student_subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own selected subjects" 
ON public.student_subjects FOR SELECT 
USING (auth.uid() = student_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrator', 'moderator', 'faculty')));

CREATE POLICY "Students can insert their own subjects" 
ON public.student_subjects FOR INSERT 
WITH CHECK (auth.uid() = student_id AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_academic_locked = true));

CREATE POLICY "Students can delete their own subjects" 
ON public.student_subjects FOR DELETE 
USING (auth.uid() = student_id AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_academic_locked = true));

-- 3. User Preferences Table
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    theme TEXT DEFAULT 'system',
    text_size TEXT DEFAULT 'standard',
    reduced_motion BOOLEAN DEFAULT false,
    high_contrast BOOLEAN DEFAULT false,
    simple_mode BOOLEAN DEFAULT false,
    default_landing_page TEXT DEFAULT '/dashboard',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences" 
ON public.user_preferences FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" 
ON public.user_preferences FOR ALL 
USING (auth.uid() = user_id);

-- 4. Notification Preferences Table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    PRIMARY KEY (user_id, category)
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own notification preferences" 
ON public.notification_preferences FOR ALL 
USING (auth.uid() = user_id);

-- 5. Admin Settings Table
CREATE TABLE IF NOT EXISTS public.admin_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read admin settings" 
ON public.admin_settings FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage settings" 
ON public.admin_settings FOR ALL 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'administrator'));

-- Insert initial admin setting for academic profile lock
INSERT INTO public.admin_settings (key, value) VALUES ('global_academic_lock', 'false'::jsonb) ON CONFLICT (key) DO NOTHING;
