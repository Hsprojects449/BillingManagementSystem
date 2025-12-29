# Email Notifications

This application includes automated email notifications for key events. The email system uses [Resend](https://resend.com) for reliable email delivery with professional HTML templates.

## Features

### 1. Team Member Welcome Email
When a new team member is created by an admin, they automatically receive a welcome email containing:
- Personalized greeting with their full name
- Login credentials (email and password)
- Their assigned role
- Direct login link to the application
- Security reminder to change password after first login
- Organization branding

**Triggered when:** Admin creates a new user in `/dashboard/users/new`

### 2. Client Invitation Email
When a new client is added to the system, they receive a professional invitation email containing:
- Personalized welcome message
- Information about the business relationship
- Organization contact details (email and phone)
- What to expect (invoices, payment reminders, etc.)
- Professional branding and formatting

**Triggered when:** Creating a new client in `/dashboard/clients/new`

## Setup

### 1. Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (recommended for production) or use `onboarding@resend.dev` for testing
3. Get your API key from [API Keys page](https://resend.com/api-keys)

### 2. Configure Environment Variables

Add these to your `.env.local` file:

```env
# Resend API Key (required)
RESEND_API_KEY=re_your_api_key_here

# Email From Address (optional, defaults to onboarding@resend.dev)
EMAIL_FROM=notifications@yourdomain.com

# Application URL (required for login links)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Domain Verification (Production)

For production use:
1. Go to [Resend Domains](https://resend.com/domains)
2. Add your domain
3. Add the required DNS records to your domain provider
4. Wait for verification (usually a few minutes)
5. Update `EMAIL_FROM` in your environment variables

## Email Templates

### Team Member Welcome Email
Located at: `lib/email/templates/team-member-welcome.ts`

**Features:**
- Professional gradient header
- Credential box with email, password, and role
- Security warning banner
- Call-to-action login button
- Responsive HTML design

### Client Invitation Email  
Located at: `lib/email/templates/client-invitation.ts`

**Features:**
- Welcoming green-themed design
- Custom message support
- Organization contact information
- What to expect section
- Responsive HTML layout

## Technical Details

### Email Service
- **Provider:** Resend
- **Utility:** `lib/email/send-email.ts`
- **Server Actions:** 
  - `app/actions/create-user.ts` (team member emails)
  - `app/actions/send-client-invitation.ts` (client emails)

### Error Handling
- Emails are sent asynchronously and don't block user/client creation
- Failed emails are logged to console but don't cause transaction rollback
- Email sending failures are silent to end users

### Testing

For development/testing without a verified domain:

```env
EMAIL_FROM=onboarding@resend.dev
```

This special Resend address allows sending test emails without domain verification.

## Customization

### Modify Email Content

Edit the template files to customize:
- `lib/email/templates/team-member-welcome.ts` - Team member email
- `lib/email/templates/client-invitation.ts` - Client invitation email

### Add New Email Types

1. Create new template in `lib/email/templates/`
2. Import and use in relevant server action
3. Call `sendEmail()` with template HTML

Example:

```typescript
import { sendEmail } from "@/lib/email/send-email"
import { getMyTemplate } from "@/lib/email/templates/my-template"

const html = getMyTemplate({ param1, param2 })
await sendEmail({
  to: "recipient@example.com",
  subject: "Subject Line",
  html,
})
```

## Troubleshooting

### Emails not sending
1. Check `RESEND_API_KEY` is set correctly
2. Verify API key is active in Resend dashboard
3. Check console logs for error messages
4. Ensure `EMAIL_FROM` domain is verified (for production)

### Login link not working
1. Verify `NEXT_PUBLIC_APP_URL` is set correctly
2. For production, use your actual domain URL
3. For development, use `http://localhost:3000`

### HTML rendering issues
- Test emails with multiple email clients
- Use [Litmus](https://litmus.com) or [Email on Acid](https://www.emailonacid.com) for testing
- Templates use inline CSS for maximum compatibility

## Cost

Resend pricing (as of 2024):
- **Free tier:** 3,000 emails/month, 100 emails/day
- **Pro:** $20/month for 50,000 emails
- **Enterprise:** Custom pricing

For most small to medium businesses, the free tier is sufficient.
