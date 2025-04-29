"use client";
import { addFriend } from "@/app/actions/db/actions";
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
import DialogButton from "@/components/ui/myButtons/DialogButton";
import { addFriendSchema } from "@/zod/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import React, { useRef } from "react";
import { PersonPlus } from "react-bootstrap-icons";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  userId: string;
  chatId: string;
  role: "admin" | "user" | null;
  maxGroupMembers: number
  publicId:string
};

export default function AddFriend({
  userId,
  chatId,
  role,
  maxGroupMembers,
  publicId
}: Props) {
  const t = useTranslations('Chat.sidebar.content.dropdownMenu.addFriend')
  const queryClient = useQueryClient();

  const formRef = useRef(null);
  const form = useForm<z.infer<typeof addFriendSchema>>({
    resolver: zodResolver(addFriendSchema),
    defaultValues: {
      userId: "",
    },
  });
  async function onSubmit(values: z.infer<typeof addFriendSchema>) {
    const result = addFriendSchema.safeParse(values);
    if (!result.success) {
      toast.error(result.error.flatten().fieldErrors.userId);
      return;
    }

    const res = await addFriend(
      userId,
      values,
      chatId,
      publicId,
      maxGroupMembers
    );
    if (res?.error) {
      toast.error(res.error.message);
      return;
    }
    if (res.success) {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [`GroupMembers-${chatId}`],
        }),
        queryClient.invalidateQueries({
          queryKey: [`getFoldersAndChats`],
        }),
      ]);
      toast.success(res.success.message);

      form.reset();
    }
  }
  // const onInvalid = (errors) => console.error(errors);

  return (
    <DialogButton
  title={t("title")}
  trigger={
    <Button
      variant={"ghost"}
      size={"icon"}
      className="h-fit w-full justify-start gap-3 p-2 text-start"
    >
      <PersonPlus />
      <span>{t("trigger")}</span>
    </Button>
  }
  triggerClose={<Button variant={"outline"}>{t("close")}</Button>}
  description={
    <>
      {t("description")}
      {role === "user" && (
        <>
          <br />
          <span className="text-destructive">{t("onlyAdminNote")}</span>
        </>
      )}
    </>
  }
  className="px-4"
>
  <Form {...form}>
    <form dir="auto"
      ref={formRef}
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid items-start gap-4"
    >
      <FormField
        control={form.control}
        name="userId"
        render={({ field }) => (
          <FormItem className="grid">
            <FormLabel className="ml-1 text-foreground/80">
              {t("form.label")}
            </FormLabel>
            <FormControl className="text-ellipsis">
              <Input dir="auto"
                placeholder={t("form.placeholder")}
                {...field}
                autoComplete="off"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        disabled={role === "user" || form.formState.isSubmitting}
        type="submit"
      >
        {t("form.submit")}
      </Button>
    </form>
  </Form>
</DialogButton>

  );
}
