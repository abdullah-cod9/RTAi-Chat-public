import React from "react";
import { Button } from "../ui/button";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { SettingOption } from "./settings/Settings";
import LoginNow from "./LoginNow";
import { useTranslations } from "next-intl";

export default function UpgradeNow({is_anonymous}: {is_anonymous:boolean}) {
  const t = useTranslations('Auth.UpgradeNow')
  const [, setOpenSetting] = useQueryState(
    "setting",
    parseAsStringEnum<SettingOption>(Object.values(SettingOption)),
  );
  const handleClick = () => {
    setOpenSetting(SettingOption.subscription);
  };
  if (is_anonymous) {
    return <LoginNow />;
  }
  return (
    <div className="mx-2 mt-3 flex justify-center">
    <div className="relative h-32 md:h-40 min-w-56 w-full max-w-80">
      <div className="absolute inset-0 flex flex-col justify-between gap-2 rounded-xl border border-primary bg-gradient-to-r from-primary/30 via-primary/20 to-primary/10 p-3 shadow-lg backdrop-blur-sm">
        <p className="font-semibold">
          {t('message')}
        </p>
        <Button
          onClick={handleClick}
          className="sm:text-md ml-auto rounded-full bg-primary px-4 py-1 text-sm shadow-md hover:bg-primary/90"
        >
          {t('button')}
        </Button>
      </div>
    </div>
  </div>
  
  );
}
