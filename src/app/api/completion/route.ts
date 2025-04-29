import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { calculateRemainingCredits } from "@/app/actions/db/actions";
import { userCache, userPlanCache } from "@/app/actions/caches/action";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const redis = Redis.fromEnv();

const ratelimit = {
  free: new Ratelimit({
    redis,
    analytics: true,
    prefix: "ratelimit:free",
    limiter: Ratelimit.slidingWindow(5, "30s"),
  }),
  paid: new Ratelimit({
    redis,
    analytics: true,
    prefix: "ratelimit:paid",
    limiter: Ratelimit.slidingWindow(10, "60s"),
  }),
};
type JsonPOST = {
  prompt: string;
  userId: string;
  planType: "plus" | "free" | "pro" | "enterprise";
};
export async function POST(req: Request) {
  const { prompt, planType, userId }: JsonPOST = await req.json();
  const key = userId;
  const limitToUse = planType === "plus" ? ratelimit.paid : ratelimit.free;

  const [{ success }, { featuresPlan:{isActive}, subscriptionType }] = await Promise.all([
    limitToUse.limit(key),
    userPlanCache(userId),
    userCache(userId),
  ]);
  if (subscriptionType !== planType) {
    return new Response(
      "Subscription type mismatch. Please refresh the page or contact support if this issue persists.",

      {
        status: 400, // Bad Request
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
  if (!success) {
    return new Response("⚠️ Rate limit exceeded. Please wait and try again.", {
      status: 429,
    });
  }

  if (!isActive) {
    return new Response(
      subscriptionType === "free"
        ? "You've reached your free token limit for today. No worries — your tokens will automatically refresh tomorrow."
        : "You've used all your available tokens. Please renew your subscription to continue, or try again tomorrow with a limited token allowance.",

      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    prompt,
    onFinish: async ({ usage }) => {
      await calculateRemainingCredits(
        userId,
        "gpt-4o-mini",
        usage.promptTokens,
        usage.completionTokens,
      );

    },
    onError: ({error}) => {
      console.error(error);
      
    }
  });

  return result.toDataStreamResponse();
}
