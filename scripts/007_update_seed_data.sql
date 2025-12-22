-- Insert demo organizations
INSERT INTO public.organizations (id, name, email, phone) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Acme Corporation', 'contact@acme.com', '555-0100'),
  ('22222222-2222-2222-2222-222222222222', 'Beta Industries', 'info@beta.com', '555-0200')
ON CONFLICT DO NOTHING;

-- Update existing profiles to have organization_id
-- This assumes profiles already exist from sign up

-- Update seed data to include organization_id
UPDATE public.clients SET organization_id = '11111111-1111-1111-1111-111111111111' WHERE organization_id IS NULL;
UPDATE public.products SET organization_id = '11111111-1111-1111-1111-111111111111' WHERE organization_id IS NULL;
UPDATE public.invoices SET organization_id = '11111111-1111-1111-1111-111111111111' WHERE organization_id IS NULL;
UPDATE public.payments SET organization_id = '11111111-1111-1111-1111-111111111111' WHERE organization_id IS NULL;
