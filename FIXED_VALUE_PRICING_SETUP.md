# Fixed Value Pricing Feature Setup

## Overview

This update adds a new **Fixed Value** category option to the client-specific pricing rules system. This allows super admins to set a fixed base price for a client-product combination instead of relying on daily category prices.

## Changes Made

### Frontend Components

1. **client-pricing-form.tsx** - Added:
   - New "Fixed Value" category button alongside "Live" and "Skinless"
   - Input field for entering the fixed price value
   - Preview calculation showing the final price after applying pricing rules
   - Form validation to ensure a fixed value is entered when selected

2. **invoice-form.tsx** - Updated:
   - Modified `calculateClientPrice()` function to check for fixed_base_value first
   - Updated `getPriceBreakdown()` to display fixed values in the pricing breakdown
   - Both functions now support the new fixed_base_value field

### Database

- Added `fixed_base_value` column to `client_product_pricing` table
- This nullable numeric field stores the fixed base price when used

## Database Migration

### Option 1: Using Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy and paste the SQL from `supabase/migrations/add_fixed_base_value_to_pricing.sql`
4. Execute the SQL

### Option 2: Using Supabase CLI

```bash
supabase migration up
```

### SQL to Run Manually

```sql
ALTER TABLE client_product_pricing
ADD COLUMN fixed_base_value NUMERIC(10, 4) NULL;

COMMENT ON COLUMN client_product_pricing.fixed_base_value IS
'Optional fixed base value for pricing. When set, this value is used instead of a category-based price.';

CREATE INDEX idx_client_product_pricing_fixed_base_value
ON client_product_pricing(fixed_base_value)
WHERE fixed_base_value IS NOT NULL;
```

## How It Works

### Creating/Editing Pricing Rules

1. Go to Dashboard → Client-Specific Pricing
2. Create a new pricing rule or edit an existing one
3. Select a client and product
4. In the "Select Base Price Category" section, you'll now see three options:
   - **Live**: Use the daily price for the Live category
   - **Skinless**: Use the daily price for the Skinless category
   - **Fixed Value**: (NEW) Enter a fixed price directly

### Using Fixed Value

When "Fixed Value" is selected:

1. A new input field appears: "Enter Fixed Value"
2. Enter the desired fixed price (e.g., 150.00)
3. Select the pricing rule (discount percentage, flat discount, or multiplier)
4. The preview will show the final calculated price
5. Save the rule

### Invoice Generation

When invoices are created with clients that have fixed value pricing:

- The fixed price is used as the base price
- Any pricing rules (discounts, multipliers) are applied on top of it
- The system shows the pricing breakdown in the invoice form

## Data Structure

### Client Pricing Rule with Fixed Value

```json
{
  "id": "rule-id",
  "client_id": "client-123",
  "product_id": "product-456",
  "price_rule_type": "discount_percentage",
  "price_rule_value": 10,
  "price_category_id": null,
  "fixed_base_value": 150.0,
  "notes": "Fixed price agreement with 10% discount"
}
```

## API/Database Queries

The pricing data is now structured as:

```typescript
interface ClientProductPricing {
  price_rule_type: string;
  price_rule_value: string;
  product_id: string;
  client_id: string;
  price_category_id?: string | null; // Category-based pricing
  fixed_base_value?: number | null; // Fixed pricing (NEW)
}
```

When both `price_category_id` and `fixed_base_value` are null, the default product unit price is used.

## Backward Compatibility

- Existing pricing rules continue to work as before
- The `fixed_base_value` column is nullable, so no data migration is required
- Existing rules that use categories will continue to function normally
- Rules can be migrated from category-based to fixed value by updating the pricing rule

## Testing Checklist

- [ ] Create a new pricing rule using fixed value
- [ ] Edit an existing rule and switch from category to fixed value
- [ ] Delete a fixed value pricing rule
- [ ] Create an invoice with a client using fixed value pricing
- [ ] Verify the final price calculation with different rule types:
  - [ ] Discount percentage
  - [ ] Flat discount
  - [ ] Multiplier
- [ ] Check the preview prices are calculated correctly

## Reverting Changes

If you need to revert this feature:

```sql
-- Remove the index
DROP INDEX IF EXISTS idx_client_product_pricing_fixed_base_value;

-- Remove the column
ALTER TABLE client_product_pricing
DROP COLUMN IF EXISTS fixed_base_value;
```

Then revert the code changes to the original branch.

## Support

For issues or questions about this feature:

1. Check that the migration has been applied correctly
2. Verify the column exists: `SELECT * FROM information_schema.columns WHERE table_name='client_product_pricing';`
3. Test with a sample fixed value pricing rule
