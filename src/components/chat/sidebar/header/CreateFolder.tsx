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
import { cn } from "@/lib/utils";
import { ChatNameSchema } from "@/zod/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import { z } from "zod";
import { createFolder } from "@/app/actions/db/actions";
import { FolderPlus } from "lucide-react";
import { useTranslations } from "next-intl";



export default function CreateFolder({userId}:{userId:string}) {
  const t = useTranslations('Chat.sidebar.header.createFolder')
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const queryClient = useQueryClient();
  const formRef = useRef(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
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

    const res = await createFolder(userId,values);
    if (res && "error" in res) {
      setDisabled(false);
      return toast.error(res.error.message);
    }
    await queryClient.invalidateQueries({
      queryKey: [`getFoldersAndChats`],
    });
    setOpen(false);
    setDisabled(false);
  }
  // const onInvalid = (errors) => console.error(errors);
  // const handleUserClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   if (e.shiftKey) {
  //     e.preventDefault();
  //     form.handleSubmit(onSubmit)();
  //   }
  // };
  const handleOpenTrigger = (e: boolean) => {
    setOpen(e);
  };
  return (
    <DialogButton
  title={t('title')}
  className={cn("px-2", isDesktop && "")}
  trigger={
    <TooltipButton tooltipContent={t('trigger')}>
      <Button size={"icon"} variant={"ghost"} className="[&_svg]:size-5">
        <FolderPlus />
      </Button>
    </TooltipButton>
  }
  triggerClose={<Button variant={"outline"}>{t('triggerClose')}</Button>}
  description={<></>}
  openValue={open}
  onOpenTrigger={handleOpenTrigger}
>
  <Form {...form}>
    <form
      ref={formRef}
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid items-start gap-4"
    >
      <FormField
        control={form.control}
        name="chatName"
        render={({ field }) => (
          <FormItem className="grid">
            <FormLabel className="ml-1 text-foreground/80">{t('description.folderNameLabel')}</FormLabel>
            <FormControl className="text-ellipsis">
              <Input placeholder={t('description.placeholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button disabled={disabled} type="submit">
        {t('description.createButton')}
      </Button>
    </form>
  </Form>
</DialogButton>

  );
}
