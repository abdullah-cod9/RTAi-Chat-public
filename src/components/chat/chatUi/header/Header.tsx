import { Button } from "@/components/ui/button";
import TooltipButton from "@/components/ui/myButtons/TooltipButton";
import { CornerDownLeft, PencilLine } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { memo } from "react";

type Props = {
  onOptimizePrompt?: React.MouseEventHandler<HTMLButtonElement>;
  disabledOptimizePrompt?: boolean;
  onPasteLastMessage?: React.MouseEventHandler<HTMLButtonElement>;
  disabledPasteLastMessage?: boolean;
};

export default memo(function Header({
  onOptimizePrompt,
  onPasteLastMessage,
  disabledOptimizePrompt,
  disabledPasteLastMessage,
}: Props) {
  const t = useTranslations("Chat.chatUi.header.header");
  return (
    <div className="flex justify-end gap-2">
      <TooltipButton side="top" tooltipContent={t("tooltips.optimizeMessage")}>
        <Button
          size={"icon"}
          aria-label={t("tooltips.optimizeMessage")}
          variant={"secondary"}
          onClick={onOptimizePrompt}
          disabled={disabledOptimizePrompt}
          className="shadow-md"
        >
          <PencilLine />
        </Button>
      </TooltipButton>
      <TooltipButton side="top" tooltipContent={t("tooltips.pasteLastMessage")}>
        <Button
          size={"icon"}
          aria-label={t("tooltips.pasteLastMessage")}
          variant={"secondary"}
          onClick={onPasteLastMessage}
          disabled={disabledPasteLastMessage}
          className="shadow-md"
        >
          <CornerDownLeft />
        </Button>
      </TooltipButton>
    </div>
  );
});
