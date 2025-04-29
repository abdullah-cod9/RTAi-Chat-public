/* eslint-disable react/jsx-no-literals */
import LocaleSwitcherSelect from "@/components/i18n/LocaleSwitcherSelect";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { useTranslations } from "next-intl";
import React from "react";
import DeleteAllChats from "./DeleteAllChats";
import LogOut from "@/components/auth/LogOut";
import { Plan } from "@/app/actions/db/actions";
import RemainingCredits from "../subscription/RemainingCredits";

type Props = {
  plan: Plan;
  userId:string
};

export default function General({ plan, userId }: Props) {
  const t = useTranslations("Chat.settings.general");

  return (
    <div className="flex flex-col justify-between gap-7">
      <div dir="auto" className="mt-5 flex w-full flex-col gap-8">
        <div className="flex w-full items-center justify-between">
          <p>{t("theme.title")}</p>
          <ModeToggle />
        </div>
        <div className="flex w-full items-center justify-between">
          <p>{t("language.title")}</p>
          <LocaleSwitcherSelect />
        </div>
        <div className="flex w-full items-center justify-between">
          <p>{t("DeleteAllChats.title")}</p>
          <DeleteAllChats userId={userId} />
        </div>
        <div className="flex w-full items-center justify-between">
          <p>{t("LogOut.title")}</p>
          <LogOut />
        </div>
      </div>{" "}
      <div className="space-y-10">
        <div dir="auto" className="flex h-fit w-full flex-col items-start rounded-md bg-muted/50 p-3 pb-4 shadow-md">
          <h4>{t("tokens.title")}</h4>
          <p className="text-xs text-gray-500">
            {t("tokens.expires", {
              date: new Date(plan.expiresAt).toLocaleDateString(
                "en-GB",
              ),
            })}
          </p>
          <div className="my-5 border-t" />
          <RemainingCredits userId={userId}/>
          {plan.subscriptionType === "free" && (
            <span  className="mt-3 text-sm">{t('tokens.resets')}</span>
          )}
        </div>
        
        <div dir="auto" className="hidden h-fit w-full flex-col items-start gap-5 rounded-md bg-muted/50 p-3 text-muted-foreground lg:flex">
          <span className="text-sm font-semibold">{t('shortcuts.title')}</span>
          <div className="flex w-full items-center justify-between">
            <span className="text-sm font-medium">{t('shortcuts.search')}</span>
            <div className="flex gap-1">
              
              <kbd className="rounded bg-background px-2 py-1 text-sm">
                
                Ctrl
              </kbd>
              <kbd className="rounded bg-background px-2 py-1 text-sm">K</kbd>
            </div>
          </div>
          <div className="flex w-full items-center justify-between">
            <span className="text-sm font-medium">{t('shortcuts.toggleSidebar')}</span>
            <div className="flex gap-1">
              <kbd className="rounded bg-background px-2 py-1 text-sm">
                Ctrl
              </kbd>

              <kbd className="rounded bg-background px-2 py-1 text-sm">B</kbd>
            </div>
          </div>
          <div className="flex w-full items-center justify-between">
            <span className="text-sm font-medium">{t('shortcuts.newChat')}</span>
            <div className="flex gap-1">
              <kbd className="rounded bg-background px-2 py-1 text-sm">
                Ctrl
              </kbd>
              <kbd className="rounded bg-background px-2 py-1 text-sm">
                Shift
              </kbd>
              <kbd className="rounded bg-background px-2 py-1 text-sm">O</kbd>
            </div>
          </div>

          <div className="flex w-full items-center justify-between">
            <span className="text-sm font-medium">{t('shortcuts.toggleSetting')}</span>
            <div className="flex gap-1">
              <kbd className="rounded bg-background px-2 py-1 text-sm">
                Ctrl
              </kbd>

              <kbd className="rounded bg-background px-2 py-1 text-sm">
                Shift
              </kbd>
              <kbd className="rounded bg-background px-2 py-1 text-sm">S</kbd>
            </div>
          </div>
          <div className="flex w-full items-center justify-between">
            <span className="text-sm font-medium">{t('shortcuts.userId')}</span>
            <div className="flex gap-1">
              <kbd className="rounded bg-background px-2 py-1 text-sm">
                Ctrl
              </kbd>

              
              <kbd className="rounded bg-background px-2 py-1 text-sm">
                Shift
              </kbd>
              <kbd className="rounded bg-background px-2 py-1 text-sm">D</kbd>
            </div>
          </div>
        </div>
        <div
          dir="auto"
          className="mt-5 w-full px-4 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        ></div>
      </div>
    </div>
  );
}
