import { NextResponse } from "next/server";
import { WebhookEvent } from "@resend/webhooks";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
  const payload: WebhookEvent = await request.json();
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
        console.log("Email delivered:", payload.data);
        break;
      case "email.bounced":
        // Handle bounced email
        await convex.mutation(api.invitations.markEmailBounced, {
          email: payload.data.to,
        });
        break;
      default:
        console.log("Unhandled webhook event:", payload.type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 