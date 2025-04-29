import React, { useState } from "react";
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
import { checkoutFormSchema } from "@/zod/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { CountrySelect } from "./CountrySelector/CountrySelect";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

type Props = { email: string };

export default function CheckoutForm({ email }: Props) {
  const t = useTranslations("checkout.checkoutForm");
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof checkoutFormSchema>>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email,
      country: "",
      addressLine: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });
  const createPaymentLink = async (
    formData: typeof checkoutFormSchema._type,
    setIsLoading: (isLoading: boolean) => void,
  ) => {
    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Payment link creation failed");
      }

      const data = await response.json();
      window.location.href = data.paymentLink;
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred");
      }
      console.error("Payment error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const onSubmit = async (data: z.infer<typeof checkoutFormSchema>) => {
    setIsLoading(true);

    await createPaymentLink(data, setIsLoading);
    setIsLoading(false);
  };

  const onInvalid = () => {
    // toast({ description: errors, variant: "destructive" });
  };
  return (
    <div className="flex justify-center">
      <Form {...form}>
        <form
          dir="auto"
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="mt-5 flex w-full flex-col gap-2 max-w-md"
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel  dir="auto" className="text-foreground/80">
                  {t("firstName")}
                </FormLabel>
                <FormControl>
                  <Input  dir="auto"{...field} />
                </FormControl>
                <FormMessage  dir="auto"/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel  dir="auto" className="text-foreground/80">
                  {t("lastName")}
                </FormLabel>
                <FormControl>
                  <Input  dir="auto" {...field} />
                </FormControl>
                <FormMessage  dir="auto"/>
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
                <Input  dir="auto"{...field} />
                </FormControl>
                <FormMessage  dir="auto"/>
              </FormItem>
            )}
          />
          <div dir="auto">
            <CountrySelect
              control={form.control}
              name="country"
              label={t("country")}
              placeholder={t("countryPlaceholder")}
              required
              className="mb-4"
            />
          </div>
          <FormField
            control={form.control}
            name="addressLine"
            render={({ field }) => (
              <FormItem>
                <FormLabel dir="auto" className="text-foreground/80">
                  {t("addressLine")}
                </FormLabel>
                <FormControl>
                  <Input dir="auto" {...field} />
                </FormControl>
                <FormMessage  dir="auto"/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel dir="auto" className="text-foreground/80">{t("city")}</FormLabel>
                <FormControl>
                  <Input dir="auto" {...field} />
                </FormControl>
                <FormMessage  dir="auto"/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel dir="auto" className="text-foreground/80">{t("state")}</FormLabel>
                <FormControl>
                  <Input dir="auto" {...field} />
                </FormControl>
                <FormMessage  dir="auto"/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel dir="auto" className="text-foreground/80">
                  {t("zipCode")}
                </FormLabel>
                <FormControl>
                  <Input dir="auto" {...field} />
                </FormControl>
                <FormMessage  dir="auto"/>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full mt-1" disabled={isLoading}>
            {isLoading ? t("submit.processing") : t("submit.continue")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
