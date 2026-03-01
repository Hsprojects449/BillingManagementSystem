-- Add total_birds column to invoices table
ALTER TABLE invoices
ADD COLUMN total_birds INTEGER DEFAULT 0;

COMMENT ON COLUMN invoices.total_birds IS 'Total number of birds for per-bird adjustment calculation';
