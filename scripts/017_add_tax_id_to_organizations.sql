-- Add tax_id column to organizations (nullable)
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS tax_id text;
