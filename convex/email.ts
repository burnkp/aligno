import { v } from "convex/values";
import { action } from "./_generated/server";
import { Resend } from 'resend';
import { getInvitationEmailHtml } from '../lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendInvitation = action({
  args: {
    email: v.string(),
    name: v.string(),
    teamName: v.string(),
    invitationToken: v.string(),
  },
  handler: async (ctx, args) => {
    const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${args.invitationToken}`;

    try {
      const data = await resend.emails.send({
        from: 'Aligno <onboarding@aligno.app>',
        to: args.email,
        subject: `You've been invited to join ${args.teamName} on Aligno`,
        html: getInvitationEmailHtml({
          name: args.name,
          teamName: args.teamName,
          invitationUrl,
        }),
        tags: [
          {
            name: 'type',
            value: 'team_invitation',
          },
        ],
      });

      return { success: true, data };
    } catch (error) {
      console.error('Failed to send invitation email:', error);
      throw new Error('Failed to send invitation email');
    }
  },
});