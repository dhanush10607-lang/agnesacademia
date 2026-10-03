CREATE TABLE IF NOT EXISTS public.user_sessions (
    session_id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    browser TEXT NOT NULL,
    operating_system TEXT NOT NULL,
    device_type TEXT NOT NULL,
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS user_sessions_user_last_seen_idx
    ON public.user_sessions (user_id, last_seen_at DESC)
    WHERE revoked_at IS NULL;

ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;
CREATE POLICY "Users can view their own sessions"
    ON public.user_sessions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own sessions" ON public.user_sessions;
CREATE POLICY "Users can create their own sessions"
    ON public.user_sessions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own sessions" ON public.user_sessions;
CREATE POLICY "Users can update their own sessions"
    ON public.user_sessions FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE ON public.user_sessions TO authenticated;
