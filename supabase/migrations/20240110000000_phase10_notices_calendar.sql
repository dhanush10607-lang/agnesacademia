-- Phase 10: Notices + Academic Calendar Schema

-- 1. Notice Categories
CREATE TABLE public.notice_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default categories
INSERT INTO public.notice_categories (name, description) VALUES
('Academic', 'General academic information'),
('Examination', 'Exam schedules, rules, and results'),
('Admission', 'Admission related information'),
('Department', 'Department specific notices'),
('Assignment', 'Assignment and coursework deadlines'),
('Event', 'College and department events'),
('Scholarship', 'Scholarship opportunities and deadlines'),
('Placement', 'Campus placement and internships'),
('NCC', 'NCC and NSS activities'),
('Student Activities', 'Clubs, sports, and cultural events'),
('General', 'Miscellaneous notices');

-- 2. Notices Table
CREATE TABLE public.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES public.notice_categories(id),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'important', 'urgent')),
    
    -- Targeting
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    programme_id UUID REFERENCES public.programmes(id) ON DELETE CASCADE,
    semester_id UUID REFERENCES public.semesters(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    
    attachment_path TEXT,
    status TEXT NOT NULL DEFAULT 'published', -- draft, published, archived
    expiry_date TIMESTAMPTZ,
    
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Calendar Events Table
CREATE TABLE public.calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    location TEXT,
    category TEXT NOT NULL CHECK (category IN (
        'Examination', 'Internal Assessment', 'Assignment Deadline', 
        'Holiday', 'College Event', 'Department Event', 
        'Seminar', 'Workshop', 'Admission', 'Other'
    )),
    
    -- Targeting
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    programme_id UUID REFERENCES public.programmes(id) ON DELETE CASCADE,
    semester_id UUID REFERENCES public.semesters(id) ON DELETE CASCADE,
    
    status TEXT NOT NULL DEFAULT 'published', -- draft, published, cancelled, archived
    
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Future Notifications Architecture (Prepared for Phase 13)
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    type TEXT NOT NULL DEFAULT 'in_app', -- in_app, email, push
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.notice_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Notice Categories
CREATE POLICY "Notice categories viewable by everyone" ON public.notice_categories FOR SELECT USING (true);
CREATE POLICY "Admins manage notice categories" ON public.notice_categories FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'administrator')
);

-- Notices
-- Viewable by everyone (Filtering happens in UI/queries based on relevance, but globally accessible if linked)
CREATE POLICY "Published notices viewable by everyone" ON public.notices FOR SELECT USING (status = 'published');
CREATE POLICY "Faculty can manage their own notices" ON public.notices FOR ALL USING (auth.uid() = created_by);
CREATE POLICY "Admins can view all notices" ON public.notices FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'administrator'))
);

-- Calendar Events
CREATE POLICY "Published events viewable by everyone" ON public.calendar_events FOR SELECT USING (status IN ('published', 'cancelled'));
CREATE POLICY "Faculty can manage their own events" ON public.calendar_events FOR ALL USING (auth.uid() = created_by);
CREATE POLICY "Admins can view all events" ON public.calendar_events FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'administrator'))
);

-- Notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
