"use server";
import { cookies, headers } from "next/headers";
import { Locale, defaultLocale, locales } from "@/i18n/config";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { revalidatePath, revalidateTag } from "next/cache";
import { Resend } from "resend";
import { contactSchema } from "@/zod/schema";

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = "NEXT_LOCALE";
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function getUserLocale() {
  return (await cookies()).get(COOKIE_NAME)?.value || defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  const cookieStore = await cookies();

  if (locale === "auto") {
    const acceptLanguage = (await headers()).get("accept-language");
    let detectedLocale = acceptLanguage?.split(",")[0] || defaultLocale;
    if (!locales.includes(detectedLocale as Locale)) {
      detectedLocale = defaultLocale;
    }
    cookieStore.set(COOKIE_NAME, detectedLocale);
  } else {
    cookieStore.set(COOKIE_NAME, locale);
  }
}
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"),
});
export async function reteLimitByUserId(
  userId: string,
  limiter?: number,
): Promise<
  | {
      success: boolean;
      reset: number;
    }
  | {
      success: boolean;
      reset: undefined;
    }
> {
  const identifier = userId;
  const { success, reset } = await ratelimit.limit(identifier, {
    rate: limiter,
  });
  if (!success) {
    return { success: false, reset };
  }
  return { success: true, reset: undefined };
}

export async function revalidate() {
  // revalidateTag(`getChats-${userId}`);
  // revalidateTag(`getPublicId-${userId}`);
  // revalidateTag(`getUser-${userId}`);
  // revalidateTag(`IsChatValid-${chatId}`);
  // revalidateTag(`InitialMessage-${chatId}`);
  // revalidatePath('/chat/[chatId]', 'page')
  revalidatePath("/", "layout");
}
export async function invalidateTag(kye: string, type: "chatId") {
  switch (type) {
    case "chatId":
      revalidateTag(`InitialMessage-${kye}`);
      break;
  }
}
const sendEmailLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "60 s"), // تقليل المحاولات إلى 5 في الدقيقة
});
export async function sendEmail(formData: unknown) {
  const { error, data } = contactSchema.safeParse(formData);

  if (error) {
    const errorMessage = error.flatten().formErrors.join("\n");
    return { error: { message: errorMessage } };
  }
  const { username, email, message, type } = data;
  const identifier = email;

  const { success } = await sendEmailLimit.limit(identifier);
  if (!success) {
    return {
      error: {
        message:
          "You can only send a request 3 times per minute. Please try again after a short wait.",
      },
    };
  }
  try {
    const { data: resendData, error } = await resend.emails.send({
      
      from: "RTAI Chat Support <contact@rtai.chat>",
      to: ["support@rtai.chat"],
      replyTo: email,
      subject: "Message from contact form RTAi chat",

      html: ` <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #333; text-align: center;">🚀 New Contact Form Submission</h2>

    <p><strong>📌 Name:</strong> ${username}</p>
    <p><strong>📧 Email:</strong> ${email}</p>
    <p><strong>📝 Type:</strong> ${
      type === "feature"
        ? "💡 Feature Request"
        : type === "bug"
          ? "🐛 Bug Report"
          : "💰 Billing Issue"
    }</p>

    <hr style="border: 1px solid #ddd; margin: 20px 0;"/>

    <p style="font-size: 16px;"><strong>📩 Message:</strong></p>
    <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>

    <hr style="border: 1px solid #ddd; margin: 20px 0;"/>

    <p style="font-size: 14px; color: #555;">📅 <strong>Submitted on:</strong> ${new Date().toLocaleString()}</p>
    
    <p style="text-align: center; font-size: 14px; color: #777;">
      🔔 <em>Please review and respond as soon as possible!</em>
    </p>
  </div>`,
      text: `
🚀 New Contact Form Submission

📌 Name: ${username}
📧 Email: ${email}
📝 Type: ${
        type === "feature"
          ? "💡 Feature Request"
          : type === "bug"
            ? "🐛 Bug Report"
            : "💰 Billing Issue"
      }

------------------------------
📩 Message:
${message}
------------------------------

📅 Submitted on: ${new Date().toLocaleString()}

🔔 Please review and respond as soon as possible!
`,
    });

    if (error) {
      return { error: { message: error.message } };
    }

    console.log(resendData);
    return { success: { message: "ok" } };
  } catch (error) {
    return {
      error: {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while submitting. Please try again later.",
      },
    };
  }
}
