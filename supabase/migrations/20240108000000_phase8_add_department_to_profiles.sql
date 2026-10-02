-- Add department_id to profiles for Faculty tracking

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id);
