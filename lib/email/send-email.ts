import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailParams {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  try {
    console.log("🔵 Attempting to send email:", { to, subject, from: from || process.env.EMAIL_FROM })
    
    const { data, error } = await resend.emails.send({
      from: from || process.env.EMAIL_FROM || "onboarding@resend.dev",
      to,
      subject,
      html,
    })

    if (error) {
      console.error("❌ Email sending error:", error)
      console.error("⚠️ IMPORTANT: If you see 'validation_error', you need to either:")
      console.error("   1. Send emails to your Resend account email only (for testing)")
      console.error("   2. Verify a domain at https://resend.com/domains")
      return { success: false, error: error.message }
    }

    console.log("✅ Email sent successfully!", data)
    return { success: true, data }
  } catch (error: any) {
    console.error("❌ Email sending exception:", error)
    return { success: false, error: error.message }
  }
}
