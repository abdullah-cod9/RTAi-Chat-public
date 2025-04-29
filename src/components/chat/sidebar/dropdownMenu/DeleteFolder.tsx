import { Chat, deleteFolder } from "@/app/actions/db/actions";
import { Button } from "@/components/ui/button";
import AlertDialogButton from "@/components/ui/myButtons/AlertDialogButton";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { JournalX } from "react-bootstrap-icons";
import { toast } from "sonner";

type Props = {
  chats: Chat[];
  folderId: string;
  folderName: string;
  publicId: string;
  userId: string;
};

export default function DeleteFolder({
  folderId,
  chats,
  folderName,
  publicId,
  userId
}: Props) {
  const t = useTranslations("Chat.sidebar.content.dropdownMenu.deleteFolder");

  const [isPending, setIsPending] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const handleOnAction = async () => {
    setIsPending(true);
    await deleteFolder(
      userId,
      folderId,
      chats.filter((c) => c.type === "private").map((c) => c.id),
      chats.filter((c) => c.type === "public").map((c) => c.id),
      publicId,
    );

    await queryClient.invalidateQueries({
      queryKey: [`getFoldersAndChats`],
    });
    toast.success("Folder deleted successfully.");
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
    title={t("title", { folderName })}
    description={
      <>
        {t("description.m1")}{" "}
        <span className="text-yellow-500">{folderName}</span>{" "}
        {t("description.m2")}{" "}
        <span className="text-blue-500">{chats.length}</span>{" "}
        {t("description.m3")}
        {/* {chats.length > 1 ? "s" : ""}{" "} */}
        {t("description.m4")}
      </>
    }
    action={
      <Button
        variant={"destructive"}
        className="bg-destructive text-destructive-foreground shadow-sm sm:hover:bg-destructive/90"
        onClick={handleOnAction}
      >
        <span>{t("confirm")}</span>
      </Button>
    }
  />
  );
}
