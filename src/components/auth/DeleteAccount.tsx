import React, { useState } from "react";
import { Button } from "../ui/button";
import AlertDialogButton from "../ui/myButtons/AlertDialogButton";
import { deleteAccount } from "@/app/actions/db/actions";
import { useQueryClient } from "@tanstack/react-query";
import { revalidate } from "@/app/actions/other/action";
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DeleteAccount({userId}:{userId:string}) {
  const queryClient = useQueryClient();
  const t = useTranslations("Auth.DeleteAccount");
  const [isTrigger, setIsTrigger] = useState(false);
  const handleDeleteAccount = async () => {
    setIsTrigger(true);
    const res = await deleteAccount(userId);
    if (res.error) {
      setIsTrigger(false);
    } else {
      await Promise.all([revalidate(), queryClient.invalidateQueries()]);
      setIsTrigger(false);
      return;
    }
  };
  return (
    <AlertDialogButton
      trigger={
        isTrigger ? (
          <Button size={"icon"} className="min-w-16" variant={"outline"}>
            <Loader className="animate-spin text-primary" />
          </Button>
        ) : (
          <Button variant={"destructive"}>{t("title")}</Button>
        )
      }
      title={t("dialogTitle")}
      description={
        <>
          {t("description.m1")}
          <br />
          <strong>{t("description.m2")}</strong>
          <br />
          <strong>{t("description.m3")}</strong> {t("description.m4")} <br />
          {t("description.m5")} <br />
          {t("description.m6")} <br />
          {t("description.m7")}
        </>
      }

      
      action={
        isTrigger ? (
          <Button className="animate-spin" variant={"ghost"}>
            <Loader />
          </Button>
        ) : (
          <Button
            className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
            onClick={handleDeleteAccount}
            variant={"destructive"}
          >
            {t("action")}
          </Button>
        )
      }
    />
  );
}
