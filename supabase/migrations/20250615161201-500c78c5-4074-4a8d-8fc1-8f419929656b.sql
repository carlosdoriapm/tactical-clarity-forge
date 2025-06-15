
-- Create a custom type for application roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create the table to store user roles
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- Enable Row-Level Security for the user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow users to view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policy: Allow admins to view all roles
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
