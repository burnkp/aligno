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
    organizationId: v.id("organizations")
  },
  async handler(ctx, args) {
    const { email, orgName, organizationId } = args;

    try {
      logger.info("Sending welcome email", {
        email,
        orgName,
        organizationId
      });

      // Log the attempt
      const logId = await ctx.db.insert("emailLogs", {
        email,
        status: "pending",
        teamId: organizationId,
        details: `Welcome email for ${orgName}`,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development"
      });

      // Send email through API route
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-welcome-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          orgName,
          organizationId
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send welcome email: ${response.statusText}`);
      }

      // Update log with success
      await ctx.db.patch(logId, {
        status: "sent",
        timestamp: new Date().toISOString()
      });

      logger.info("Welcome email sent successfully", {
        email,
        orgName,
        logId
      });

      return logId;
    } catch (error) {
      logger.error("Failed to send welcome email", {
        error: error instanceof Error ? error.message : "Unknown error",
        email,
        orgName
      });

      throw error;
    }
  }
});