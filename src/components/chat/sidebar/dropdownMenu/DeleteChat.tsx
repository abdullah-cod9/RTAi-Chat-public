import { deleteChat } from "@/app/actions/db/actions";
import { Button } from "@/components/ui/button";
import AlertDialogButton from "@/components/ui/myButtons/AlertDialogButton";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { JournalX } from "react-bootstrap-icons";
import { toast } from "sonner";

type Props = {
  chatName: string;
  chatId: string;
  publicId: string;
  userId: string;
};

export default function DeleteChat({
  chatName,
  chatId,
  publicId,
  userId,
}: Props) {
  const t = useTranslations("Chat.sidebar.content.dropdownMenu.deleteChat");
  const [isPending, setIsPending] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const handleOnAction = async () => {
    setIsPending(true);
    const res = await deleteChat(userId,publicId, chatId);
    if (res.success) {
      await queryClient.invalidateQueries({
        queryKey: [`getFoldersAndChats`],
      });
      toast.success(res.success.message);
    } else {
      await queryClient.invalidateQueries({
        queryKey: [`getFoldersAndChats`],
      });
    }
    setIsPending(false);
  };
  return (
    <AlertDialogButton
    trigger={
      <Button
        variant={"ghost"}
        size={"icon"}
        className="hover:text-text-red-600 h-fit w-full justify-start gap-3 p-2 text-start text-red-600 hover:bg-destructive/30"
        disabled={isPending}
      >
        <JournalX />
        <span>{t("trigger")}</span>
      </Button>
    }
    title={t("title", { chatName })}
    description={
      <>
          {t("description.m1")}
          <span className="text-blue-500">{chatName}</span>{t("description.m2")}
        </>
    }
    action={
      <Button
        variant={"destructive"}
        className="bg-destructive hover:bg-destructive"
        onClick={handleOnAction}
      >
        <span>{t("confirm")}</span>
      </Button>
    }
  />
  
  );
}
