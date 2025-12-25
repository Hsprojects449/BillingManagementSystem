import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TableShimmerProps {
  rows?: number
  columns?: number
  columnWidths?: (string | number)[]
}

export function TableShimmer({ rows = 8, columns = 6, columnWidths }: TableShimmerProps) {
  const getColumnWidth = (index: number) => {
    if (!columnWidths || index >= columnWidths.length) return "auto"
    const width = columnWidths[index]
    return typeof width === "number" ? `${width}px` : width
  }

  const widthPattern = ["w-full", "w-5/6", "w-3/4"]

  const shimmerStyle = {
    animation: "shimmerContent 1.6s linear infinite",
    backgroundSize: "200% 100%",
  } as const

  return (
    <div
      className="rounded-lg border bg-white overflow-hidden"
      role="status"
      aria-busy="true"
      aria-label="Loading table data"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={`header-${i}`} style={{ width: getColumnWidth(i) }}>
                <div
                  className="h-4 w-3/5 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded"
                  style={shimmerStyle}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={`row-${rowIndex}`} className="hover:bg-transparent">
              {Array.from({ length: columns }).map((_, colIndex) => {
                const patternIndex = (rowIndex + colIndex) % widthPattern.length
                let widthClass = widthPattern[patternIndex]

                if (colIndex === columns - 1) {
                  widthClass = "w-16"
                }

                return (
                  <TableCell key={`cell-${rowIndex}-${colIndex}`} style={{ width: getColumnWidth(colIndex) }}>
                    <div
                      className={`h-4 ${widthClass} bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded`}
                      style={{
                        ...shimmerStyle,
                        animationDelay: `${colIndex * 80}ms`,
                      }}
                    />
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function TableRowShimmer({ columns = 6, columnWidths }: Omit<TableShimmerProps, 'rows'>) {
  const getColumnWidth = (index: number) => {
    if (!columnWidths || index >= columnWidths.length) return "auto"
    const width = columnWidths[index]
    return typeof width === "number" ? `${width}px` : width
  }

  const widthPattern = ["w-full", "w-5/6", "w-3/4"]
  const shimmerStyle = {
    animation: "shimmerContent 1.6s linear infinite",
    backgroundSize: "200% 100%",
  } as const

  return (
    <TableRow className="hover:bg-transparent">
      {Array.from({ length: columns }).map((_, colIndex) => {
        const patternIndex = colIndex % widthPattern.length
        let widthClass = widthPattern[patternIndex]
        if (colIndex === columns - 1) {
          widthClass = "w-16"
        }

        return (
          <TableCell key={`cell-${colIndex}`} style={{ width: getColumnWidth(colIndex) }}>
            <div
              className={`h-4 ${widthClass} bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded`}
              style={{
                ...shimmerStyle,
                animationDelay: `${colIndex * 80}ms`,
              }}
            />
          </TableCell>
        )
      })}
    </TableRow>
  )
}
