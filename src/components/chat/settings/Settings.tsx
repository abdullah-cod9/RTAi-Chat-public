"use client";
import React from "react";
import { Button } from "../../ui/button";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import General from "./general/General";
import Subscription from "./subscription/Subscription";
import { Plan, UsersDb } from "@/app/actions/db/actions";
import Account from "./account/Account";
import Contact from "./contact/Contact";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslations } from "next-intl";

type Props = {
  plan: Plan;
  userData: UsersDb;
};
export enum SettingOption {
  general = "general",
  subscription = "subscription",
  account = "account",
  contactUs = "contact",
}
export default function Settings({ plan, userData }: Props) {
  const t = useTranslations('Chat.settings.Header')
  const [openSetting, setOpenSetting] = useQueryState(
    "setting",
    parseAsStringEnum<SettingOption>(Object.values(SettingOption)),
  );

  const handleSettingOption = async (value: SettingOption) => {
    await setOpenSetting(value);
  };

  return (
    <div className="relative h-svh overflow-y-auto pt-20">
      <div className="flex w-full flex-col items-center">
        <ScrollArea className="rounded-md bg-secondary p-1 text-muted-foreground shadow-md">
          <div className="no-scrollbar flex max-w-72 gap-1 overflow-x-auto sm:max-w-full">
            <Button
              onClick={() => handleSettingOption(SettingOption.general)}
              variant={"ghost"}
              className={cn(
                "p-2",
                openSetting === SettingOption.general &&
                  "!bg-background text-foreground",
              )}
            >
             {t('general')}
            </Button>
            <Button
              onClick={() => handleSettingOption(SettingOption.subscription)}
              variant={"ghost"}
              className={cn(
                "p-2",
                openSetting === SettingOption.subscription &&
                  "!bg-background text-foreground",
              )}
            >
               {t('subscription')}
            </Button>
            <Button
              onClick={() => handleSettingOption(SettingOption.account)}
              variant={"ghost"}
              className={cn(
                "p-2",
                openSetting === SettingOption.account &&
                  "!bg-background text-foreground",
              )}
            >
              {t('account')}
            </Button>
            <Button
              onClick={() => handleSettingOption(SettingOption.contactUs)}
              variant={"ghost"}
              className={cn(
                "p-2",
                openSetting === SettingOption.contactUs &&
                  "!bg-background text-foreground",
              )}
            >
               {t('contact')}
            </Button>
          </div>
        </ScrollArea>

        <div className="flex w-full max-w-screen-md flex-col p-4">
          {openSetting === SettingOption.general && <General userId={userData.userId} plan={plan} />}
          {openSetting === SettingOption.subscription && (
            <Subscription plan={plan} />
          )}
          {openSetting === SettingOption.account && (
            <Account
            {...userData}
              email={userData.email as string}
            />
          )}
          {openSetting === SettingOption.contactUs && <Contact {...userData} />}
        </div>
      </div>
    </div>
  );
}
