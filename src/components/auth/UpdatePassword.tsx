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
import { updatePassword } from "@/app/actions/auth/actions";
import { ResetPasswordSchema } from "@/zod/schema";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { LucideChevronLeft } from "lucide-react";

export function UpdatePassword() {
  const searchParams = useSearchParams()

  const t = useTranslations("Auth.UpdatePassword");
  const router = useRouter();
  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const error_description = searchParams.get('error_description')
    if (!code || error || error_description) {
      router.replace('/auth/code/403')
    }
  }, [searchParams, router])
  
  const { toast } = useToast();
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  async function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
    router.prefetch("/login");
    const result = ResetPasswordSchema.safeParse(values);

    if (!result.success) {
      let errorMessage = "";

      result.error.issues.forEach((is) => {
        errorMessage += is.path[0] + ":" + is.message + ".";
      });
      toast({ description: errorMessage, variant: "destructive" });
      return;
    }

    const res = await updatePassword(values);
    if (res.error) {
      toast({ description: res.error.message, variant: "destructive" });
      return;
    }
    toast({ description: res.success });
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  }
  const onInvalid = () => {
    // toast({ description: errors, variant: "destructive" });
  };

  return (
    <div className="mt-40 flex w-full items-center justify-center">
      <Link
        className="absolute left-5 top-5 flex items-center gap-1 text-foreground/80 md:left-10 md:top-10"
        href={"/login"}
      >
        <LucideChevronLeft /> {t("home")}
      </Link>
      <Form {...form}>
        <form
        dir="auto"
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="flex flex-col gap-6 px-10 sm:w-96 h-fit bg-secondary/50 dark:bg-secondary/30 rounded-sm p-4"
        >
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
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{t("button")}</Button>
        </form>
      </Form>
    </div>
  );
}
