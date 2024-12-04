interface InvitationEmailProps {
  name: string;
  teamName: string;
  invitationUrl: string;
}

export const getInvitationEmailHtml = ({
  name,
  teamName,
  invitationUrl,
}: InvitationEmailProps) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Team Invitation</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .button { 
        display: inline-block; 
        padding: 12px 24px; 
        background-color: #0070f3; 
        color: white; 
        text-decoration: none; 
        border-radius: 5px; 
        margin: 20px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Welcome to Aligno!</h2>
      <p>Hi ${name},</p>
      <p>You've been invited to join <strong>${teamName}</strong> on Aligno.</p>
      <p>Click the button below to accept the invitation and set up your account:</p>
      <a href="${invitationUrl}" class="button">Accept Invitation</a>
      <p>This invitation link will expire in 7 days.</p>
      <p>If you didn't expect this invitation, you can safely ignore this email.</p>
      <p>Best regards,<br>The Aligno Team</p>
    </div>
  </body>
</html>
`; 