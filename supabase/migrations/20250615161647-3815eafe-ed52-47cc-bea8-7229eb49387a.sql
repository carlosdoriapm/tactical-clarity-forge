
-- Drop the existing policies causing the recursion error
DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create a security definer function to check for admin role safely
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = p_user_id AND role = 'admin'
  );
$$;

-- Create a new, single policy for selecting roles
CREATE POLICY "Users can view user roles"
ON public.user_roles
FOR SELECT
USING (
  (auth.uid() = user_id) OR (public.is_admin(auth.uid()))
);
