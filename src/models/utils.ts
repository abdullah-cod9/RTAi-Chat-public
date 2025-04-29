import { Message } from "ai/react";
import { encodingForModel } from "js-tiktoken";
import { encodingModel, ModelsType } from "./settings";
import { createClient } from "@/lib/supabase/server";
import { v4 } from "uuid";

export type Quality = "low" | "medium" | "high";
export type Dimensions = "1024x1024" | "1024x1536" | "1536x1024";

const imageTokenMap = new Map<Quality, Record<Dimensions, number>>([
  [
    "low",
    {
      '1024x1024': 272,
      '1024x1536': 408,
      '1536x1024': 400,
    },
  ],
  [
    "medium",
    {
      '1024x1024': 1056,
      '1024x1536': 1584,
      '1536x1024': 1568,
    },
  ],
  [
    "high",
    {
      '1024x1024': 4160,
      '1024x1536': 6240,
      '1536x1024': 6208,
    },
  ],
]);

export async function ContextWindow(
  messages: Message[],
  maxTokens: number,
  model: ModelsType,
  percentage: number = 0.25,
) {
  console.log(model);
  
  const encoding = encodingModel.get(model);
  if (!encoding) {
    throw new Error("Encoding model is undefined ");
  }
  const encoder = encodingForModel(encoding);
  let chatHistory = messages
    .flatMap((m) =>
      Array.isArray(m.parts)
        ? m.parts.flatMap((p) => (p.type === "text" ? p.text : []))
        : [],
    )
    .join(" ");

  let count: number = 0;
  const maxIterations = 5;
  let totalTokens = encoder.encode(chatHistory).length;
  let newMessages = [...messages];

  while (
    totalTokens > maxTokens &&
    newMessages.length > 1 &&
    count < maxIterations
  ) {
    count++;

    // 🔹 احذف نسبة من الرسائل بناءً على عدد التوكنات
    const removeCount = Math.ceil(newMessages.length * percentage);
    newMessages = newMessages.slice(removeCount);

    // 🔹 إعادة حساب عدد التوكنات بعد الحذف
    chatHistory = newMessages
      .flatMap((m) =>
        Array.isArray(m.parts)
          ? m.parts.flatMap((p) => (p.type === "text" ? p.text : []))
          : [],
      )
      .join(" ");
    totalTokens = encoder.encode(chatHistory).length;
    console.count(`Tokens Count: ${totalTokens}`);

    // 🔹 إذا كانت التوكنات أقل، توقف
    if (totalTokens < maxTokens) break;

    // 🔹 زيادة نسبة الحذف تدريجياً
    percentage += 0.25;
  }
  if (newMessages.length === 1 && totalTokens > maxTokens) {
    const singleMessage = newMessages[0];

    // 🔹 احصل على `parts` التي تحتوي على النصوص فقط
    const textParts = singleMessage.parts
      ? singleMessage.parts.filter((p) => p.type === "text")
      : [];

    if (textParts.length > 0) {
      const fullText = textParts.map((p) => p.text).join(" ");
      const tokenized = encoder.encode(fullText);

      // 🔹 قص النص للحجم المناسب
      const trimmedText = encoder.decode(tokenized.slice(0, maxTokens));

      // 🔹 تعديل الرسالة بحيث لا تتجاوز `maxTokens`
      newMessages = [
        {
          ...singleMessage,
          parts: [{ type: "text", text: trimmedText }],
        },
      ];
    }
  }
  return newMessages;
}

export async function saveGenerateImage(base64: string) {
  const uuid = v4();
  const supabase = await createClient();
  const buffer = Buffer.from(base64, "base64");
  const filePath = `Ai_images/${uuid}`;

  // احفظها في Supabase Storage مثلاً
  const { error } = await supabase.storage
    .from(process.env.SUPABASE_PUBLIC_BUCKETS_NAME!)
    .upload(filePath, buffer);

  if (error) {
    console.error('saveGenerateImage:',error);
    
    return null};

  // ارجع فقط رابط الصورة
  const { data } = supabase.storage
    .from(process.env.SUPABASE_PUBLIC_BUCKETS_NAME!)
    .getPublicUrl(filePath);

  if (data.publicUrl) {
    return data.publicUrl;
  }
  return null;
}

export async function getImageTokens(
  quality: Quality,
  dimensions: Dimensions,
  prompt: string,
) {
  const encoder = encodingForModel("gpt-4");
  const promptTokens = encoder.encode(prompt).length;
  const imageToken = imageTokenMap.get(quality)?.[dimensions];
  if (!imageToken) return undefined;
  return { promptTokens, imageToken };
}
