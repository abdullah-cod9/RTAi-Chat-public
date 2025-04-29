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
import { ChatNameSchema } from "@/zod/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { changeName } from "@/app/actions/db/actions";
import { Pencil } from "react-bootstrap-icons";
import { useTranslations } from "next-intl";
type Props = {
  folderId?: string;
  chatId?: string;
  currentName: string;
  userId: string
};

export default function Rename({
  folderId,
  chatId,
  currentName,userId
}: Props) {
  const t = useTranslations('Chat.sidebar.content.dropdownMenu.rename')
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const queryClient = useQueryClient();
  const formRef = useRef(null);
  const form = useForm<z.infer<typeof ChatNameSchema>>({
    resolver: zodResolver(ChatNameSchema),
    defaultValues: {
      chatName: currentName,
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
    if (!chatId && !folderId) return toast.error("Id is undefined");
    if (chatId) {
      const res = await changeName(userId,values, chatId, undefined);
      if (res && "error" in res) {
        setDisabled(false);
        return toast.error(res.error?.message);
      }
      await queryClient.invalidateQueries({
        queryKey: [`getFoldersAndChats`],
      });
      toast.success(t('toast_success'));
    } else if (folderId) {
      const res = await changeName(userId,values, undefined, folderId);
      if (res && "error" in res) {
        setDisabled(false);
        return toast.error(res.error?.message);
      }
      await queryClient.invalidateQueries({
        queryKey: [`getFoldersAndChats`],
      });
      toast.success(t('toast_success'));
    }
    setOpen(false);
    setDisabled(false);
  }
  // const onInvalid = (errors) => console.error(errors);

  const handleOpenTrigger = (e: boolean) => {
    setOpen(e);
  };
  return (
    <DialogButton
    title={t('title', { currentName })}
    trigger={
      <Button
        variant={"ghost"}
        size={"icon"}
        className="h-full w-full justify-start gap-3 p-2 text-start"
      >
        <Pencil />
        {t('trigger')}
      </Button>
    }
    triggerClose={<Button variant={"outline"}>{t('triggerClose')}</Button>}
    description={<></>}
    openValue={open}
    onOpenTrigger={handleOpenTrigger}
  >
    <Form {...form}>
      <form
      dir="auto"
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid items-start gap-4"
      >
        <FormField
          control={form.control}
          name="chatName"
          render={({ field }) => (
            <FormItem className="grid">
              <FormLabel className="ml-1 text-foreground/80">{t('description.nameLabel')}</FormLabel>
              <FormControl className="text-ellipsis">
                <Input dir="auto" placeholder={""} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={disabled} type="submit">
          {t('description.changeButton')}
        </Button>
      </form>
    </Form>
  </DialogButton>
  
  );
}
