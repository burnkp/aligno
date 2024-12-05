import { query } from "./_generated/server";
import { action } from "./_generated/server";
import { Resend } from 'resend';
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return {
      message: "Convex connection successful!",
      timestamp: new Date().toISOString(),
      user: identity ? {
        email: identity.email,
        name: identity.name
      } : null
    };
  },
});

export const testResend = action({
  args: {},
  handler: async (ctx) => {
    try {
      console.log("Testing Resend configuration...");
      const apiKey = process.env.RESEND_API_KEY;
      console.log("API Key available:", !!apiKey);
      console.log("API Key prefix:", apiKey?.substring(0, 5));

      const resend = new Resend(apiKey);
      
      const { data, error } = await resend.emails.send({
        from: "Aligno <onboarding@resend.dev>",
        to: ["kushtrimpuka@gmail.com"], // Your email for testing
        subject: "Test Email from Aligno",
        html: "<p>This is a test email to verify Resend configuration.</p>",
      });

      console.log("Resend test response:", { data, error });
      
      return {
        success: !error,
        data,
        error,
        apiKeyAvailable: !!apiKey,
        apiKeyPrefix: apiKey?.substring(0, 5),
      };
    } catch (error) {
      console.error("Resend test error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        apiKeyAvailable: !!process.env.RESEND_API_KEY,
      };
    }
  },
});

export const checkEmailStatus = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const logs = await ctx.db
      .query("emailLogs")
      .filter(q => q.eq(q.field("email"), email))
      .order("desc")
      .take(1)
      .collect();

    return logs[0] || null;
  },
}); 