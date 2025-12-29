import { NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email/send-email"
import { getTeamMemberWelcomeEmail } from "@/lib/email/templates/team-member-welcome"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const to = searchParams.get("to") || "hsprojects449@gmail.com"
    const from = searchParams.get("from") || process.env.EMAIL_FROM || "onboarding@resend.dev"
    const name = searchParams.get("name") || "Test User"
    const org = searchParams.get("org") || "Test Organization"

    // Send test email
    const emailHtml = getTeamMemberWelcomeEmail({
      name,
      email: to,
      password: "test123",
      role: "admin",
      organizationName: org,
      loginUrl: "http://localhost:3000/auth/login",
    })

    const result = await sendEmail({
      to,
      subject: `Test - Welcome Email from ${org}`,
      html: emailHtml,
      from,
    })

    return NextResponse.json({
      success: result.success,
      message: result.success 
        ? `Test email sent! Check inbox for ${to}` 
        : `Failed: ${result.error}`,
      data: result,
      meta: { to, from },
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}
