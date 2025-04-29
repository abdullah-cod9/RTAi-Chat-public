import { Button } from "@/components/ui/button";
import ComboBoxResponsive from "@/components/ui/myButtons/ComboBoxResponsive";
import { Dimensions } from "@/models/utils";
import { Plans } from "@/subscription";
import { Frame } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useCallback, useState } from "react";

type Props = {
  onSelectDimensions: (effort: Dimensions) => void;
  selectDimensions: Dimensions;
  subscriptionType: Plans;
};
type selectDimensions = {
  value: Dimensions;
  label: string;
};
const reasoningEffort: selectDimensions[] = [
  {
    value: "1024x1024",
    label: "1024x1024",
  },
  {
    value: "1024x1536",
    label: "1024x1536",
  },
  {
    value: "1536x1024",
    label: "1536x1024 ",
  },
];
export default function SelectImageDimensions({
  onSelectDimensions,
  selectDimensions,
  subscriptionType,
}: Props) {
  const t = useTranslations("Chat.chatUi.header.footer.selectImageDimensions");
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
      onSelectDimensions(e.currentTarget.value as Dimensions);
    },

    [onSelectDimensions],
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
          <Frame className="md:hidden" />
          <span className="hidden md:flex">{selectDimensions}</span>
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
            disabled={subscriptionType === "free" && e.value !== "1024x1024"}
            data-selected={e.value === selectDimensions}
            data-state={e.value}
            className="flex w-full items-center justify-between border-0 px-2 data-[selected=true]:bg-muted"
          >
            <span>{e.value}</span>
          </Button>
        ))}
      </div>
    </ComboBoxResponsive>
  );
}
