-- Add due_days_type column to clients table
-- This allows specifying if due_days is a fixed number of days or end of the billed month

ALTER TABLE clients
ADD COLUMN due_days_type VARCHAR(50) DEFAULT 'fixed_days' CHECK (due_days_type IN ('fixed_days', 'end_of_month'));

-- Add comment to document the column
COMMENT ON COLUMN clients.due_days_type IS 'Type of due days: "fixed_days" for numeric days, "end_of_month" for end of the billed month';
