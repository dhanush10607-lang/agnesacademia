-- Phase FTUE: Extended onboarding preferences on profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_complete    BOOLEAN   NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS learning_interests     TEXT[]    DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS notification_prefs     TEXT[]    DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS theme_preference       TEXT      DEFAULT 'system',
  ADD COLUMN IF NOT EXISTS reduced_motion         BOOLEAN   NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS large_text             BOOLEAN   NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS high_contrast          BOOLEAN   NOT NULL DEFAULT FALSE;

-- Mark existing enrolled students as already onboarded
UPDATE public.profiles
   SET onboarding_complete = TRUE
 WHERE programme_id IS NOT NULL AND onboarding_complete = FALSE;
