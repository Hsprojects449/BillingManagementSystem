-- Add enable_per_bird column to clients table
ALTER TABLE clients
ADD COLUMN enable_per_bird BOOLEAN DEFAULT false;

COMMENT ON COLUMN clients.enable_per_bird IS 'Whether to enable per-bird adjustment for this client';
