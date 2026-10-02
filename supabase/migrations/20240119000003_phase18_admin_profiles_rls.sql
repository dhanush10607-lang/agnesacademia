-- Phase 18: Allow Administrators to manage profiles

-- Administrators can update any profile (role, status, locks)
CREATE POLICY "Administrators can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'administrator')
);
