import logger from "./lib/logger";
import { query, action } from "./_generated/server";
import { Resend } from 'resend';

export const checkEmailLogs = query({
  args: {},
  handler: async (ctx) => {
    const logs = await ctx.db
      .query("emailLogs")
      .collect();

    logger.info("Found email logs:", logs);

    return {
      count: logs.length,
      logs,
    };
  },
});

export const testEmailConfig = action({
  args: {},
  handler: async (ctx) => {
    logger.info("Starting test email config...");
    const apiKey = process.env.RESEND_API_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    
    if (!apiKey) {
      logger.error("Missing RESEND_API_KEY");
      return { success: false, error: "Missing API key" };
    }

    try {
      const resend = new Resend(apiKey);
      logger.info("Sending test email...");
      const { data, error } = await resend.emails.send({
        from: 'Aligno <onboarding@resend.dev>',
        to: ['kushtrimpuka@gmail.com'],
        subject: 'Test Email from Aligno',
        html: '<p>This is a test email to verify the email configuration.</p>',
      });

      logger.info("Resend response:", { data, error });
      return {
        success: !error,
        data,
        error,
        apiKeyPresent: true,
        apiKeyPrefix: apiKey.substring(0, 5),
        appUrl
      };
    } catch (error) {
      logger.error("Test failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        apiKeyPresent: true,
        apiKeyPrefix: apiKey.substring(0, 5),
        appUrl
      };
    }
  },
}); 