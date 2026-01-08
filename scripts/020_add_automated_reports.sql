-- Add automated reports configuration to organizations table
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS automated_reports_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS automated_report_settings JSONB DEFAULT '{"weekly": false, "monthly": false, "semi-annual": false, "annual": false}'::jsonb,
ADD COLUMN IF NOT EXISTS report_email TEXT;

-- Update existing rows to use organization email as report email
UPDATE organizations 
SET report_email = email 
WHERE report_email IS NULL AND email IS NOT NULL;

COMMENT ON COLUMN organizations.automated_reports_enabled IS 'Whether automated reports are enabled for this organization';
COMMENT ON COLUMN organizations.automated_report_settings IS 'Settings for which report frequencies are enabled: weekly, monthly, semi-annual, annual';
COMMENT ON COLUMN organizations.report_email IS 'Email address to send automated reports to';
