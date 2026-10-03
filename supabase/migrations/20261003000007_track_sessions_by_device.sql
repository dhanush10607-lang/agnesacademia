ALTER TABLE public.user_sessions
    ADD COLUMN IF NOT EXISTS device_id TEXT;

UPDATE public.user_sessions
SET device_id = session_id
WHERE device_id IS NULL;

ALTER TABLE public.user_sessions
    ALTER COLUMN device_id SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS user_sessions_user_device_idx
    ON public.user_sessions (user_id, device_id);
