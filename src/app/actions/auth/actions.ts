"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isUsernameOrEmailExists } from "../db/actions";
import {
  EmailSchema,
  LoginSchema,
  ResetPasswordSchema,
  SignupSchema,
} from "@/zod/schema";
import { getTranslations } from "next-intl/server";
import { isProduction } from "std-env";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import { SignInWithPasswordCredentials } from "@supabase/supabase-js";
import { revalidate } from "../other/action";
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"), // تقليل المحاولات إلى 5 في الدقيقة
});
export async function login(formData: unknown, turnstileToken: string) {
  const res = LoginSchema.safeParse(formData);
  const header = await headers();

  if (!res.success) {
    const errorMessage = res.error.flatten().formErrors.join("\n");
    return { error: { type: "Invalidate inputs", message: errorMessage } };
  }
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const _data: SignInWithPasswordCredentials = {
    email: res.data.email,
    password: res.data.password,
    options: {
      captchaToken: turnstileToken,
    },
  };
  const identifier =
    header.get("cf-connecting-ip") || // إذا كنت تستخدم Cloudflare
    header.get("x-real-ip") || // من Nginx أو بعض الـ Proxies
    (header.get("x-forwarded-for") || "").split(",")[0]?.trim() || // أقل أمانًا
    "127.0.0.1";

  const { success } = await ratelimit.limit(identifier);
  if (!success) {
    return {
      error: {
        message:
          "You've reached the maximum login attempts. Please wait a moment and try again.",
      },
    };
  }
  const {
    error,
    data: { user },
  } = await supabase.auth.signInWithPassword(_data);

  if (error) {
    if (error.code == "invalid_credentials") {
      return {
        error: {
          message:
            "Incorrect email or password. Please check your credentials and try again.",
        },
      };
    }
    return { error: { type: error.code, message: error.message } };
  }

  if (!user) {
    redirect("/error");
  }
  console.log(_data);

  // const resSaveUser = await saveUser(user);
  // if (resSaveUser && resSaveUser.error) {
  //   return { error: { type: "Save user", message: resSaveUser.error } };
  // }

  revalidatePath(`/`, "layout");
  redirect("/chat");
}

export async function signup(formData: unknown, turnstileToken: string) {
  const res = SignupSchema.safeParse(formData);
  const header = await headers();
  if (!res.success) {
    const errorMessage = res.error.flatten().formErrors.join("\n");
    return { error: { type: "Invalidate inputs", message: errorMessage } };
  }
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const _data = {
    email: res.data.email.trim(),
    password: res.data.password.trim(),
    data: {
      user_name: res.data.username,
    },
    options: {
      captchaToken: turnstileToken,
    },
  };
  const identifier =
    header.get("cf-connecting-ip") || // إذا كنت تستخدم Cloudflare
    header.get("x-real-ip") || // من Nginx أو بعض الـ Proxies
    (header.get("x-forwarded-for") || "").split(",")[0]?.trim() || // أقل أمانًا
    "127.0.0.1";

  const { success } = await ratelimit.limit(identifier);
  if (!success) {
    return {
      error: {
        message:
          "You've reached the maximum login attempts. Please wait a moment and try again.",
      },
    };
  }
  const [t, supabase, { emailExists, usernameExists }] = await Promise.all([
    getTranslations("Auth.action"),
    createClient(),
    isUsernameOrEmailExists(_data.data.user_name.trim(), _data.email.trim()),
  ]);

  if (emailExists && usernameExists) {
    return {
      error: {
        message: "The email is already in use. Try another email or log in.",
      },
    };
  } else if (!emailExists && usernameExists) {
    return {
      error: {
        message: "The username is already taken. Please choose another.",
      },
    };
  } else if (emailExists && !usernameExists) {
    return {
      error: {
        message: "The email is already in use. Try another email or log in.",
      },
    };
  }

  const { error } = await supabase.auth.signUp(_data);

  if (error) {
    return { error: { type: error.name, message: error.message } };
  }

  return { success: { message: t("successSignUp") } };
}

export async function resendConfirmationEmail(email: string) {
  const t = await getTranslations("Auth.action");

  const supabase = await createClient();
  await supabase.auth.resend({ email, type: "signup" });
  return { success: t("successSignUp") };
}
export async function resetPassword(formData: unknown, turnstileToken: string) {
  const [t, header] = await Promise.all([
    getTranslations("Auth.action"),
    headers(),
  ]);
  const identifier =
    header.get("cf-connecting-ip") || // إذا كنت تستخدم Cloudflare
    header.get("x-real-ip") || // من Nginx أو بعض الـ Proxies
    (header.get("x-forwarded-for") || "").split(",")[0]?.trim() || // أقل أمانًا
    "127.0.0.1";

  const { success } = await ratelimit.limit(identifier);
  if (!success) {
    return {
      error: {
        message:
          "You've reached the maximum Reset password attempts. Please wait a moment and try again.",
      },
    };
  }
  try {
    const res = EmailSchema.safeParse(formData);

    if (!res.success) {
      const errorMessage = res.error.flatten().formErrors.join("\n");
      return { error: { type: "Invalidate inputs", message: errorMessage } };
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(
      res.data.email,
      {
        captchaToken: turnstileToken,
      },
    );
    if (error) {
      return { error: { type: error.name, message: error.message } };
    }

    return { success: { message: t("successResetPassword") } };
  } catch (error) {
    return {
      error: {
        type: "Unexpected Error",
        message: error instanceof Error ? error.message : t("unexpectedError"),
      },
    };
  }
}
export async function updatePassword(formData: unknown) {
  const t = await getTranslations("Auth.action");

  try {
    const res = ResetPasswordSchema.safeParse(formData);

    if (!res.success) {
      let errorMessage = "";

      res.error.issues.forEach((is) => {
        errorMessage += is.path[0] + ":" + is.message + ".";
      });
      return { error: { type: "Invalidate inputs", message: errorMessage } };
    }
    const supabase = await createClient();
    await supabase.auth.updateUser({ password: res.data.password });

    return { success: t("successUpdatePassword") };
  } catch (error) {
    return {
      error: {
        type: "Unexpected Error",
        message: error instanceof Error ? error.message : t("unexpectedError"),
      },
    };
  }
}

export async function signInWithLinkIdentity() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.linkIdentity({
    provider: "google",

    options: {
      redirectTo: `https://rtai.chat/terms-of-service`,
    },
  });

  if (error) {
    console.error(error);
    redirect(`/auth/${error.status}`);
  }
  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
}
export async function signInWithOAuth() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: isProduction
        ? `https://rtai.chat/auth/callback`
        : "http://localhost:3000/auth/callback",
    },
  });

  if (error) {
    console.error(error);
    redirect(`/auth/${error.status}`);
  }

  if (data.url) {
    revalidatePath(`/chat`, "layout");
    redirect(data.url); // use the redirect API for your server framework
  }
}
export async function signAnonymously(token: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInAnonymously({
    options: {
      captchaToken: token,
    },
  });
  console.log(data, error);

  if (error || !data?.user) {
    redirect(`/auth/${error?.status ?? 400}`);
  } else {
    return await revalidate();
  }
}

