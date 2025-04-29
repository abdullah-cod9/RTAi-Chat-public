"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInWithOAuth, signup } from "@/app/actions/auth/actions";
import { SignupSchema } from "@/zod/schema";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useCallback, useRef, useState } from "react";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { useMediaQuery } from "usehooks-ts";

export function Signup() {
  const t = useTranslations("Auth.Signup");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const ref = useRef<TurnstileInstance>(null);

  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  async function onSubmit(values: z.infer<typeof SignupSchema>) {
    const result = SignupSchema.safeParse(values);

    if (!result.success) {
      let errorMessage = "";

      result.error.issues.forEach((is) => {
        errorMessage += is.path[0] + ":" + is.message + ".";
      });
      ref.current?.reset();

      toast.error(errorMessage);
      return;
    }
    if (!turnstileToken)
      return toast.error("Verification failed. Please try again.");

    const res = await signup(values, turnstileToken);
    if (res.error) {
      toast.error(res.error.message);
      ref.current?.reset();

      return;
    }
    ref.current?.reset();

    toast.success(res.success.message);
    form.reset();
  }
  const onInvalid = () => {
    // toast({ description: errors, variant: "destructive" });
  };
  const handleOAuth = async () => {
    await signInWithOAuth();
  };
  const handleSuccess = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);
  return (
    <div className="flex h-svh w-full items-center justify-center px-2 pl-3">
      {/* <Link
        className="absolute left-5 top-5 flex items-center gap-1 text-foreground/80 md:left-10 md:top-10"
        href={"/"}
      >
        <IoIosArrowBack /> {t("home")}
      </Link> */}
      <Form {...form}>
        <form
          dir="auto"
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="flex h-fit w-full max-w-md flex-col gap-6 rounded-sm bg-secondary/50 p-4 dark:bg-secondary/30"
        >
          <p className="text-foreground/80">
            {t("Login.m1")}{" "}
            <Link className="text-blue-600" href={"/login"}>
              {t("Login.m2")}
            </Link>
          </p>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80">
                  {t("username.title")}
                </FormLabel>
                <FormControl>
                  <Input
                    dir="auto"
                    placeholder={t("username.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage dir="auto" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80">
                  {t("email.title")}
                </FormLabel>
                <FormControl>
                  <Input
                    dir="ltr"
                    placeholder={t("email.placeholder")}
                    {...field}
                  />
                </FormControl>{" "}
                <FormMessage dir="auto" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80">
                  {t("password.title")}
                </FormLabel>
                <FormControl>
                  <Input dir="ltr" {...field} />
                </FormControl>
                <FormMessage dir="auto" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80">
                  {t("confirmPassword.title")}
                </FormLabel>
                <FormControl>
                  <Input dir="ltr" {...field} />
                </FormControl>
                <FormMessage dir="auto" />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURUSTILE_SITE_KEY!}
              onSuccess={handleSuccess}
              options={{
                size: isDesktop ? "normal" : "compact",
              }}
              ref={ref}
              onExpire={() => ref.current?.reset()}
            />
          </div>
          <Button
            disabled={!turnstileToken || form.formState.isSubmitting}
            type="submit"
          >
            {t("button")}
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-[#f9f9fa] px-2 text-muted-foreground dark:bg-[#0b111e]">
              {t("or")}
            </span>
          </div>

          <Button type="button" onClick={handleOAuth} variant={"outline"}>
            {t("oAuthGoogle")}
          </Button>
          <div className="mt-4 text-balance px-3 text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4">
            {t("privacyPolicy.m1")}{" "}
            <Link prefetch className="text-blue-600" href={"/terms-of-service"}>
              {t("privacyPolicy.m2")}
            </Link>{" "}
            {t("privacyPolicy.m3")}{" "}
            <Link prefetch className="text-blue-600" href={"/privacy-policy"}>
              {t("privacyPolicy.m4")}
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
