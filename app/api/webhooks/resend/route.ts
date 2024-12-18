import { NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import logger from "@/utils/logger";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface ResendWebhookEvent {
  type: "email.sent" | "email.delivered" | "email.delivery_delayed" | "email.bounced" | "email.complained";
  data: {
    to: string;
    from: string;
    subject?: string;
    id: string;
    created_at: string;
  };
}

export async function POST(request: Request) {
  const payload = await request.json() as ResendWebhookEvent;
  const signature = request.headers.get("resend-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 401 }
    );
  }

  try {
    switch (payload.type) {
      case "email.delivered":
        // Log successful delivery
        logger.info("Email delivered:", payload.data);
        break;
      case "email.bounced":
        // Handle bounced email
        await convex.mutation(api.invitations.markEmailBounced, {
          email: payload.data.to,
        });
        break;
      default:
        logger.info("Unhandled webhook event:", payload.type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 