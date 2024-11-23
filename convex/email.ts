import { v } from "convex/values";
import { action } from "./_generated/server";

export const sendInvitation = action({
  args: {
    email: v.string(),
    name: v.string(),
    teamName: v.string(),
    invitationToken: v.string(),
  },
  handler: async (ctx, args) => {
    // In a production environment, you would integrate with an email service
    // For development, we'll log the invitation details
    console.log(`
      Invitation Email:
      To: ${args.email}
      Subject: You've been invited to join ${args.teamName} on Aligno
      
      Hi ${args.name},
      
      You've been invited to join ${args.teamName} on Aligno. Click the link below to accept the invitation:
      
      ${process.env.NEXT_PUBLIC_APP_URL}/invite/${args.invitationToken}
      
      This invitation will expire in 7 days.
      
      Best regards,
      The Aligno Team
    `);

    return { success: true };
  },
});