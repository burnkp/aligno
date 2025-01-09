import { Resend } from 'resend';
import logger from "@/utils/logger";

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables');
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface WelcomeEmailResponse {
  success: boolean;
  data?: {
    id: string;
  };
  error?: Error;
}

export async function sendWelcomeEmail({
  email,
  orgName,
  name,
}: {
  email: string;
  orgName: string;
  name: string;
}): Promise<WelcomeEmailResponse> {
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error('NEXT_PUBLIC_APP_URL is not defined in environment variables');
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    const signInUrl = new URL('/sign-in', baseUrl);
    signInUrl.searchParams.set('redirect_url', '/auth-callback');
    signInUrl.searchParams.set('email', email.toLowerCase());
    signInUrl.searchParams.set('orgName', encodeURIComponent(orgName));

    const response = await resend.emails.send({
      from: 'Aligno <onboarding@resend.dev>',
      to: [email],
      subject: `Welcome to Aligno - Complete Your ${orgName} Setup`,
      html: generateEmailTemplate({ 
        name, 
        orgName, 
        setupUrl: signInUrl.toString()
      }),
    });

    // Handle potential errors in the response
    if ('error' in response) {
      throw new Error(response.error?.message || 'Failed to send email');
    }

    // At this point, response is successful and has an id
    const data = response as { id: string };

    logger.info('Email sent successfully:', {
      emailId: data.id,
      to: email,
      setupUrl: signInUrl.toString()
    });

    return { success: true, data: { id: data.id } };
  } catch (error) {
    logger.error('Failed to send welcome email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    };
  }
}

interface EmailTemplateProps {
  name: string;
  orgName: string;
  setupUrl: string;
}

function generateEmailTemplate({ name, orgName, setupUrl }: EmailTemplateProps): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Aligno</title>
      </head>
      <body style="font-family: system-ui, sans-serif; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #000;">Welcome to Aligno!</h1>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for creating an organization on Aligno! We're excited to have ${orgName} join our platform.</p>
          
          <p>Click the button below to sign in and access your organization's dashboard:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${setupUrl}"
               style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Sign In to Aligno
            </a>
          </div>
          
          <p>After signing in, you'll be able to:</p>
          <ul>
            <li>Access your organization's dashboard</li>
            <li>Create Strategic Objectives (SOs)</li>
            <li>Set up OKRs and KPIs</li>
            <li>Add teams and invite members</li>
          </ul>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          
          <p>Best regards,<br>The Aligno Team</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eaeaea;">
          
          <p style="color: #666; font-size: 12px;">
            If you didn't create an account on Aligno, please ignore this email.
          </p>
        </div>
      </body>
    </html>
  `;
} 