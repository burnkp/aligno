import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { api } from '@/convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';
import logger from '@/utils/logger';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!WEBHOOK_SECRET) {
    logger.error("Missing CLERK_WEBHOOK_SECRET");
    return new Response('Webhook secret not configured', { status: 500 });
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    logger.error("Missing svix headers", { svix_id, svix_timestamp, svix_signature });
    return new Response('Missing svix headers', { status: 400 });
  }
  
  try {
    const payload = await req.json();
    const webhook = new Webhook(WEBHOOK_SECRET);
    
    const evt = webhook.verify(
      JSON.stringify(payload),
      {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }
    ) as WebhookEvent;

    logger.info("Processing webhook event", {
      type: evt.type,
      userId: evt.data.id,
      eventId: svix_id
    });

    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      const { id: userId, email_addresses, first_name, last_name, image_url } = evt.data as {
        id: string;
        email_addresses: Array<{ email_address: string }>;
        first_name: string | null;
        last_name: string | null;
        image_url: string | null;
      };

      const email = email_addresses[0]?.email_address?.toLowerCase();

      if (!email) {
        logger.warn("No email found in webhook data", { 
          userId,
          eventId: svix_id,
          emailAddresses: email_addresses 
        });
        return new Response('No email found', { status: 400 });
      }

      try {
        await convex.mutation(api.users.syncUser, {
          userId,
          email,
          name: `${first_name || ''} ${last_name || ''}`.trim() || 'Unknown',
          imageUrl: image_url || undefined
        });

        logger.info("User synced successfully", {
          userId,
          email,
          type: evt.type,
          eventId: svix_id
        });

        return new Response('Webhook processed', { status: 200 });
      } catch (syncError) {
        logger.error("User sync failed", {
          error: syncError instanceof Error ? syncError.message : "Unknown error",
          userId,
          email,
          eventId: svix_id
        });
        
        // Return 200 to acknowledge receipt but log the error
        return new Response('Webhook received but sync failed', { status: 200 });
      }
    }

    logger.info("Unhandled webhook event type", {
      type: evt.type,
      eventId: svix_id
    });
    return new Response('Webhook event type not handled', { status: 200 });
  } catch (err) {
    logger.error("Webhook processing failed", {
      error: err instanceof Error ? err.message : "Unknown error",
      eventId: svix_id
    });
    return new Response('Webhook verification failed', { status: 400 });
  }
} 