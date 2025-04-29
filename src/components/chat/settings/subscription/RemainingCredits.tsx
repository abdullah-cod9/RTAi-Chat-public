import { calculationRemainingCredits } from "@/app/actions/db/actions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import React from "react";



export default function RemainingCredits({userId}:{userId:string}) {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["calculationRemainingCredits"],
    queryFn: () => calculationRemainingCredits(userId),
  });
  const t = useTranslations('Chat.settings.general.RemainingCredits')
  return (
    <div dir="auto" className="w-full">
  {isPending ? (
    <div className="animate-pulse space-y-3 text-muted-foreground ">
      <p className="flex items-center justify-between ">
        <span>{t("creditsStatus.loading.title")}</span>
        {/* eslint-disable-next-line react/jsx-no-literals */}
        <span>100%</span>
      </p>
      <Progress title={`100%`} value={100} />
    </div>
  ) : isError ? (
    <div className="flex h-full flex-col items-center justify-center gap-5">
      <p className="text-destructive">
        {t("creditsStatus.error.message")}
      </p>
      <Button variant={"secondary"} onClick={() => refetch}>
        {t("creditsStatus.error.retry")}
      </Button>
    </div>
  ) : (
    <div className="space-y-3">
      <p className="flex items-center justify-between">
        <span>{t("creditsStatus.success.title")}</span>
        {/* eslint-disable-next-line react/jsx-no-literals */}
        <span>{data}%</span>
      </p>
      <Progress title={`${data}%`} value={data} />
    </div>
  )}
</div>

  );
}
