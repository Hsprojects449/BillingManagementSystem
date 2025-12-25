# Table Shimmer/Skeleton Loading Implementation Guide

## Overview
This document describes the shimmer (skeleton loading) implementation for all table components in the Billing Management System application.

## Components Created

### 1. TableShimmer Component (`components/table-shimmer.tsx`)
A reusable skeleton loading component that displays placeholder rows while data is loading.

**Features:**
- Responsive skeleton placeholders matching table structure
- Customizable row and column counts
- Smooth shimmer animation effect
- Accessibility attributes (aria-busy, role="status")
- Staggered animation delays for natural appearance

**Usage:**
```tsx
import { TableShimmer } from "@/components/table-shimmer"

// Basic usage
<TableShimmer rows={8} columns={6} />

// With custom column widths
<TableShimmer 
  rows={10} 
  columns={5} 
  columnWidths={['150px', 'auto', '120px', '100px', '80px']}
/>
```

**Props:**
- `rows` (number, default: 8) - Number of skeleton rows to display
- `columns` (number, default: 6) - Number of columns to display
- `columnWidths` (array, optional) - Array of width values for each column

### 2. useTableLoading Hook (`hooks/use-table-loading.ts`)
A helper hook that integrates with React's useTransition for managing loading states.

**Usage:**
```tsx
import { useTableLoading } from "@/hooks/use-table-loading"

const { isLoading } = useTableLoading()
return <ClientsTable clients={clients} isLoading={isLoading} />
```

## Updated Table Components

All 7 table components now support the `isLoading` prop:

### 1. ClientsTable
- **Columns:** 7 (Name, Contact, Location, Value/Bird, Due Days, Created, Actions)
- **Shimmer Rows:** 8 by default
- **File:** `components/clients-table.tsx`

### 2. InvoicesTable
- **Columns:** 6 (Invoice #, Client, Issue Date, Status, Total, Paid, Actions)
- **Shimmer Rows:** 8 by default
- **File:** `components/invoices-table.tsx`

### 3. ProductsTable
- **Columns:** 5 (Name, Description, Status, Created, Actions)
- **Shimmer Rows:** 8 by default
- **File:** `components/products-table.tsx`

### 4. PaymentsTable
- **Columns:** 7 (Invoice #, Client, Amount, Date, Method, Status, Actions)
- **Shimmer Rows:** 8 by default
- **File:** `components/payments-table.tsx`

### 5. PricesTable
- **Columns:** 5 (Category, Description, Price, Effective Date, Actions)
- **Shimmer Rows:** 8 by default
- **File:** `components/prices-table.tsx`

### 6. UsersTable
- **Columns:** 5 (Name, Email, Role, Status, Actions)
- **Shimmer Rows:** 8 by default
- **File:** `components/users-table.tsx`

### 7. ClientPricingTable
- **Columns:** 6 (Client, Product, Rule Type, Value, Notes, Actions)
- **Shimmer Rows:** 8 by default
- **File:** `components/client-pricing-table.tsx`

## Implementation Pattern

### In Table Components:
```tsx
interface YourTableProps {
  data: YourData[]
  isLoading?: boolean  // Add this prop
}

export function YourTable({ data, isLoading = false }: YourTableProps) {
  // Show shimmer while loading
  if (isLoading) {
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Table Title</h3>
        </div>
        <TableShimmer rows={8} columns={6} />
      </>
    )
  }

  // Normal table rendering
  return (
    // ... existing table JSX
  )
}
```

### In Page Components:
```tsx
import { ClientsTable } from "@/components/clients-table"

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false })

  // Data is fetched via Suspense, shimmer shows during navigation
  return (
    <Suspense fallback={<ClientsTable clients={[]} isLoading={true} />}>
      <ClientsTable clients={clients || []} />
    </Suspense>
  )
}
```

## Styling Details

### Shimmer Animation
- **Animation:** `shimmerContent` (defined in `app/globals.css`)
- **Duration:** 2 seconds
- **Direction:** Left to right gradient sweep
- **Delay:** Staggered by column index for natural wave effect

### Shimmer Styling
- **Background:** Gradient from slate-200 → slate-100 → slate-200
- **Border Radius:** Rounded corners matching table cells
- **Color Scheme:** Neutral slate colors matching app theme
- **Opacity:** Subtle animation without distraction

## Accessibility Features

The shimmer component includes proper accessibility attributes:
- `role="status"` - Announces the element as a status region
- `aria-busy="true"` - Indicates data is loading
- `aria-label` - Descriptive label for screen readers

## Performance Considerations

1. **Efficient Rendering:** Shimmer rows are generated using Array.from() - minimal DOM overhead
2. **CSS Animations:** Uses hardware-accelerated CSS animations, not JavaScript
3. **No Extra Dependencies:** Leverages existing Tailwind utilities and custom CSS
4. **Staggered Delays:** Animation delays create visual interest without impacting performance

## Customization

### Adjusting Shimmer Count
```tsx
// Show fewer rows for compact tables
<TableShimmer rows={5} columns={4} />

// Show more rows for large tables
<TableShimmer rows={15} columns={8} />
```

### Custom Column Widths
```tsx
<TableShimmer 
  rows={8} 
  columns={4}
  columnWidths={['200px', 'auto', '120px', '100px']}
/>
```

### Width Variations
- Last column (Actions) - Always reduced width (w-16)
- First column (Name/ID) - Full width
- Middle columns - Random widths (w-5/6, w-3/4) for natural appearance

## Usage Examples

### Basic Table Loading
```tsx
"use client"

import { ClientsTable } from "@/components/clients-table"
import { useState } from "react"

export function ClientsPageWrapper({ clients }) {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div>
      <h1>Clients</h1>
      <ClientsTable clients={clients} isLoading={isLoading} />
    </div>
  )
}
```

### With Navigation Loading State
```tsx
"use client"

import { ClientsTable } from "@/components/clients-table"
import { useTransition } from "react"

export function ClientsView({ clients }) {
  const [isPending, startTransition] = useTransition()

  return (
    <ClientsTable 
      clients={clients} 
      isLoading={isPending}
    />
  )
}
```

### With Suspense Boundary
```tsx
import { ClientsTable } from "@/components/clients-table"
import { Suspense } from "react"

export default async function ClientsPage() {
  const clients = await fetchClients()

  return (
    <Suspense fallback={<ClientsTable clients={[]} isLoading={true} />}>
      <ClientsTable clients={clients} />
    </Suspense>
  )
}
```

## Browser Support

The shimmer effect uses:
- CSS `background-size` and `animation` properties (all modern browsers)
- Tailwind CSS utility classes (no IE11 support)
- `aria-busy` attribute (widely supported)

**Minimum Versions:**
- Chrome 43+
- Firefox 16+
- Safari 9+
- Edge 12+

## Future Enhancements

Potential improvements for future iterations:

1. **Row-specific Shimmer:** Different shimmer patterns for different row types
2. **Partial Loading:** Shimmer effect on new rows while existing data loads
3. **Smart Placeholders:** Content-aware shimmer sizing based on actual data
4. **Error State:** Distinct shimmer appearance during error scenarios
5. **Progressive Enhancement:** Shimmer enhancement with actual data streaming

## Troubleshooting

### Shimmer not showing
- Verify `isLoading` prop is passed to table component
- Check that TableShimmer import is present
- Ensure CSS animation `shimmerContent` is defined in globals.css

### Animation looks jerky
- Check browser hardware acceleration settings
- Verify CSS animations are not disabled
- Clear browser cache and rebuild

### Accessibility issues
- Ensure `role="status"` is present on shimmer container
- Verify `aria-busy="true"` is set during loading
- Test with screen readers (NVDA, JAWS)

---

**Last Updated:** December 25, 2025
**Component Status:** Production Ready ✓
