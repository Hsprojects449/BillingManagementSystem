-- Drop existing problematic policies
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins and admins can delete clients" ON public.clients;
DROP POLICY IF EXISTS "Super admins and admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Super admins and admins can delete invoices" ON public.invoices;
DROP POLICY IF EXISTS "Super admins and admins can update payments" ON public.payments;
DROP POLICY IF EXISTS "Super admins can delete payments" ON public.payments;

-- Create a security definer function to get user role
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Recreate profiles policies without recursion
CREATE POLICY "Super admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (auth.user_role() = 'super_admin');

CREATE POLICY "Super admins can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.user_role() = 'super_admin');

CREATE POLICY "Super admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (auth.user_role() = 'super_admin');

-- Recreate clients delete policy
CREATE POLICY "Super admins and admins can delete clients"
  ON public.clients FOR DELETE
  USING (auth.user_role() IN ('super_admin', 'admin'));

-- Recreate products delete policy
CREATE POLICY "Super admins and admins can delete products"
  ON public.products FOR DELETE
  USING (auth.user_role() IN ('super_admin', 'admin'));

-- Recreate invoices delete policy
CREATE POLICY "Super admins and admins can delete invoices"
  ON public.invoices FOR DELETE
  USING (auth.user_role() IN ('super_admin', 'admin'));

-- Recreate payments update policy
CREATE POLICY "Super admins and admins can update payments"
  ON public.payments FOR UPDATE
  USING (auth.user_role() IN ('super_admin', 'admin'));

-- Recreate payments delete policy
CREATE POLICY "Super admins can delete payments"
  ON public.payments FOR DELETE
  USING (auth.user_role() = 'super_admin');
