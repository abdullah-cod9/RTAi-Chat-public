import React from "react";
import { Languages, Status } from "@/lib/consts";
import { ComboBoxResponsiveList } from "../../ui/myButtons/ComboBoxResponsiveList";
import { Button } from "../../ui/button";
import { useTranslations } from "next-intl";
type Props = {
  setSelectedStatus: (status: Status) => void;
  selectValue: Status;
};

export default function ResponseLanguage({
  setSelectedStatus,
  selectValue,
}: Props) {
  const t = useTranslations("Chat.chatSetting.responseLanguage");
  return (
    <ComboBoxResponsiveList
      i18Translations="Chat.chatSetting.responseLanguage"
      selectValue={selectValue}
      setSelectedStatus={setSelectedStatus}
      statuses={Languages}
      side="right"

      childButton={
        <Button
          variant={"ghost"}
          className="flex w-full items-center justify-between rounded-none p-3 h-fit"
          dir="auto"
        >
          <span >{t("option", { option: selectValue.value })}</span>
        </Button>
      }
      drawerTitle="Response Language"
      inputPlaceholder={t("inputPlaceholder")}
      commandEmptyTitle={t("commandEmptyTitle")}
    />
  );
}
