interface ClientInvitationParams {
  clientName: string
  organizationName: string
  message?: string
  contactEmail?: string
  contactPhone?: string
}

export function getClientInvitationEmail({
  clientName,
  organizationName,
  message,
  contactEmail,
  contactPhone,
}: ClientInvitationParams): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome - ${organizationName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      padding: 40px 30px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #333;
      font-size: 22px;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .content p {
      margin: 15px 0;
      color: #555;
    }
    .highlight-box {
      background: #f0fdf4;
      border-left: 4px solid #48bb78;
      padding: 20px;
      margin: 25px 0;
      border-radius: 4px;
    }
    .highlight-box p {
      margin: 10px 0;
      color: #333;
    }
    .info-section {
      background: #f8f9fa;
      padding: 20px;
      margin: 25px 0;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
    }
    .info-section h3 {
      margin-top: 0;
      color: #48bb78;
      font-size: 16px;
      font-weight: 600;
    }
    .contact-item {
      margin: 10px 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .contact-label {
      font-weight: 600;
      color: #333;
      min-width: 80px;
    }
    .contact-value {
      color: #555;
    }
    .icon {
      font-size: 20px;
    }
    .footer {
      background: #f8f9fa;
      padding: 25px 30px;
      text-align: center;
      color: #777;
      font-size: 13px;
      border-top: 1px solid #e0e0e0;
    }
    .footer p {
      margin: 5px 0;
    }
    .divider {
      border: 0;
      border-top: 1px solid #e0e0e0;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🤝 Welcome to Our Network!</h1>
    </div>
    
    <div class="content">
      <h2>Dear ${clientName},</h2>
      
      <p>We are delighted to welcome you as a valued client of <strong>${organizationName}</strong>!</p>
      
      ${message ? `
      <div class="highlight-box">
        <p><strong>Message from ${organizationName}:</strong></p>
        <p style="font-style: italic;">${message}</p>
      </div>
      ` : `
      <p>We're excited to begin our business relationship and look forward to providing you with excellent service and support.</p>
      `}
      
      <div class="info-section">
        <h3>✨ What's Next?</h3>
        <p>You have been successfully added to our billing management system. You will receive:</p>
        <ul style="color: #555; margin: 10px 0; padding-left: 20px;">
          <li>Regular invoices for our services</li>
          <li>Payment reminders and notifications</li>
          <li>Access to your billing history</li>
          <li>Dedicated support from our team</li>
        </ul>
      </div>
      
      ${contactEmail || contactPhone ? `
      <hr class="divider">
      
      <div class="info-section">
        <h3>📞 Contact Information</h3>
        <p>If you have any questions or need assistance, please feel free to reach out to us:</p>
        ${contactEmail ? `
        <div class="contact-item">
          <span class="icon">📧</span>
          <span class="contact-label">Email:</span>
          <span class="contact-value"><a href="mailto:${contactEmail}" style="color: #48bb78; text-decoration: none;">${contactEmail}</a></span>
        </div>
        ` : ''}
        ${contactPhone ? `
        <div class="contact-item">
          <span class="icon">📱</span>
          <span class="contact-label">Phone:</span>
          <span class="contact-value">${contactPhone}</span>
        </div>
        ` : ''}
      </div>
      ` : ''}
      
      <p style="margin-top: 30px;">We appreciate your business and look forward to a successful partnership!</p>
      
      <p>Warm regards,<br><strong>The ${organizationName} Team</strong></p>
    </div>
    
    <div class="footer">
      <p>This is an automated message from our billing system.</p>
      <p>&copy; ${new Date().getFullYear()} ${organizationName}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
