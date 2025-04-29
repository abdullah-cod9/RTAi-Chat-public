import { newChat } from "@/app/actions/db/actions";
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
import TooltipButton from "@/components/ui/myButtons/TooltipButton";
import { ChatNameSchema } from "@/zod/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useHotkeys } from "react-hotkeys-hook";
import { LucideMessageSquarePlus } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  folderId: string | undefined;
  folderName: string | undefined;
  userId: string 
};

export default function CreateChat({ folderId, folderName, userId }: Props) {
  const t = useTranslations("Chat.sidebar.content.dropdownMenu.createNewChat");
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const queryClient = useQueryClient();
  const formRef = useRef(null);
  const form = useForm<z.infer<typeof ChatNameSchema>>({
    resolver: zodResolver(ChatNameSchema),
    defaultValues: {
      chatName: "New Chat",
    },
  });
  async function onSubmit(values: z.infer<typeof ChatNameSchema>) {
    setDisabled(true);
    const result = ChatNameSchema.safeParse(values);
    if (!result.success) {
      toast.error(result.error.flatten().fieldErrors.chatName);
      setDisabled(false);
      return;
    }

    const res = await newChat(userId,values, folderId);
    if ("error" in res && res.error) {
      setDisabled(false);
      toast.error(res.error.message);
      return;
    }
    await queryClient.invalidateQueries({
      queryKey: [`getFoldersAndChats`],
    });
    setDisabled(false);
  }
  // const onInvalid = (errors) => console.error(errors);
  useHotkeys("shift+ctrl+o", (k) => {
    k.preventDefault();
    form.handleSubmit(onSubmit)();
  });

  const handleOpenTrigger = (e: boolean) => {
    setOpen(e);
  };
  return (
    <DialogButton
      title={t("title")}
      trigger={
        folderId ? (
          <Button
            variant={"ghost"}
            size={"icon"}
            className="h-full w-full justify-start gap-3 p-2 text-start"
          >
            <LucideMessageSquarePlus />
            {t("trigger")}
          </Button>
        ) : (
          <TooltipButton tooltipContent={t("tooltip")}>
            <Button
              disabled={disabled}
              size={"icon"}
              variant={"ghost"}
              className="[&_svg]:size-5"
            >
              <LucideMessageSquarePlus />
            </Button>
          </TooltipButton>
        )
      }
      triggerClose={<Button variant={"outline"}>{t("close")}</Button>}
      description={
        <>
          {folderName && (
            <>
              {t("description")}{" "}
              {/*  eslint-disable-next-line react/jsx-no-literals */}
              <span  className="text-yellow-600">{folderName}</span>.
            </>
          )}
        </>
      }
      openValue={open}
      onOpenTrigger={handleOpenTrigger}
    >
      <Form {...form}>
        <form dir="auto"
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid items-start gap-4"
        >
          <FormField
            control={form.control}
            name="chatName"
            render={({ field }) => (
              <FormItem className="grid">
                <FormLabel className="ml-1 text-foreground/80">
                  {t("form.label")}
                </FormLabel>
                <FormControl className="text-ellipsis">
                  <Input placeholder={t("form.placeholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={disabled} type="submit">
            {t("form.submit")}
          </Button>
        </form>
      </Form>
    </DialogButton>
  );
}
