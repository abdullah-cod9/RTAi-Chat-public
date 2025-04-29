import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  calculateImageTokens,
  calculateRemainingCredits,
  findSimilar,
  saveAssistantMessage,
  userGenerateImage,
} from "@/app/actions/db/actions";
import { z } from "zod";
import { Message } from "ai/react";
import {
  createDataStreamResponse,
  streamText,
  tool,
  experimental_generateImage as generateImage,
} from "ai";
import { system, system_KB } from "@/models/rules";
import {
  windowSize,
  models,
  ModelsType,
  reasoningModels,
} from "@/models/settings";
import {
  ContextWindow,
  Dimensions,
  getImageTokens,
  Quality,
  saveGenerateImage,
} from "@/models/utils";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { userCache, userPlanCache } from "@/app/actions/caches/action";
import { Parts } from "@/lib/myTypes";
import { openai } from "@ai-sdk/openai";

export const maxDuration = 30;
type JsonPOST = {
  messages: Message[];
  chatId: string;
  userId: string;
  planType: "free" | "plus" | "pro" | "enterprise";
  userPreferences: {
    reasoningEffort: "low" | "medium" | "high";
    selectedKBId: {
      type: "RAG" | "CAG";
      ids: string[];
    } | null;
    model: ModelsType;
    imageQuality: Quality;
    imageDimensions: Dimensions;
  };
};
const i = `https://api.rtai.chat/storage/v1/object/public/Public_assets/Ai_images/c694f80a-d4dd-4765-9328-781964c6c6fe`;
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

export async function POST(req: Request) {
  try {
    const { messages, chatId, userId, userPreferences, planType }: JsonPOST =
      await req.json();
    const {
      model,
      reasoningEffort,
      selectedKBId,
      imageDimensions,
      imageQuality,
    } = userPreferences;
    const key = userId;
    const limitToUse = planType === "plus" ? ratelimit.paid : ratelimit.free;
    const window = windowSize.get(model);
    if (!window) {
      return new Response("⚠️ context window is undefined.", { status: 500 });
    }
    // console.time("ContextWindow");
    let generateImageUrl: string | null = null;
    const [
      { success },
      {
        featuresPlan: { isActive, accessModels, imageGenerations },
        subscriptionType,
      },
      _messages,
      { email },
    ] = await Promise.all([
      limitToUse.limit(key),
      userPlanCache(userId),
      ContextWindow(messages, window, model),
      userCache(userId),
    ]);
    // console.timeEnd("ContextWindow");
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
    if (!imageGenerations && subscriptionType === "plus") {
      const message =
        "You have reached your image generation limit. Please renew your subscription to continue.";

      return new Response(message, {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (
      !accessModels
        .filter((m) => (!email ? m !== "gpt-image-1" : m))
        .includes(model)
    ) {
      return new Response(
        "This model requires a Plus subscription. Please upgrade or select a different model.",
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // call ratelimit

    // block the request if unsuccessful
    if (!success) {
      return new Response(
        "⚠️ Rate limit exceeded. Please wait and try again.",
        { status: 429 },
      );
    }
    const selectedModel = models.get(model);
    if (!selectedModel) {
      throw new Error(`Model ${model} not found.`);
    }

    const isRAG = selectedKBId?.type === "RAG" && selectedKBId.ids.length > 0;

    let systemPrompt = system + `\nUser subscription type:${subscriptionType}`;
    if (isRAG) {
      systemPrompt += `\n${system_KB}`;
    }

    return createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.writeData("initialized call");
        const result = streamText({
          model: selectedModel,
          system: systemPrompt,
          messages: _messages,
          providerOptions: reasoningModels.includes(model)
            ? {
                openai: {
                  reasoningEffort: reasoningEffort,
                  reasoningSummary: "detailed",
                },
              }
            : undefined,
          temperature: reasoningModels.includes(model) ? 1 : 0,
          maxSteps: 3,
          toolChoice: "auto",
          tools: {
            searchDocument: tool({
              description: `get information from Document to answer questions.`,
              parameters: z.object({
                question: z.string().describe("the users question"),
              }),
              execute: async ({ question }) => {
                if (isRAG) {
                  return await findSimilar(userId, question, selectedKBId.ids);
                } else {
                  return "no information fond";
                }
              },
            }),
            ...(model === "gpt-image-1" && {
              generateImage: tool({
                description: "Generate an image",
                parameters: z.object({
                  prompt: z
                    .string()
                    .describe("The prompt to generate the image from"),
                }),
                execute: async ({ prompt }) => {
                  const { image } = await generateImage({
                    model: openai.image("gpt-image-1"),
                    prompt,
                    providerOptions: {
                      openai: {
                        quality:
                          subscriptionType === "free" ? "low" : imageQuality,
                        size:
                          subscriptionType === "free"
                            ? "1024x1024"
                            : imageDimensions,
                      },
                    },
                  });
                  // in production, save this image to blob storage and return a URL
                  const [url, imageTokens] = await Promise.all([
                    saveGenerateImage(image.base64),
                    getImageTokens(imageQuality, imageDimensions, prompt),
                    userGenerateImage(userId),
                  ]);
                  if (!imageTokens)
                    throw new Error("Image tokens is undefined");
                  const { promptTokens, imageToken } = imageTokens;
                  console.log(
                    `promptTokens:`,
                    promptTokens,
                    `imageToken:`,
                    imageToken,
                  );

                  calculateRemainingCredits(userId, model, promptTokens, 0);
                  calculateImageTokens(userId, model, 0, imageToken);
                  if (url) {
                    generateImageUrl = url;
                    return { image: url, prompt };
                  } else {
                    generateImageUrl = i;
                    return { image: i, prompt };
                  }
                },
              }),
            }),
          },
          onChunk() {
            // dataStream.writeMessageAnnotation({ reasoning: "chunk.textDelta" });
            // switch (chunk.type) {
            //   case "text-delta":
            //     console.log("Text:", chunk.textDelta);
            //     break;
            //   case "reasoning":
            //     console.log("Reasoning:", chunk.textDelta);
            //     break;
            //   case "source":
            //     console.log("Source:", chunk.source);
            //     break;
            //   case "tool-call-streaming-start":
            //     console.log("Tool Call ID:", chunk.toolCallId);
            //     break;
            // }
          },
          onFinish: async ({ text, reasoningDetails, reasoning, usage }) => {
            const uuid = uuidv4();
            const parts: Parts[] = [
              ...(reasoning
                ? [
                    {
                      type: "reasoning" as const,
                      reasoning: reasoning,
                      details: reasoningDetails,
                    },
                  ]
                : []),
              ...(generateImageUrl
                ? [
                    {
                      type: "file" as const,
                      data: generateImageUrl,
                      mimeType: "image/png",
                    },
                  ]
                : [{ type: "text" as const, text: text }]),
            ];

            dataStream.writeMessageAnnotation({
              modelMetadata: {
                id: uuid,
                modelName: model,
              },
            });
            // call annotation:
            dataStream.writeData("call completed");
            saveAssistantMessage(userId, uuid, chatId, parts, model);
            await calculateRemainingCredits(
              userId,
              model,
              usage.promptTokens,
              usage.completionTokens,
            );
          },
        });
        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
          sendSources: true,
        });
      },
      onError: (error) => {
        // Error messages are masked by default for security reasons.
        // If you want to expose the error message to the client, you can do so here:
        console.error(error);

        return `An unexpected error occurred.`;
      },
    });
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 },
    );
  }
}
