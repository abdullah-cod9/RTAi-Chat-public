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
import { resetPassword } from "@/app/actions/auth/actions";
import { EmailSchema } from "@/zod/schema";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { LucideChevronLeft } from "lucide-react";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { useCallback, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

export function ResetPassword() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const t = useTranslations("Auth.ResetPassword");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const ref = useRef<TurnstileInstance>(null)

  const form = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: "",
    },
  });
  async function onSubmit(values: z.infer<typeof EmailSchema>) {

    const { error } = EmailSchema.safeParse(values);

    if (error) {
      const errorMessage = error.flatten().formErrors.join("\n");
      toast.error(errorMessage);
      ref.current?.reset()
      return;
    }
    if (!turnstileToken) { ref.current?.reset()
      return toast.error("Verification failed. Please try again.");}
    const res = await resetPassword(values, turnstileToken);

    if (res.error) {
      toast.error(res.error.message);
      ref.current?.reset()
      return;
    }
    toast.success(res.success.message);
    form.reset();
    ref.current?.reset()
  }
  const onInvalid = () => {
  
  
    // toast({ description: errors, variant: "destructive" });
  };  const handleSuccess = useCallback((token: string) => {
      setTurnstileToken(token);
    }, []);
  return (
    <div className="mt-40 flex w-full items-center justify-center">
      <Link
        className="absolute left-5 top-5 flex items-center gap-1 text-foreground/80 md:left-10 md:top-10"
        href={"/login"}
      >
        <LucideChevronLeft/> {t("home")}
      </Link>
      <Form {...form}>
        <form
        dir="auto"
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="flex w-[75%] flex-col gap-6 sm:w-96 h-fit bg-secondary/50 dark:bg-secondary/30 rounded-sm p-4"
        >
          <p className="text-base font-medium text-foreground/90">
            {t("resetYourPassword")}
          </p>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80">
                  {t("email.title")}
                </FormLabel>
                <FormControl>
                  <Input dir="ltr" placeholder={t("email.placeholder")} {...field} />
                </FormControl>
                <FormMessage dir="auto"/>
              </FormItem>
            )}
          />
       <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURUSTILE_SITE_KEY!}
              onSuccess={handleSuccess}
              options={{
                size: isDesktop ? "normal" : "compact",
              }}
              ref={ref}
              onExpire={() => ref.current?.reset()}
            />
          <Button
            disabled={!turnstileToken || form.formState.isSubmitting}
            type="submit"
          >
            {t("button")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
