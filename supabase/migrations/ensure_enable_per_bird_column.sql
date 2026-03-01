-- Ensure the enable_per_bird column exists on clients
-- This migration is idempotent and will not fail if the column is already present.

ALTER TABLE IF EXISTS clients
ADD COLUMN IF NOT EXISTS enable_per_bird BOOLEAN DEFAULT false;

COMMENT ON COLUMN clients.enable_per_bird IS 'Whether to enable per-bird adjustment for this client';
