interface TeamMemberWelcomeParams {
  name: string
  email: string
  password: string
  role: string
  organizationName: string
  loginUrl: string
}

export function getTeamMemberWelcomeEmail({
  name,
  email,
  password,
  role,
  organizationName,
  loginUrl,
}: TeamMemberWelcomeParams): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${organizationName}</title>
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    .credentials-box {
      background: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 25px 0;
      border-radius: 4px;
    }
    .credentials-box h3 {
      margin-top: 0;
      color: #667eea;
      font-size: 16px;
      font-weight: 600;
    }
    .credential-item {
      margin: 12px 0;
      display: flex;
      align-items: baseline;
    }
    .credential-label {
      font-weight: 600;
      color: #333;
      min-width: 100px;
      display: inline-block;
    }
    .credential-value {
      color: #555;
      background: #fff;
      padding: 8px 12px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      border: 1px solid #e0e0e0;
      flex: 1;
    }
    .role-badge {
      display: inline-block;
      background: #667eea;
      color: #fff;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .btn {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
      font-weight: 600;
      text-align: center;
      transition: transform 0.2s;
    }
    .btn:hover {
      transform: translateY(-2px);
    }
    .security-notice {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 25px 0;
      border-radius: 4px;
    }
    .security-notice p {
      margin: 5px 0;
      color: #856404;
      font-size: 14px;
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to the Team!</h1>
    </div>
    
    <div class="content">
      <h2>Hello ${name},</h2>
      
      <p>Welcome to <strong>${organizationName}</strong>! We're excited to have you on board as a <span class="role-badge">${role.replace(/_/g, ' ')}</span>.</p>
      
      <p>Your account has been created and you can now access the Billing Management System. Below are your login credentials:</p>
      
      <div class="credentials-box">
        <h3>🔐 Your Login Credentials</h3>
        <div class="credential-item">
          <span class="credential-label">Email:</span>
          <span class="credential-value">${email}</span>
        </div>
        <div class="credential-item">
          <span class="credential-label">Password:</span>
          <span class="credential-value">${password}</span>
        </div>
        <div class="credential-item">
          <span class="credential-label">Role:</span>
          <span class="credential-value">${role.replace(/_/g, ' ')}</span>
        </div>
      </div>
      
      <div class="security-notice">
        <p><strong>⚠️ Important Security Notice:</strong></p>
        <p>Please change your password after your first login. Keep your credentials secure and do not share them with anyone.</p>
      </div>
      
      <div style="text-align: center;">
        <a href="${loginUrl}" class="btn">Login to Your Account</a>
      </div>
      
      <p style="margin-top: 30px;">If you have any questions or need assistance, please don't hesitate to reach out to your administrator.</p>
      
      <p>Best regards,<br><strong>${organizationName} Team</strong></p>
    </div>
    
    <div class="footer">
      <p>This is an automated message. Please do not reply to this email.</p>
      <p>&copy; ${new Date().getFullYear()} ${organizationName}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
