import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import React, { memo } from "react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { SettingOption } from "../../settings/Settings";
import { useHotkeys } from "react-hotkeys-hook";
import { Gear } from "react-bootstrap-icons";
import { Plan, UsersDb } from "@/app/actions/db/actions";
import { useLocalStorage } from "usehooks-ts";
import { isMob } from "@/lib/utils";
import LoginNow from "../../LoginNow";

type Props = {
  userData: UsersDb;
  plan: Plan;
  is_anonymous: boolean;
};

export default memo(function FooterS({ plan, userData, is_anonymous }: Props) {
  const [openSetting, setOpenSetting] = useQueryState(
    "setting",
    parseAsStringEnum<SettingOption>(Object.values(SettingOption)),
  );
  const [, setSidebarState] = useLocalStorage<boolean>("sidebarState", true);
  const { setOpenMobile } = useSidebar();
  const handleClickSetting = async () => {
    if (!openSetting) {
      await setOpenSetting(SettingOption.general);
    } else {
      await setOpenSetting(null);
    }

    if (isMob()) {
      setSidebarState(false);
      setOpenMobile(false);
    }
  };
  useHotkeys("ctrl+shift+s", async (k) => {
    k.preventDefault();
    if (openSetting) {
      await setOpenSetting(null);
    } else {
      await setOpenSetting(SettingOption.general);
    }
  });
  return (
    <SidebarFooter className="bg-secondary dark:bg-secondary/30">
      <SidebarMenu className="flex list-none flex-col">
        {/* <SidebarMenuItem>
          <Progress value={33} />
        </SidebarMenuItem> */}
        {is_anonymous ? (
          <LoginNow />
        ) : (
          <SidebarMenuItem className="flex items-center justify-between">
            <div className="flex items-center justify-center gap-4">
              <Avatar>
                <AvatarImage
                  alt={`${userData.username}'s avatar`}
                  src={userData.avatarUrl}
                />
                {/* eslint-disable-next-line react/jsx-no-literals */}
                <AvatarFallback>RTAi</AvatarFallback>
              </Avatar>
              <p className="flex flex-col">
                <span>{userData.username}</span>
                <span className="">
                  {plan.subscriptionType.toLocaleUpperCase()}
                </span>
              </p>
            </div>
            <Button
              aria-label="Open setting"
              onClick={handleClickSetting}
              size={"icon"}
              variant={"ghost"}
            >
              <Gear />
            </Button>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarFooter>
  );
});
