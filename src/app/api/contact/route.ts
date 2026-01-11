import { NextRequest, NextResponse } from "next/server";
import { ContactFormData } from "@/types/contact";
import { validateFormData } from "@/lib/contact";

/**
 * POST /api/contact
 * Handles contact form submissions
 * This is a placeholder implementation for demonstration
 */
export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json();

    // Validate the form data
    const validation = validateFormData(data);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Send email via email service (SendGrid, Mailgun, AWS SES)
    // 2. Store in database
    // 3. Integrate with CRM or notification system
    // 4. Send confirmation email to user

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Log the submission (in production, use proper logging)
    console.log("Contact form submission received:", {
      name: data.name,
      email: data.email,
      subject: data.subject,
      messageLength: data.message.length,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    // Processing complete

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We will get back to you soon.",
    });
  } catch (error) {
    console.error("Contact form API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contact
 * Returns contact information (optional endpoint)
 */
export async function GET() {
  return NextResponse.json({
    location: "123 Education Street, Learning City, LC 12345",
    email: "contact@innobrritto.com",
    phone: "+1 (555) 123-4567",
    socialMedia: {
      facebook: "https://facebook.com/innobrritto",
      twitter: "https://twitter.com/innobrritto",
      instagram: "https://instagram.com/innobrritto",
    },
  });
}
