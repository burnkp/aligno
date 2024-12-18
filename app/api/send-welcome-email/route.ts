import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";
const logger = require("../../../logger");

export async function POST(request: Request) {
  try {
    // Log incoming request
    logger.info('Received welcome email request');
    
    const body = await request.json();
    logger.info('Request body:', body);
    
    const { email, orgName, name } = body;

    // Validate required fields
    if (!email || !orgName || !name) {
      const missingFields = {
        email: !email,
        orgName: !orgName,
        name: !name,
      };
      
      logger.warn('Missing required fields:', missingFields);
      
      return NextResponse.json(
        { 
          error: "Missing required fields",
          details: {
            email: !email ? "Email is required" : null,
            orgName: !orgName ? "Organization name is required" : null,
            name: !name ? "Contact name is required" : null,
          },
          code: "VALIDATION_ERROR"
        },
        { status: 400 }
      );
    }

    // Send welcome email
    logger.info('Sending welcome email to:', email);
    const result = await sendWelcomeEmail({
      email,
      orgName,
      name,
    });

    if (!result.success || !result.data?.id) {
      logger.error("Email sending failed:", {
        error: result.error,
        email,
        orgName,
      });
      
      return NextResponse.json(
        { 
          error: "Failed to send welcome email",
          details: result.error?.message || "Unknown error",
          code: "EMAIL_SEND_FAILED"
        },
        { status: 500 }
      );
    }

    logger.info('Welcome email sent successfully:', {
      email,
      emailId: result.data.id,
    });

    return NextResponse.json({ 
      success: true,
      message: "Welcome email sent successfully",
      data: {
        emailId: result.data.id
      }
    });
  } catch (error) {
    logger.error("Error in welcome email API route:", {
      error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        code: "INTERNAL_SERVER_ERROR"
      },
      { status: 500 }
    );
  }
} 