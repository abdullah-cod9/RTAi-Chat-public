import { Button } from "@/components/ui/button";
import ComboBoxResponsive from "@/components/ui/myButtons/ComboBoxResponsive";
import { Quality } from "@/models/utils";
import { Plans } from "@/subscription";
import { Gauge } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useCallback, useState } from "react";

type Props = {
  onSelectImageQuality: (effort: Quality) => void;
  selectQuality: Quality;
  subscriptionType: Plans;
};
type SelectQuality = {
  value: Quality;
  label: string;
};
const SQ: SelectQuality[] = [
  {
    value: "low",
    label: "Low",
  },
  {
    value: "medium",
    label: "Medium",
  },
  {
    value: "high",
    label: "High",
  },
];
export default function SelectImageQuality({
  onSelectImageQuality,
  selectQuality,
  subscriptionType,
}: Props) {
  const t = useTranslations("Chat.chatUi.header.footer.selectImageQuality");
  const [open, setOpen] = useState(false);
  const handleOpenDialogButton = useCallback((e: boolean) => {
    setOpen(e);
  }, []);
  const handleTriggerOpenDialog = useCallback(() => {
    handleOpenDialogButton(true);
  }, [handleOpenDialogButton]);
  const handleClickEffort = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(false);
      onSelectImageQuality(e.currentTarget.value as Quality);
    },

    [onSelectImageQuality],
  );  
  return (
    <ComboBoxResponsive
      title={t("title")}
      side="top"
      trigger={
        <Button
          onClick={handleTriggerOpenDialog}
          variant={"outline"}
          className="border-0 shadow-md md:h-9 md:w-fit md:px-4 md:py-2"
          size={"icon"}
        >
          <Gauge className="md:hidden" />
          <span className="hidden md:flex">
            {t("quality", { quality: selectQuality })}
          </span>
        </Button>
      }
      onOpen={handleOpenDialogButton}
      openValue={open}
    >
      <div className="flex w-full flex-col items-start justify-center gap-2 py-1">
        {SQ.map((e) => (
          <Button
            onClick={handleClickEffort}
            key={e.value}
            value={e.value}
            variant={"outline"}
            size={"lg"}
            dir="auto"
            data-selected={e.value === selectQuality}
            data-state={e.value}
            disabled={subscriptionType === "free" && e.value !== "low"}
            className="flex w-full items-center justify-between border-0 px-2 data-[selected=true]:bg-muted"
          >
            <span>{t("quality", { quality: e.value })}</span>
          </Button>
        ))}
      </div>
    </ComboBoxResponsive>
  );
}
