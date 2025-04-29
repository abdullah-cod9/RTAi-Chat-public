import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { calculateRemainingCredits } from "@/app/actions/db/actions";
import { userCache, userPlanCache } from "@/app/actions/caches/action";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
  redis,
  analytics: true,
  limiter: Ratelimit.slidingWindow(10, "60s"),
});
export async function POST(req: Request) {
  const {
    prompt,
    responseLanguage,
    userId,
  }: { prompt: string; responseLanguage: string; userId: string } =
    await req.json();
  const key = userId;

  const [{ success }, { featuresPlan, subscriptionType }] = await Promise.all([
    ratelimit.limit(key),
    userPlanCache(userId),
    userCache(userId),
  ]);
  if (!success) {
    return new Response("⚠️ Rate limit exceeded. Please wait and try again.", {
      status: 429,
    });
  }
  if (!featuresPlan.isActive) {
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
  const systemPrompt = `You are a concise and helpful assistant. Generate a response based solely on the USER PROMPT and the provided TEXT BLOCK. Return only the answer without commentary or irrelevant details.${
    responseLanguage === "auto"
      ? ""
      : `The response language must be: ${responseLanguage}.`
  }`;
  const finalPrompt = `${prompt}\nThe response language must be: ${responseLanguage}.`;
  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    prompt: finalPrompt,
    onFinish: async ({ usage }) => {
      await calculateRemainingCredits(
        userId,
        "gpt-4o-mini",
        usage.promptTokens,
        usage.completionTokens,
      );
    },
  });

  return result.toDataStreamResponse();
}
