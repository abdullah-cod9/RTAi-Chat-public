import { Button } from "@/components/ui/button";
import ComboBoxResponsive from "@/components/ui/myButtons/ComboBoxResponsive";
import { Gauge } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useCallback, useState } from "react";

type Props = {
  onReasoningEffort: (effort: ReasoningEffortType) => void;
  selectedEffort: ReasoningEffortType;
};
export type ReasoningEffortType = "low" | "medium" | "high";
type ReasoningEffort = {
  value: ReasoningEffortType;
  label: string;
};
const reasoningEffort: ReasoningEffort[] = [
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
export default function ReasoningEffort({
  onReasoningEffort,
  selectedEffort,
}: Props) {
  const t = useTranslations("Chat.chatUi.header.reasoningEffort");
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
      onReasoningEffort(e.currentTarget.value as ReasoningEffortType);
    },

    [onReasoningEffort],
  );
  return (
    <ComboBoxResponsive
      title={t("title")}
      side="top"
      trigger={
        <Button
          onClick={handleTriggerOpenDialog}
          variant={"outline"}
          className="border-0 shadow-md md:h-9 md:px-4 md:w-fit md:py-2" size={'icon'}
        >
          <Gauge className="md:hidden"/>
          <span className="hidden md:flex">{t("effort", { effort: selectedEffort })}</span>
        </Button>
      }
      onOpen={handleOpenDialogButton}
      openValue={open}
    >
      <div className="flex w-full flex-col items-start justify-center gap-2 py-1">
        {reasoningEffort.map((e) => (
          <Button
            onClick={handleClickEffort}
            key={e.value}
            value={e.value}
            variant={"outline"}
            size={"lg"}
            dir="auto"
            data-selected={e.value === selectedEffort}
            data-state={e.value}
            className="flex w-full items-center justify-between border-0 px-2 data-[selected=true]:bg-muted"
          >
            <span>{t("effort", { effort: e.value })}</span>
          </Button>
        ))}
      </div>
    </ComboBoxResponsive>
  );
}
