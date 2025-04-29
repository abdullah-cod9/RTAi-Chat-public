import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { Plan } from "@/app/actions/db/actions";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { revalidate } from "@/app/actions/other/action";

type Props = {
  plan: Plan;
};

export default function Subscription({ plan }: Props) {
  const t = useTranslations("Chat.settings.Subscription");
  const router = useRouter()
  const handleRenewalSubscription = async () => {
    router.prefetch('/checkout')
    const response = await fetch("/api/payments/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscriptionId: plan.subscriptionId,
      }),
    });
    if (!response.ok) {
      throw new Error("cancel link creation failed");
    }
    await response.json();
    router.push('/checkout')
  };
  const handleStopRenewalSubscription = async () => {
    const response = await fetch("/api/payments/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscriptionId: plan.subscriptionId,
      }),
    });
    if (!response.ok) {
      throw new Error("paused link creation failed");
    }
    await response.json();
    await revalidate()
  };

  return (
    <div className="mt-5 flex w-full justify-center">
      <div dir="auto" className="flex w-full flex-col gap-8">
        {/* الخطة الأولى */}
        <div className="flex w-full items-center justify-between px-10">
          <h2>{t("pricing.plusPlan.title")}</h2>
          <h2 className="text-primary">
            {t("pricing.plusPlan.price")}
            <span className="text-sm text-foreground/80">
              {t("pricing.plusPlan.perMonth")}
            </span>
          </h2>
        </div>
        <div className="w-full">
          <ul className="flex w-full list-none flex-wrap justify-center gap-4">
            <li className="max-w-72 rounded-lg border border-primary bg-gradient-to-r from-primary/50 via-primary/30 to-primary/10 p-2 shadow-lg transition-all duration-300 hover:scale-105 hover:from-primary/80 hover:via-primary/50 hover:to-primary/30">
              <span className="font-medium">
                {t("pricing.plusPlan.features.messages.title")}
              </span>
              <span className="block text-sm">
                {t("pricing.plusPlan.features.messages.description")}
              </span>
            </li>
            <li className="max-w-72 rounded-lg border border-primary bg-gradient-to-r from-primary/50 via-primary/30 to-primary/10 p-2 shadow-lg transition-all duration-300 hover:scale-105 hover:from-primary/80 hover:via-primary/50 hover:to-primary/30">
              <span className="font-medium">
                {" "}
                {t("pricing.plusPlan.features.models.title")}
              </span>
              <span className="block text-sm">
                {t("pricing.plusPlan.features.models.description")}
              </span>
            </li>

            <li className="max-w-72 rounded-lg border border-primary bg-gradient-to-r from-primary/50 via-primary/30 to-primary/10 p-2 shadow-lg transition-all duration-300 hover:scale-105 hover:from-primary/80 hover:via-primary/50 hover:to-primary/30">
              <span className="font-medium">
                {t("pricing.plusPlan.features.realtime.title")}
              </span>
              <span className="block text-sm">
                {t("pricing.plusPlan.features.realtime.description")}
              </span>
            </li>
            <li className="max-w-72 rounded-lg border border-primary bg-gradient-to-r from-primary/50 via-primary/30 to-primary/10 p-2 shadow-lg transition-all duration-300 hover:scale-105 hover:from-primary/80 hover:via-primary/50 hover:to-primary/30">
              <span className="font-medium">
                {t("pricing.plusPlan.features.attachments.title")}
              </span>
              <span className="block text-sm">
                {t("pricing.plusPlan.features.attachments.description")}
              </span>
            </li>
            <li className="max-w-72 rounded-lg border border-primary bg-gradient-to-r from-primary/50 via-primary/30 to-primary/10 p-2 shadow-lg transition-all duration-300 hover:scale-105 hover:from-primary/80 hover:via-primary/50 hover:to-primary/30">
              <span className="font-medium">
                {" "}
                {t("pricing.plusPlan.features.support.title")}
              </span>
              <span className="block text-sm">
                {t("pricing.plusPlan.features.support.description")}
              </span>
            </li>
          </ul>
        </div>
        <div className="flex w-full items-center justify-center">
          {plan.subscriptionType !== "plus" ? (
            <Link prefetch href={"/checkout"}>
              <Button
                size={"lg"}
                className="border border-primary bg-primary/80 transition-all duration-300 hover:scale-105"
              >
                {t("pricing.plusPlan.cta.upgradeNow")}
              </Button>
            </Link>
          ) : (
            <div className="flex gap-3">
              <Button
               
                className="transition-all duration-300 hover:scale-105"
                onClick={handleStopRenewalSubscription}
                variant={"secondary"}
                disabled={!plan.featuresPlan.autoRenew}
              >
                {t("pricing.plusPlan.cta.stop_auto_renewal")}
              </Button>
              <Button
               
                className="transition-all duration-300 hover:scale-105"
                onClick={handleRenewalSubscription}
                variant={"secondary"}
              >
                {t("pricing.plusPlan.cta.renewal_now")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
