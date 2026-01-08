# Dashboard vs Reports - Structure Overview

## Dashboard Overview
The Dashboard is designed for **quick insights and KPI tracking** with visual representations.

### What's on the Dashboard:

#### 1. **KPI Cards** (4 main metrics)
- Total Clients
- Total Invoices (with breakdown)
- Total Revenue
- Pending Amount

#### 2. **Visual KPI Cards** (4 advanced metrics)
- **Collection Rate** - Percentage of invoiced amount collected with trend indicator
- **Outstanding Amount** - Total pending with count of unpaid invoices
- **Paid Invoices** - Count of paid invoices with percentage of total
- **Average Invoice Value** - Mean invoice amount for the FY

#### 3. **Charts & Graphs**

**Revenue Trend Chart**
- Line chart showing last 6 months of revenue
- Interactive tooltips with formatted currency
- Visual trend identification

**Invoice Status Distribution**
- Pie chart showing breakdown of invoice statuses
- Color-coded: Green (Paid), Blue (Sent), Red (Overdue), Gray (Draft)
- Quick overview of invoice pipeline

**Daily Invoice Amount (Last 30 Days)**
- Bar chart showing daily invoice totals
- Identifies peak revenue days
- Shows seasonal patterns

### Key Features:
- ✅ Visual charts and graphs
- ✅ High-level KPI overview
- ✅ Current Financial Year focused
- ✅ Real-time data updates
- ✅ Mobile-responsive layout
- ✅ Minimal text, maximum visuals

---

## Reports & Analytics
The Reports section provides **detailed analysis** with tabular data and comprehensive breakdowns.

### What's in Reports:

#### 1. **Financial Metrics Cards** (5 key metrics)
- Total Revenue
- Total Invoiced
- Outstanding Amount
- Active Clients
- All displayed with icons and descriptions

#### 2. **Invoice Status Overview** (3 status cards)
- Paid Invoices count
- Overdue Invoices count
- Draft Invoices count
- Quick actionable insights

#### 3. **Tabbed Reports Section**

**Revenue Trends Tab**
- Monthly revenue breakdown (last 6 months)
- Tabular format with progress bars
- Historical comparison
- Detailed amount for each month

**Top Clients Tab**
- Table of top 10 clients by revenue
- Columns: Client Name, Total Invoiced, Amount Paid, Outstanding, Invoice Count
- Sortable and filterable data
- Client performance analysis

**Recent Activity Tab**
- Recent Invoices list (last 10)
  - Invoice number, client name, amount, status badge
- Recent Payments list (last 10)
  - Payment method, date, amount, status
- Side-by-side comparison

#### 4. **Collection Performance Card**
- Overall collection rate with visual progress bar
- Split view: Collected vs Pending amounts
- Percentage and currency displays
- Performance indicator

### Key Features:
- ✅ Detailed tabular data
- ✅ Multiple analysis perspectives
- ✅ Historical data tracking
- ✅ Client-level breakdown
- ✅ Transaction-level details
- ✅ Sortable and filterable tables
- ✅ Comprehensive reporting

---

## Comparison Table

| Aspect | Dashboard | Reports |
|--------|-----------|---------|
| **Purpose** | Quick overview & KPIs | Detailed analysis |
| **Visuals** | Heavy (Charts, graphs) | Light (Tables, cards) |
| **Data Granularity** | Summary level | Transaction level |
| **Time to Insight** | Seconds | Minutes |
| **Use Case** | Daily monitoring | In-depth analysis |
| **Audience** | All roles | Finance/Admin |
| **Refresh Rate** | Real-time | Real-time |
| **Data Period** | Last 6 months + FY | Full FY |

---

## User Workflows

### Dashboard User Flow
1. Open Dashboard
2. Scan KPI cards for overall health
3. Look at charts to understand trends
4. Identify focus areas (e.g., high outstanding)
5. Jump to specific section if deeper analysis needed

### Reports User Flow
1. Open Reports
2. Review comprehensive metrics
3. Check specific tabs (revenue, clients, activity)
4. Export data or drill down on outliers
5. Generate insights for decision making

---

## Current Financial Year Display

Both sections show data for the **current Financial Year (April 1 - March 31)**:
- As of January 8, 2026: **FY 2025-26**
- Automatically updates when new FY begins
- Users can view past years in invoices/payments pages

---

## Future Enhancements

### Dashboard
- [ ] Export to PDF
- [ ] Custom date range selection
- [ ] Comparison with previous FY
- [ ] Predictive analytics
- [ ] Alert notifications for thresholds

### Reports
- [ ] Custom report builder
- [ ] Scheduled email reports (already implemented!)
- [ ] Data export (CSV, Excel, PDF)
- [ ] Advanced filtering and search
- [ ] Drill-down capabilities
- [ ] Year-over-year comparison
