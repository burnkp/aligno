import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";
import logger from "./lib/logger";

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequest(request);
    if (!event) {
      logger.error("Failed to validate Clerk webhook request");
      return new Response("Invalid webhook request", { status: 400 });
    }

    logger.info("Received Clerk webhook event", { 
      type: event.type,
      eventId: event.data.id 
    });

    try {
      switch (event.type) {
        case "user.created":
        case "user.updated": {
          const email = event.data.email_addresses?.[0]?.email_address;
          if (!email) {
            logger.error("No email address found in Clerk event", { 
              eventType: event.type,
              userId: event.data.id 
            });
            return new Response("Invalid user data", { status: 400 });
          }

          // Update or create user in Convex
          await ctx.runMutation(api.users.syncUser, {
            clerkId: event.data.id,
            email: email.toLowerCase(),
            name: `${event.data.first_name || ''} ${event.data.last_name || ''}`.trim(),
          });

          logger.info("User synced successfully", {
            userId: event.data.id,
            email: email.toLowerCase(),
            eventType: event.type
          });
          break;
        }

        case "user.deleted": {
          const clerkId = event.data.id;
          if (!clerkId) {
            logger.error("No user ID found in delete event");
            return new Response("Invalid user ID", { status: 400 });
          }

          await ctx.runMutation(api.users.deleteUser, { clerkId });
          logger.info("User deleted successfully", { userId: clerkId });
          break;
        }

        case "organizationMembership.created": {
          logger.info("Organization membership created", {
            userId: event.data.public_user_data?.user_id,
            organizationId: event.data.organization?.id,
            role: event.data.role
          });
          break;
        }

        case "organization.created": {
          logger.info("Organization created in Clerk", {
            organizationId: event.data.id,
            name: event.data.name,
            createdBy: event.data.created_by
          });
          break;
        }

        default: {
          logger.info("Ignored Clerk webhook event", { 
            type: event.type,
            eventId: event.data.id 
          });
        }
      }

      return new Response(null, { status: 200 });
    } catch (error) {
      logger.error("Error processing Clerk webhook", {
        error: error instanceof Error ? error.message : "Unknown error",
        eventType: event.type,
        eventId: event.data.id
      });
      return new Response("Error processing webhook", { status: 500 });
    }
  }),
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text();
  
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    logger.error("CLERK_WEBHOOK_SECRET is not configured");
    return null;
  }

  const wh = new Webhook(webhookSecret);
  
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    logger.error("Error verifying webhook signature", {
      error: error instanceof Error ? error.message : "Unknown error",
      headers: {
        id: req.headers.get("svix-id"),
        timestamp: req.headers.get("svix-timestamp")
      }
    });
    return null;
  }
}

export default http; 