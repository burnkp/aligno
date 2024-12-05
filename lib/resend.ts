import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvitationEmail({ 
  to, 
  inviteeEmail,
  inviteeName,
  teamName,
  role,
  invitationLink 
}: { 
  to: string;
  inviteeName: string;
  inviteeEmail: string;
  teamName: string;
  role: string;
  invitationLink: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Aligno <onboarding@resend.dev>',
      to: [to],
      subject: `You've been invited to join ${teamName} on Aligno`,
      html: `
        <h2>Hello ${inviteeName},</h2>
        <p>You've been invited to join ${teamName} as a ${role}.</p>
        <p>Click the link below to accept your invitation:</p>
        <a href="${invitationLink}" style="display:inline-block;padding:12px 20px;background-color:#0070f3;color:white;text-decoration:none;border-radius:5px;">
          Accept Invitation
        </a>
        <p>If you didn't expect this invitation, you can ignore this email.</p>
      `,
    });

    return { success: true, data, error: null };
  } catch (error) {
    console.error('Resend error:', error);
    return { success: false, data: null, error };
  }
} 