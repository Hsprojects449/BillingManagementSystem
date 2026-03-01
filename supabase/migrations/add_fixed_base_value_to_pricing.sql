-- Add fixed_base_value column to client_product_pricing table
-- This allows setting a fixed price directly without relying on daily category prices

ALTER TABLE client_product_pricing
ADD COLUMN fixed_base_value NUMERIC(10, 4) NULL;

-- Add a comment to document the column
COMMENT ON COLUMN client_product_pricing.fixed_base_value IS 'Optional fixed base value for pricing. When set, this value is used instead of a category-based price.';

-- Create an index on the new column for better query performance (optional)
CREATE INDEX idx_client_product_pricing_fixed_base_value 
ON client_product_pricing(fixed_base_value) 
WHERE fixed_base_value IS NOT NULL;
