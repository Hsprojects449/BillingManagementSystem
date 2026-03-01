-- Add flat_addition to price_rule_type check constraint
-- This migration updates the constraint to allow the new "flat_addition" pricing rule type

-- Drop the existing check constraint
ALTER TABLE client_product_pricing
DROP CONSTRAINT IF EXISTS client_product_pricing_price_rule_type_check;

-- Add the new check constraint with all allowed values including flat_addition
ALTER TABLE client_product_pricing
ADD CONSTRAINT client_product_pricing_price_rule_type_check
CHECK (price_rule_type IN ('discount_percentage', 'discount_flat', 'multiplier', 'flat_addition'));
