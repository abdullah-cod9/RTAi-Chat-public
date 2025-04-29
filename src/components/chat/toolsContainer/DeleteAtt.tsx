import { Button } from "@/components/ui/button";
import React from "react";
import AlertDialogButton from "@/components/ui/myButtons/AlertDialogButton";
import TooltipButton from "@/components/ui/myButtons/TooltipButton";
import { LucideFileX2 } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  onAction: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

export default function DeleteAtt({ onAction, disabled }: Props) {
  const t = useTranslations('Chat.toolsContainer.deleteAttachment')
  return (
    <AlertDialogButton
  trigger={
    <TooltipButton side="top" tooltipContent={t('trigger')}>
      <Button
        disabled={disabled}
        size={"icon"}
        variant={"destructive"}
        className="h-8 w-8 sm:h-9 sm:w-9"
      >
        <LucideFileX2 />
      </Button>
    </TooltipButton>
  }
  title={t('title')}
  description={
    <>
      {t('description.m1')}
    </>
  }
  action={
    <Button
      onClick={onAction}
      className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
    >
      {t('action')}
    </Button>
  }
/>

  );
}
