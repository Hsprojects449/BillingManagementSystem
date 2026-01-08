# Automated Email Reports Setup

This system automatically sends business reports to your organization email on configured schedules.

## Features

- **Weekly Reports**: Every Monday at 8 AM
- **Monthly Reports**: 1st of each month at 8 AM  
- **Semi-Annual Reports**: Every 6 months at 8 AM
- **Financial Year Reports**: March 31 at 8 AM (end of FY)

## What's Included in Reports

Each automated report includes:
- Total Revenue for the period
- Total Invoiced amount
- Outstanding amount
- Invoice statistics (total, paid, pending)
- Period summary (dates covered)

## Setup Instructions

### 1. Run Database Migration

Execute the SQL script to add automated reports configuration:

```bash
# Run the migration script
psql your_database < scripts/020_add_automated_reports.sql
```

Or manually run in Supabase SQL Editor:
```sql
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS automated_reports_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS automated_report_settings JSONB DEFAULT '{"weekly": false, "monthly": false, "semi-annual": false, "annual": false}'::jsonb,
ADD COLUMN IF NOT EXISTS report_email TEXT;

UPDATE organizations 
SET report_email = email 
WHERE report_email IS NULL AND email IS NOT NULL;
```

### 2. Configure Environment Variables

Add to your `.env.local`:

```env
# Cron job secret for security
CRON_SECRET=your-random-secret-key-here

# Your app URL (for email links)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Enable in Settings

1. Log in as **Super Admin** or **Admin**
2. Navigate to **Settings** page
3. Scroll to **Automated Email Reports** section
4. Toggle **Enable Automated Reports**
5. Enter your **Report Email Address**
6. Select which report frequencies to enable:
   - ☑️ Weekly Report
   - ☑️ Monthly Report
   - ☑️ Semi-Annual Report  
   - ☑️ Financial Year Report
7. Click **Save Report Settings**

### 4. Vercel Cron Setup (Automatic)

If deployed on Vercel, cron jobs are automatically configured via `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-reports?type=weekly",
      "schedule": "0 8 * * 1"
    },
    {
      "path": "/api/cron/send-reports?type=monthly",
      "schedule": "0 8 1 * *"
    },
    {
      "path": "/api/cron/send-reports?type=semi-annual",
      "schedule": "0 8 1 */6 *"
    },
    {
      "path": "/api/cron/send-reports?type=annual",
      "schedule": "0 8 31 3 *"
    }
  ]
}
```

Vercel will automatically call these endpoints at the scheduled times.

### 5. Alternative: External Cron Service

If not using Vercel, use an external service like:
- **EasyCron**: https://www.easycron.com
- **cron-job.org**: https://cron-job.org
- **GitHub Actions** (with scheduled workflows)

Configure HTTP GET requests to:
```
GET https://your-app.com/api/cron/send-reports?type=weekly
Authorization: Bearer YOUR_CRON_SECRET
```

Schedule examples:
- Weekly: `0 8 * * 1` (Monday 8 AM)
- Monthly: `0 8 1 * *` (1st of month 8 AM)
- Semi-Annual: `0 8 1 */6 *` (Every 6 months 8 AM)
- Annual: `0 8 31 3 *` (March 31 8 AM)

## Manual Testing

Test the report generation manually:

```bash
curl -X GET "https://your-app.com/api/cron/send-reports?type=weekly" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Report Content

Reports include HTML-formatted emails with:

### Summary Metrics
- **Total Revenue**: All payments received in period
- **Total Invoiced**: Total invoice amount created  
- **Outstanding**: Unpaid balance

### Invoice Statistics
- Total invoices created
- Paid invoices count
- Pending invoices count

### Period Information
- Date range covered
- Report type and frequency
- Generation timestamp

## Troubleshooting

### Reports Not Sending

1. **Check Settings**: Ensure automated reports are enabled in Settings
2. **Verify Email**: Confirm report_email is set correctly
3. **Check Logs**: Review Vercel function logs for errors
4. **Test Manually**: Use curl to test the endpoint directly

### Wrong Data

1. **Date Range**: Verify the report type matches expected period
2. **Organization Filter**: Ensure invoices/payments are linked to correct organization
3. **Time Zone**: Cron runs in UTC, adjust schedule if needed

### Email Not Received

1. **Check Spam**: Look in spam/junk folder
2. **Email Service**: Verify email service (Resend) is configured
3. **API Logs**: Check email API logs for delivery status

## Security

- All cron endpoints require `Authorization: Bearer CRON_SECRET` header
- Secret should be strong and unique
- Never commit secrets to version control
- Rotate CRON_SECRET periodically

## Future Enhancements

- Custom report templates
- PDF attachments
- Multiple recipient emails
- Custom date ranges
- Report history/archive
- Email preferences per user
