-- Phase 6: Student Dashboard & Interactions

-- 1. Modify Bookmarks to support generic items
-- Drop the existing bookmarks table from phase 4
DROP TABLE IF EXISTS public.bookmarks;

CREATE TYPE public.item_type AS ENUM ('note', 'question_paper', 'question_bank', 'question', 'syllabus', 'video', 'other');

CREATE TABLE public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_type item_type NOT NULL,
    item_id UUID NOT NULL, -- Logical reference to various tables
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id)
);

-- 2. Recently Viewed (History)
CREATE TABLE public.recently_viewed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_type item_type NOT NULL,
    item_id UUID NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id)
);

-- 3. Student Preferences (for Dashboard configuration)
CREATE TABLE public.student_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'system',
    email_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_preferences ENABLE ROW LEVEL SECURITY;

-- Bookmarks: Users can only see and manage their own bookmarks
CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bookmarks" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Recently Viewed: Users can only see and manage their own history
CREATE POLICY "Users can view their own history" ON public.recently_viewed FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own history" ON public.recently_viewed FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own history" ON public.recently_viewed FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own history" ON public.recently_viewed FOR DELETE USING (auth.uid() = user_id);

-- Preferences: Users can manage their own preferences
CREATE POLICY "Users can view their own preferences" ON public.student_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own preferences" ON public.student_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON public.student_preferences FOR UPDATE USING (auth.uid() = user_id);

-- Trigger to automatically update recently_viewed timestamp on conflict
CREATE OR REPLACE FUNCTION public.handle_recently_viewed_upsert()
RETURNS trigger AS $$
BEGIN
    NEW.viewed_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_recently_viewed_upsert
    BEFORE UPDATE ON public.recently_viewed
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_recently_viewed_upsert();
