-- Update invoice status enum to include 'recorded'
-- First, drop the default constraint on the status column
ALTER TABLE invoices ALTER COLUMN status DROP DEFAULT;

-- Rename old enum
ALTER TYPE invoice_status RENAME TO invoice_status_old;

-- Create new enum with all statuses
CREATE TYPE invoice_status AS ENUM ('draft', 'recorded', 'paid', 'overdue', 'cancelled');

-- Convert column to new type
ALTER TABLE invoices ALTER COLUMN status TYPE invoice_status USING status::text::invoice_status;

-- Set default back to 'draft'
ALTER TABLE invoices ALTER COLUMN status SET DEFAULT 'draft'::invoice_status;

-- Drop old enum
DROP TYPE invoice_status_old;
