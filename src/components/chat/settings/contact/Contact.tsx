import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { contactSchema } from "@/zod/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendEmail } from "@/app/actions/other/action";
import { useTranslations } from "next-intl";
type Props = { username: string; email: string | null };

export default function Contact({ email, username }: Props) {
  const t = useTranslations("Chat.settings.Contact");
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      username: username,
      email: email as string,
      type: "feature",
    },
  });
  async function onSubmit(values: z.infer<typeof contactSchema>) {
    const { error } = contactSchema.safeParse(values);
    if (error) {
      const errorMessage = error.flatten().formErrors.join("\n");

      toast.error(errorMessage);
      return;
    }

    const res = await sendEmail(values);
    if (res.error) {
      toast.error(res.error.message);
    } else {
      toast.success(t("toast_successfully_sent"));
      form.reset();
    }
  }
  const onInvalid = () => {
    // toast({ description: errors, variant: "destructive" });
  };
  return (
    <Form {...form}>
      <form
        dir="auto"
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="mt-5 flex w-full flex-col gap-2"
      >
        <h4> {t("title")}</h4>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/80">
                {t("username")}
              </FormLabel>
              <FormControl>
                <Input dir="auto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/80">{t("email")}</FormLabel>
              <FormControl>
                <Input dir="auto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/80">
                {t("message")}
              </FormLabel>
              <FormControl>
                <Textarea dir="auto" className="h-40 resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="mt-1">
              <FormLabel className="text-foreground/80">
                {t("contact_about")}
              </FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  {...field}
                  onValueChange={(value) => field.onChange(value)}
                  className="flex flex-col items-start gap-5"
                >
                  <ToggleGroupItem
                    dir="auto"
                    value="feature"
                    className="focus: h-fit w-full justify-start border p-2 px-3 hover:bg-muted hover:text-foreground dark:hover:bg-muted/70"
                    aria-label="Feature request"
                  >
                    {t("option_feature")}
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="bug"
                    aria-label="Report a bug"
                    className="h-fit w-full justify-start border p-2 px-3 hover:bg-muted hover:text-foreground dark:hover:bg-muted/70"
                    dir="auto"
                  >
                    {t("option_bug")}
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="billingIssues"
                    aria-label="Billing issue"
                    className="h-fit w-full justify-start border p-2 px-3 hover:bg-muted hover:text-foreground dark:hover:bg-muted/70"
                    dir="auto"
                  >
                    {t("option_billing")}
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="mt-2"
          disabled={form.formState.isSubmitting}
          type="submit"
        >
          {t("submit")}
        </Button>
      </form>
    </Form>
  );
}
