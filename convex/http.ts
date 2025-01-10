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

    logger.info("Received Clerk webhook event", { type: event.type });

    try {
      switch (event.type) {
        case "user.created":
        case "user.updated": {
          // Update or create user in Convex
          await ctx.runMutation(api.users.syncUser, {
            clerkId: event.data.id,
            email: event.data.email_addresses?.[0]?.email_address?.toLowerCase(),
            name: `${event.data.first_name || ''} ${event.data.last_name || ''}`.trim(),
          });
          break;
        }
        case "organization.created": {
          // Log organization creation from Clerk
          logger.info("Organization created in Clerk", {
            organizationId: event.data.id,
            name: event.data.name
          });
          break;
        }
        case "user.deleted": {
          const clerkId = event.data.id!;
          await ctx.runMutation(api.users.deleteUser, { clerkId });
          break;
        }
        default: {
          logger.info("Ignored Clerk webhook event", { type: event.type });
        }
      }

      return new Response(null, { status: 200 });
    } catch (error) {
      logger.error("Error processing Clerk webhook", {
        error: error instanceof Error ? error.message : "Unknown error",
        eventType: event.type
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
      error: error instanceof Error ? error.message : "Unknown error"
    });
    return null;
  }
}

export default http; 