-- Phase 7: Student Contributions & Moderation

-- Add moderation_note to resources, question_papers, question_banks, syllabi
ALTER TABLE public.resources ADD COLUMN moderation_note TEXT;
ALTER TABLE public.question_papers ADD COLUMN moderation_note TEXT;
ALTER TABLE public.question_banks ADD COLUMN moderation_note TEXT;
ALTER TABLE public.syllabi ADD COLUMN moderation_note TEXT;

-- Create Resource Reports Table
CREATE TABLE public.resource_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_type public.item_type NOT NULL, -- Enum created in phase 6
    item_id UUID NOT NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, resolved, dismissed
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES public.profiles(id)
);

-- Create Audit Log Table
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    action TEXT NOT NULL, -- 'submitted', 'approved', 'rejected', 'reported', 'archived'
    item_type public.item_type NOT NULL,
    item_id UUID NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.resource_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Students can insert reports
CREATE POLICY "Users can submit reports" ON public.resource_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Students can view their own reports
CREATE POLICY "Users can view their own reports" ON public.resource_reports FOR SELECT USING (auth.uid() = user_id);

-- Moderators and Admins can view/update all reports (using role checking via application logic or DB function)
CREATE POLICY "Moderators can view reports" ON public.resource_reports FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'administrator'))
);
CREATE POLICY "Moderators can update reports" ON public.resource_reports FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'administrator'))
);

-- Audit logs
CREATE POLICY "Users can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own audit logs" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Moderators can view all audit logs" ON public.audit_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'administrator'))
);

-- Give moderators access to view all resources regardless of status
CREATE POLICY "Moderators can view all resources" ON public.resources FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'administrator'))
);
CREATE POLICY "Moderators can update all resources" ON public.resources FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'administrator'))
);

CREATE POLICY "Moderators can view all question papers" ON public.question_papers FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'administrator'))
);
CREATE POLICY "Moderators can update all question papers" ON public.question_papers FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'administrator'))
);

CREATE POLICY "Moderators can view all question banks" ON public.question_banks FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'administrator'))
);
CREATE POLICY "Moderators can update all question banks" ON public.question_banks FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'administrator'))
);

CREATE POLICY "Moderators can view all syllabi" ON public.syllabi FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'administrator'))
);
CREATE POLICY "Moderators can update all syllabi" ON public.syllabi FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'administrator'))
);
