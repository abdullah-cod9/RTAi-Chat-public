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
import { login, signInWithOAuth } from "@/app/actions/auth/actions";
import { LoginSchema } from "@/zod/schema";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useCallback, useRef, useState } from "react";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { useMediaQuery } from "usehooks-ts";
export function Login() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const ref = useRef<TurnstileInstance>(null)

  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const t = useTranslations("Auth.Login");
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    const result = LoginSchema.safeParse(values);
    if (!result.success) {
      let errorMessage = "";

      result.error.issues.forEach((is) => {
        errorMessage += is.path[0] + ":" + is.message + ".";
      });
      toast.error(errorMessage);
      ref.current?.reset()
      return;
    }
    if (!turnstileToken) { ref.current?.reset()
       return toast.error("Verification failed. Please try again.");}
    

    const res = await login(values, turnstileToken);
    if (res.error) {
      toast.error(res.error.message);
    }
    ref.current?.reset()
  }
  const onInvalid = () => {
    // toast({ description: errors, variant: "destructive" });
    ref.current?.reset()
  };
  const handleSuccess = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);
  const handleOAuth = async () => {
    await signInWithOAuth();
  };
  return (
    <div className="mt-40 flex w-full items-center justify-center">
      {/* <Link
        className="absolute left-5 top-5 flex items-center gap-1 text-foreground/80 md:left-10 md:top-10"
        href={"/"}
      >
        <IoIosArrowBack />
        {t("home")}
      </Link> */}
      <Form {...form}>
        <form
          dir="auto"
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="flex h-fit flex-col gap-6 rounded-sm bg-secondary/50 p-4 dark:bg-secondary/30 sm:w-96"
        >
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
                    type="email"
                    placeholder={t("email.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-foreground/80">
                    {t("password.title")}
                  </FormLabel>
                  <Link
                    href={"/resetpassword"}
                    className="m-0 h-fit w-fit p-0 text-xs text-foreground/80 hover:underline hover:underline-offset-4"
                  >
                    {t("resetPassword")}
                  </Link>
                </div>
                <FormControl>
                  <Input dir="ltr" type="password" {...field} />
                </FormControl>
                <FormMessage />
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
          <Button onClick={handleOAuth} type="button" variant={"outline"}>
            {t("oAuthGoogle")}
          </Button>
          <p className="mt-5 text-center text-foreground/80">
            {t("Signup.m1")}{" "}
            <Link
              className="text-blue-600 hover:underline hover:underline-offset-4"
              href={"/signup"}
            >
              {t("Signup.m2")}
            </Link>
          </p>
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
