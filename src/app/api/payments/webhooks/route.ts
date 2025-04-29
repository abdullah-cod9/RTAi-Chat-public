import { Webhook } from "standardwebhooks";
import { headers } from "next/headers";
import { WebhookPayload } from "@/@types/api-types";
import { logger } from "@/lib/DODO/logger";
import {
  cancelledSubscription,
  expiredSubscription,
  onHoldSubscription,
  pausedSubscription,
  setSubscription,
} from "@/app/actions/db/actions";

const webhook = new Webhook(process.env.NEXT_PUBLIC_DODO_WEBHOOK_KEY!);

export async function POST(request: Request) {
  const headersList = await headers();

  try {
    const rawBody = await request.text();
    logger.info("Received webhook request", { rawBody });
    const webhookHeaders = {
      "webhook-id": headersList.get("webhook-id") || "",
      "webhook-signature": headersList.get("webhook-signature") || "",
      "webhook-timestamp": headersList.get("webhook-timestamp") || "",
    };
    await webhook.verify(rawBody, webhookHeaders);
    logger.info("Webhook verified successfully");
    const payload = JSON.parse(rawBody) as WebhookPayload;
    if (!payload.data?.customer?.email) {
      throw new Error("Missing email in payload");
    }

    if (payload.data.payload_type === "Subscription") {
      switch (payload.data.status) {
        case "active":
          const {
            created_at,
            next_billing_date,
            subscription_id,
            customer: { email },
          } = payload.data;
          await setSubscription(
            "plus",
            email,
            subscription_id,
            next_billing_date,
            created_at,
          );
          break;
        case "expired":
          {
            const { subscription_id } = payload.data;
            await expiredSubscription(subscription_id);
          }
          break;
        case "cancelled":
          {
            const { subscription_id } = payload.data;
            if (!subscription_id) {
              throw new Error("Missing subscription_id in payload");
            }
            await cancelledSubscription(subscription_id);
          }
          break;
        case "paused":
          {
            const { subscription_id } = payload.data;
            await pausedSubscription(subscription_id);
          }
          break;
        case "on_hold":
          {
            const { subscription_id } = payload.data;
            await onHoldSubscription(subscription_id);
          }
          break;
        case "failed":
          {
            const { subscription_id } = payload.data;
            console.error(
              "subscription failed",
              "subscription_id:",
              subscription_id,
            );
          }
          break;

        default:
          console.log("payload.data.status:", payload.data.status);
          break;
      }
    } else if (
      payload.data.payload_type === "Payment" &&
      payload.type === "payment.succeeded" &&
      !payload.data.subscription_id
    ) {
      console.log("OneTimePayment");
    }

    return Response.json(
      { message: "Webhook processed successfully" },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Webhook processing failed", error);
    return Response.json(
      {
        error: "Webhook processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}
