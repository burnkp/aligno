import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { Resend } from 'resend';
import logger from "./lib/logger";

// Define the mutation args type
const logEmailAttemptArgs = {
  email: v.string(),
  teamId: v.string(),
  status: v.string(),
  error: v.optional(v.string()),
  details: v.optional(v.string()),
};

export const logEmailAttempt = mutation({
  args: logEmailAttemptArgs,
  handler: async (ctx, args) => {
    return await ctx.db.insert("emailLogs", {
      email: args.email,
      teamId: args.teamId,
      status: args.status,
      error: args.error,
      details: args.details,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    });
  },
});

export const getLogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("emailLogs")
      .order("desc")
      .take(100);
  },
});

export const sendInvitation = action({
  args: {
    email: v.string(),
    name: v.string(),
    teamId: v.string(),
    teamName: v.string(),
    role: v.string(),
    invitationToken: v.string(),
  },
  handler: async (ctx, args) => {
    logger.info("Starting sendInvitation action with args:", args);
    
    const apiKey = process.env.RESEND_API_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    
    if (!apiKey) {
      logger.error("RESEND_API_KEY is not configured");
      throw new Error("Email service not configured");
    }

    if (!appUrl) {
      logger.error("NEXT_PUBLIC_APP_URL is not configured");
      throw new Error("App URL not configured");
    }

    try {
      const resend = new Resend(apiKey);
      const invitationLink = `${appUrl}/invite/${args.invitationToken}`;
      
      logger.info("Sending invitation email to:", args.email);
      logger.info("Invitation link:", invitationLink);

      const { data, error } = await resend.emails.send({
        from: 'Aligno <onboarding@resend.dev>',
        to: [args.email],
        subject: `You've been invited to join ${args.teamName} on Aligno`,
        html: `
          <h2>Hello ${args.name},</h2>
          <p>You've been invited to join ${args.teamName} as a ${args.role}.</p>
          <p>Click the link below to accept your invitation:</p>
          <a href="${invitationLink}" style="display:inline-block;padding:12px 20px;background-color:#0070f3;color:white;text-decoration:none;border-radius:5px;">
            Accept Invitation
          </a>
          <p>If you didn't expect this invitation, you can ignore this email.</p>
        `,
      });

      logger.info("Resend response:", { data, error });

      if (error) {
        throw new Error(`Failed to send email: ${JSON.stringify(error)}`);
      }

      return { success: true, data };
    } catch (error) {
      logger.error("Email sending error:", error);
      throw error;
    }
  },
});

export const sendWelcomeEmail = mutation({
  args: {
    email: v.string(),
    orgName: v.string(),
    name: v.string(),
    organizationId: v.id("organizations")
  },
  async handler(ctx, args) {
    const { email, orgName, name, organizationId } = args;

    try {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (!resendApiKey) {
        throw new Error("RESEND_API_KEY is not configured");
      }

      const appUrl = process.env.NEXT_PUBLIC_APP_URL;
      if (!appUrl) {
        throw new Error("NEXT_PUBLIC_APP_URL is not configured");
      }

      // Initialize Resend with API key from environment
      const resend = new Resend(resendApiKey);

      // Construct the sign-in URL with organization context
      const signInUrl = new URL(appUrl + "/sign-in");
      signInUrl.searchParams.set("redirect_url", `/auth-callback`);
      signInUrl.searchParams.set("email", email.toLowerCase());
      signInUrl.searchParams.set("orgName", orgName);
      signInUrl.searchParams.set("organizationId", organizationId);

      const { data, error } = await resend.emails.send({
        from: "Aligno <no-reply@alignometrix.com>",
        to: email.toLowerCase(),
        subject: `Welcome to ${orgName} on Aligno`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #0070f3; margin-bottom: 24px;">Welcome to ${orgName} on Aligno!</h1>
            <p style="margin-bottom: 16px;">Hi ${name},</p>
            <p style="margin-bottom: 24px;">Your organization has been created successfully. Click the button below to access your dashboard:</p>
            <a href="${signInUrl}" style="display: inline-block; background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
              Access Your Dashboard
            </a>
            <p style="color: #666; margin-top: 24px;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="color: #666; word-break: break-all;">${signInUrl}</p>
            <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #eaeaea;">
              <p style="color: #666;">Best regards,<br>The Aligno Team</p>
            </div>
          </div>
        `,
      });

      if (error) {
        logger.error("Failed to send welcome email", {
          error,
          email,
          orgName,
          organizationId
        });
        throw new Error("Failed to send welcome email");
      }

      logger.info("Welcome email sent successfully", {
        email,
        orgName,
        organizationId,
        messageId: data?.id
      });

      return { success: true };
    } catch (error) {
      logger.error("Error sending welcome email", {
        error: error instanceof Error ? error.message : "Unknown error",
        email,
        orgName,
        organizationId
      });
      throw error;
    }
  }
});