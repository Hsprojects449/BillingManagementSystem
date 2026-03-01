-- Add due_days_type column to invoices table
ALTER TABLE invoices
ADD COLUMN due_days_type VARCHAR(50) DEFAULT 'fixed_days' CHECK (due_days_type IN ('fixed_days', 'end_of_month'));

COMMENT ON COLUMN invoices.due_days_type IS 'Type of due date: "fixed_days" for numeric days, "end_of_month" for end of the billed month';
