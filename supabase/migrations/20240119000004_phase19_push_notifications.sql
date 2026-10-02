-- Phase 19: Push Notifications System

-- 1. Alter Existing Notifications Table (Created in Phase 10)
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'system',
ADD COLUMN IF NOT EXISTS action_url TEXT,
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Migrate old 'type' and 'link' to new schema if needed (optional, keeping both for backwards compatibility)
-- The application code has been updated to use category and action_url.

-- 2. Push Devices Table
CREATE TABLE IF NOT EXISTS public.push_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    registration_token TEXT NOT NULL,
    device_type TEXT,
    browser TEXT,
    operating_system TEXT,
    is_active BOOLEAN DEFAULT true,
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, registration_token)
);

-- 3. Notification Deliveries Table (Deduplication)
CREATE TABLE IF NOT EXISTS public.notification_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
    push_device_id UUID NOT NULL REFERENCES public.push_devices(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
    provider_message_id TEXT,
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(notification_id, push_device_id)
);

-- 4. RLS Policies
ALTER TABLE public.push_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_deliveries ENABLE ROW LEVEL SECURITY;

-- Notifications Policies (Additional policy for admins)
DROP POLICY IF EXISTS "Admins can insert notifications" ON public.notifications;
CREATE POLICY "Admins can insert notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('administrator', 'faculty', 'moderator'))
    );

-- Push Devices Policies
CREATE POLICY "Users can manage their own devices"
    ON public.push_devices FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Deliveries Policies
CREATE POLICY "Users can view their own deliveries"
    ON public.notification_deliveries FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM public.push_devices d WHERE d.id = push_device_id AND d.user_id = auth.uid())
    );

-- 5. Triggers for updated_at
DROP TRIGGER IF EXISTS set_updated_at_notifications ON public.notifications;
CREATE TRIGGER set_updated_at_notifications
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_push_devices
    BEFORE UPDATE ON public.push_devices
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_notification_deliveries
    BEFORE UPDATE ON public.notification_deliveries
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

