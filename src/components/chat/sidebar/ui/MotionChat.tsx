import { Chat, Plan } from "@/app/actions/db/actions";
import { Button } from "@/components/ui/button";
import { cn, isMob } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, { memo, useCallback, useRef, useState } from "react";
import { People } from "react-bootstrap-icons";
import LinkChat from "./LinkChat";
import SidebarDropdownMenu from "@/components/chat/sidebar/dropdownMenu/DropdownMenu";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { SettingOption } from "../../settings/Settings";
import { useLocalStorage } from "usehooks-ts";
import { useSidebar } from "@/components/ui/sidebar";

type Props = {
  data: Chat;
  publicId: string;
  plan: Plan;
  pathname: string;
  userId: string;
  is_anonymous: boolean;
};

export default memo(function MotionChat({
  pathname,
  data,
  plan,
  publicId,
  userId,
  is_anonymous,
}: Props) {
  const [openSetting, setOpenSetting] = useQueryState(
    "setting",
    parseAsStringEnum<SettingOption>(Object.values(SettingOption)),
  );
  const [isHover, setIsHover] = useState<boolean>(false);
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const [openDropdownMenu, setOpenDropdownMenu] = useState<boolean>(false);
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const [, setSidebarState] = useLocalStorage<boolean>("sidebarState", true);
  const { setOpenMobile } = useSidebar();
  const handleLink = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if ("type" in data && pathname === `/chat/${data.id}`) {
        return e.preventDefault();
      }
      if (isMob()) {
        setSidebarState(false);
        setOpenMobile(false);
      }
    },
    [data, pathname, setOpenMobile, setSidebarState],
  );
  const handleHoverStart = useCallback(() => {
    setIsHover(true);
  }, []);
  const handleHoverEnd = useCallback(() => {
    if (!openDropdownMenu) {
      setIsHover(false);
    }
  }, [openDropdownMenu]);
  const handleOpenDropdownMenu = useCallback((v: boolean) => {
    setOpenDropdownMenu(v);
    if (!v) {
      setIsHover(false);
    }
  }, []);
  const handleDragStart = useCallback(() => {
    setIsDrag(true);
  }, []);
  const handleDragEnd = useCallback(() => {
    setIsDrag(false);
  }, []);
  const handleOpenSetting = useCallback(() => {
    if (openSetting) {
      setOpenSetting(null);
    }
  }, [openSetting, setOpenSetting]);
  return (
    <motion.div
      className="relative flex h-9 w-full cursor-default items-center"
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      draggable
      onClick={handleOpenSetting}
      title={data.name}
    >
      <LinkChat
        data={data}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        ref={linkRef}
        onClick={handleLink}
        className={cn(
          "flex h-9 w-full cursor-default items-center justify-start gap-3 rounded-sm p-2 hover:bg-muted [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:cursor-default",
          isDrag && "bg-[#0b111f]",
        )}
      />
      <AnimatePresence>
        {isMob() ? (
          <div className="absolute right-1 ">
            {data.type === "public" && (
              <Button size={"sm"} variant={"ghost"} className="text-green-600">
                <People />
              </Button>
            )}
            <SidebarDropdownMenu
              userId={userId}
              data={data}
              onOpen={handleOpenDropdownMenu}
              openValue={openDropdownMenu}
              plan={plan}
              publicId={publicId}
              is_anonymous={is_anonymous}
            />
          </div>
        ) : isHover ? (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                duration: 0.8,

                ease: [0, 0.71, 0.2, 1.01],
              },
            }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-1"
          >
            <SidebarDropdownMenu
              userId={userId}
              data={data}
              onOpen={handleOpenDropdownMenu}
              openValue={openDropdownMenu}
              plan={plan}
              publicId={publicId}
              is_anonymous={is_anonymous}
            />
          </motion.div>
        ) : (
          data.type === "public" && (
            <div className="absolute right-1">
              <Button size={"sm"} variant={"ghost"} className="text-green-600">
                <People />
              </Button>
            </div>
          )
        )}
      </AnimatePresence>
    </motion.div>
  );
});
