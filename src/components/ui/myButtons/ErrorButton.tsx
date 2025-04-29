import React from "react";
import { Button } from "../button";
import { useTranslations } from "next-intl";

type Props = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function ErrorButton({ onClick }: Props) {
  const t = useTranslations('components.error')
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <p className="text-destructive">{t("message")}</p>
      <Button onClick={onClick} variant={"secondary"}>
        {t("refetchButton")}
      </Button>
    </div>
  );
}
