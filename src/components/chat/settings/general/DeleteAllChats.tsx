import { deleteAllChats } from "@/app/actions/db/actions";
import { Button } from "@/components/ui/button";
import AlertDialogButton from "@/components/ui/myButtons/AlertDialogButton";
import React, { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { revalidate } from "@/app/actions/other/action";
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DeleteAllChats({userId}:{userId:string}) {
  const queryClient = useQueryClient();
const t = useTranslations('Chat.settings.general.DeleteAllChats')
  const [isDeleteAllChat, setIsDeleteAllChat] = useState(false);
  const handleDeleteAllChat = async () => {
    setIsDeleteAllChat(true);
    const res = await deleteAllChats(userId);

    if (res.error) {
      toast.error(res.error.message);
      setIsDeleteAllChat(false);
    } else {
      await Promise.all([revalidate(), queryClient.invalidateQueries()]);
      toast.error(t('toast_error'));
      setIsDeleteAllChat(false);
      return;
    }
  };
  return (
    <AlertDialogButton
    trigger={
      isDeleteAllChat ? (
        <Button size="icon" className="min-w-16" variant="outline">
          <Loader className="animate-spin text-primary" />
        </Button>
      ) : (
        <Button variant="destructive">{t("trigger_confirm")}</Button>
      )
    }
    title={t("confirm")}
    description={
      <>
        {t("description_1")} <br />
        <strong>{t("description_2")}</strong> {t("description_3")}
      </>
    }
    action={
      isDeleteAllChat ? (
        <Button className="animate-spin" variant="ghost">
          <Loader />
        </Button>
      ) : (
        <Button
          className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
          onClick={handleDeleteAllChat}
          variant="destructive"
        >
          {t("action_confirm")}
        </Button>
      )
    }
  />
  
  );
}
