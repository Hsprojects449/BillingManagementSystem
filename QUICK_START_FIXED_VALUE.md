# Fixed Value Pricing - Quick Start Guide

## What's New?

The pricing rules system now supports a **"Fixed Value"** category option. Instead of using daily category prices (Live, Skinless), you can set a fixed price directly for each client-product combination.

## Quick Setup (5 Minutes)

### Step 1: Apply Database Migration

Run this SQL in your Supabase dashboard SQL Editor:

```sql
ALTER TABLE client_product_pricing
ADD COLUMN fixed_base_value NUMERIC(10, 4) NULL;

COMMENT ON COLUMN client_product_pricing.fixed_base_value IS
'Optional fixed base value for pricing. When set, this value is used instead of a category-based price.';

CREATE INDEX idx_client_product_pricing_fixed_base_value
ON client_product_pricing(fixed_base_value)
WHERE fixed_base_value IS NOT NULL;
```

### Step 2: Test the Feature

1. Go to **Dashboard → Client-Specific Pricing**
2. Click **"Add Pricing Rule"**
3. Select a client and product
4. You'll see three category options:
   - **Live** (blue) - Use daily Live category price
   - **Skinless** (blue) - Use daily Skinless category price
   - **Fixed Value** (purple) - NEW! Enter a fixed price
5. Click **"Fixed Value"**
6. Enter a price (e.g., `150.00`)
7. Select a pricing rule:
   - Discount Percentage (e.g., `10` for 10% off)
   - Flat Discount (e.g., `5` for ₹5 off)
   - Multiplier (e.g., `1.25` for 25% markup)
8. See the preview price update in real-time
9. Click **"Create 1 Rule"**

## Using in Invoices

When creating an invoice for a client with fixed value pricing:

- The fixed price is automatically used as the base
- Pricing rules are applied on top (discounts/multipliers)
- The pricing breakdown shows "Fixed Value" as the base

## Switching Existing Rules

To change a rule from category-based to fixed value:

1. Click the **edit** button on the pricing rule
2. Click the **"Fixed Value"** button
3. Enter the fixed price
4. Click **"Update Pricing Rule"**

## Example Scenarios

### Scenario 1: Special Deal with Discount

- Client: ABC Poultry
- Product: Whole Chicken
- Base Price: Fixed at ₹150 (instead of varying Live price)
- Rule: 10% Discount
- **Result**: ₹150 × (1 - 10%) = **₹135**

### Scenario 2: Mark Up Agreement

- Client: XYZ Restaurant
- Product: Eggs (100s)
- Base Price: Fixed at ₹800 per 100
- Rule: 1.25x Multiplier
- **Result**: ₹800 × 1.25 = **₹1000**

### Scenario 3: Corporate Rate

- Client: Big Retailer
- Product: Whole Bird
- Base Price: Fixed at ₹120
- Rule: ₹10 Flat Discount
- **Result**: ₹120 - ₹10 = **₹110**

## Key Differences

| Feature      | Category-Based               | Fixed Value         |
| ------------ | ---------------------------- | ------------------- |
| Base Price   | Changes daily                | Always the same     |
| Use Case     | Standard pricing             | Special agreements  |
| Invoice Date | Uses price from invoice date | Uses fixed price    |
| Best For     | Variable market prices       | Long-term contracts |

## Common Questions

**Q: Can I use both category and fixed value at the same time?**  
A: No, you choose one or the other. They are mutually exclusive.

**Q: What happens if I don't enter a fixed value?**  
A: The form won't let you save - it will show an error asking for the value.

**Q: Can I edit a fixed value rule later?**  
A: Yes! Click the edit button and change the price or rules anytime.

**Q: Do old rules break?**  
A: No! All existing category-based pricing rules continue to work exactly as before.

**Q: Can I export rules with fixed values?**  
A: Yes! The CSV export shows "Fixed Value" with the actual price.

## File Changes Summary

**Modified Files:**

- `components/client-pricing-form.tsx` - Added Fixed Value UI
- `components/invoice-form.tsx` - Added fixed value pricing calculation
- `components/client-pricing-table.tsx` - Display and export fixed values
- `app/dashboard/invoices/new/page.tsx` - Query fixed values
- `app/dashboard/invoices/[id]/edit/page.tsx` - Query fixed values

**New Files:**

- `supabase/migrations/add_fixed_base_value_to_pricing.sql` - Database schema
- `FIXED_VALUE_PRICING_SETUP.md` - Detailed setup guide
- `IMPLEMENTATION_SUMMARY.md` - Technical details

## Troubleshooting

**Issue: "Select Base Price Category or Fixed Value" error**  
→ Solution: Click either a category button or the Fixed Value button

**Issue: "Please enter a fixed value" error**  
→ Solution: The input field appeared? Enter a number in the Fixed Value input box

**Issue: Table shows blank category**  
→ Solution: Might be a fixed value rule - check if it says "Fixed Value" in purple

**Issue: Database column not found**  
→ Solution: Run the SQL migration in the first step (check Supabase SQL Editor)

## Need Help?

Refer to detailed documentation:

- `FIXED_VALUE_PRICING_SETUP.md` - Full setup instructions
- `IMPLEMENTATION_SUMMARY.md` - Technical implementation details

---

**You're all set!** Start using fixed value pricing for your client agreements.
