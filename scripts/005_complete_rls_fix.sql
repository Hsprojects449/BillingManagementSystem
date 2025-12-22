-- Drop all existing problematic policies on profiles
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Drop problematic policies on other tables that reference profiles
DROP POLICY IF EXISTS "Super admins and admins can delete clients" ON public.clients;
DROP POLICY IF EXISTS "Super admins and admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Super admins and admins can delete invoices" ON public.invoices;
DROP POLICY IF EXISTS "Super admins and admins can update payments" ON public.payments;
DROP POLICY IF EXISTS "Super admins can delete payments" ON public.payments;

-- Create a security definer function to get user role (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role_value user_role;
BEGIN
  SELECT role INTO user_role_value
  FROM public.profiles
  WHERE id = user_id;
  
  RETURN user_role_value;
END;
$$;

-- Create a security definer function to check if user is admin or super_admin
CREATE OR REPLACE FUNCTION public.is_admin_or_super_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role_value user_role;
BEGIN
  SELECT role INTO user_role_value
  FROM public.profiles
  WHERE id = user_id;
  
  RETURN user_role_value IN ('admin', 'super_admin');
END;
$$;

-- Create a security definer function to check if user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role_value user_role;
BEGIN
  SELECT role INTO user_role_value
  FROM public.profiles
  WHERE id = user_id;
  
  RETURN user_role_value = 'super_admin';
END;
$$;

-- Profiles policies (fixed - no recursion)
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Super admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (public.is_super_admin(auth.uid()));

-- Clients policies (updated)
CREATE POLICY "Super admins and admins can delete clients"
  ON public.clients FOR DELETE
  USING (public.is_admin_or_super_admin(auth.uid()));

-- Products policies (updated)
CREATE POLICY "Super admins and admins can delete products"
  ON public.products FOR DELETE
  USING (public.is_admin_or_super_admin(auth.uid()));

-- Invoices policies (updated)
CREATE POLICY "Super admins and admins can delete invoices"
  ON public.invoices FOR DELETE
  USING (public.is_admin_or_super_admin(auth.uid()));

-- Payments policies (updated)
CREATE POLICY "Super admins and admins can update payments"
  ON public.payments FOR UPDATE
  USING (public.is_admin_or_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete payments"
  ON public.payments FOR DELETE
  USING (public.is_super_admin(auth.uid()));
