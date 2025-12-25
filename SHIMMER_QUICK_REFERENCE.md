# Table Shimmer - Quick Reference

## 🚀 Quick Start

### 1. Basic Usage
```tsx
import { ClientsTable } from "@/components/clients-table"

<ClientsTable clients={clients} isLoading={isLoading} />
```

### 2. With useState
```tsx
const [isLoading, setIsLoading] = useState(false)
<ClientsTable clients={clients} isLoading={isLoading} />
```

### 3. With useTransition
```tsx
const [isPending, startTransition] = useTransition()
<ClientsTable clients={clients} isLoading={isPending} />
```

### 4. With useTableLoading Hook
```tsx
import { useTableLoading } from "@/hooks/use-table-loading"

const { isLoading } = useTableLoading()
<ClientsTable clients={clients} isLoading={isLoading} />
```

### 5. With Suspense
```tsx
<Suspense fallback={<ClientsTable clients={[]} isLoading={true} />}>
  <ClientsTable clients={clients} />
</Suspense>
```

## 📋 Supported Tables

| Table | Component | Columns | Import |
|-------|-----------|---------|--------|
| Clients | `ClientsTable` | 7 | `@/components/clients-table` |
| Invoices | `InvoicesTable` | 6 | `@/components/invoices-table` |
| Products | `ProductsTable` | 5 | `@/components/products-table` |
| Payments | `PaymentsTable` | 7 | `@/components/payments-table` |
| Prices | `PricesTable` | 5 | `@/components/prices-table` |
| Users | `UsersTable` | 5 | `@/components/users-table` |
| Client Pricing | `ClientPricingTable` | 6 | `@/components/client-pricing-table` |

## 🎨 Shimmer Component

### Direct Usage
```tsx
import { TableShimmer, TableRowShimmer } from "@/components/table-shimmer"

// Full table shimmer
<TableShimmer rows={8} columns={6} />

// With custom widths
<TableShimmer 
  rows={10} 
  columns={5}
  columnWidths={['150px', 'auto', '100px']}
/>

// Single row shimmer
<TableRowShimmer columns={6} />
```

## ⚙️ Props Reference

### All Table Components
```tsx
interface TableProps {
  // Your data
  [dataKey]: Data[]
  
  // Loading state (NEW)
  isLoading?: boolean  // Default: false
}
```

### TableShimmer Component
```tsx
interface TableShimmerProps {
  rows?: number                    // Default: 8
  columns?: number                 // Default: 6
  columnWidths?: (string|number)[] // Optional
}
```

## 🎬 Animation Details

- **Duration:** 2 seconds
- **Direction:** Left to right
- **Colors:** Slate-200 → Slate-100 → Slate-200
- **Curve:** Gradient sweep
- **Delay:** Staggered by column index

## 📝 CSS Classes Used

```css
/* Shimmer animation keyframe */
@keyframes shimmerContent {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Applied via inline style */
style={{
  animation: 'shimmerContent 2s infinite',
  backgroundSize: '200% 100%'
}}
```

## ♿ Accessibility

```html
<!-- Shimmer includes these by default -->
<div role="status" aria-busy="true" aria-label="Loading table data">
  <!-- Shimmer rows -->
</div>
```

## 🔄 Loading State Pattern

```tsx
// Before loading
export function MyTable() {
  const [isLoading, setIsLoading] = useState(false)
  
  // Data fetching logic
  // ...
  
  return <ClientsTable clients={clients} isLoading={isLoading} />
}
```

## 🧪 Common Patterns

### Pattern 1: Fetch then Display
```tsx
const [data, setData] = useState([])
const [isLoading, setIsLoading] = useState(false)

useEffect(() => {
  setIsLoading(true)
  fetchData().then(result => {
    setData(result)
    setIsLoading(false)
  })
}, [])

return <Table data={data} isLoading={isLoading} />
```

### Pattern 2: Suspense Boundary
```tsx
<Suspense fallback={<Table data={[]} isLoading={true} />}>
  <TableContent />
</Suspense>

// In TableContent component:
const data = await fetchData()
return <Table data={data} />
```

### Pattern 3: Navigation Loading
```tsx
const [isPending, startTransition] = useTransition()

const handleNavigate = () => {
  startTransition(() => {
    router.push('/new-page')
  })
}

return <Table data={data} isLoading={isPending} />
```

## ⚡ Performance Tips

1. **Use useTransition** - Most efficient for navigation
2. **Avoid rapid toggles** - Let shimmer complete its cycle
3. **Consistent row count** - Match expected data volume
4. **Preload images** - Add priority="true" to images

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Shimmer not showing | Check `isLoading` prop is `true` |
| Animation jerky | Clear browser cache, check GPU acceleration |
| No animation | Verify CSS in `globals.css` is loaded |
| Accessibility warnings | Ensure `role="status"` and `aria-busy` present |

## 📚 Documentation Links

- **Full Guide:** [TABLE_SHIMMER_GUIDE.md](../TABLE_SHIMMER_GUIDE.md)
- **Implementation Summary:** [SHIMMER_IMPLEMENTATION_SUMMARY.md](../SHIMMER_IMPLEMENTATION_SUMMARY.md)

## 💡 Pro Tips

1. **Custom shimmer count:**
   ```tsx
   <Table data={data} isLoading={isLoading} />
   // Show 5 rows for small tables, 15 for large ones
   <TableShimmer rows={5} columns={columns} />
   ```

2. **Stagger multiple tables:**
   ```tsx
   <Table1 isLoading={isLoading} />
   <Table2 isLoading={isLoading && index === 0} />
   ```

3. **Progressive loading:**
   ```tsx
   // First batch loading
   <TableShimmer rows={8} columns={6} />
   // Append more rows as user scrolls
   ```

## 📦 What's Included

✅ Reusable shimmer component
✅ All 7 table components updated
✅ Helper hook
✅ CSS animations
✅ Full documentation
✅ Zero breaking changes

---

**Version:** 1.0.0
**Last Updated:** December 25, 2025
**Status:** Production Ready ✓
