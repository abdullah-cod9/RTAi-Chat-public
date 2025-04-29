import { Button } from "@/components/ui/button";
import TooltipButton from "@/components/ui/myButtons/TooltipButton";
import { useSidebar } from "@/components/ui/sidebar";
import { isMob } from "@/lib/utils";
import { MessageSquareShare } from "lucide-react";
import Link from "next/link";
import React, { useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";

export default function NewChat() {
  const [, setSidebarState] = useLocalStorage<boolean>("sidebarState", true);
  const { setOpenMobile } = useSidebar();
  const handleClickNewChat = useCallback(() => {
    if (isMob()) {
      setSidebarState(false);
      setOpenMobile(false);
    }
  }, [setOpenMobile, setSidebarState]);
  return (
    <TooltipButton tooltipContent="New chat">
      <Link prefetch href={"/chat"}>
        <Button 
        aria-label='New chat'
          onClick={handleClickNewChat}
          size={"icon"}
          variant={"ghost"}
          className="[&_svg]:size-5"
        >
          <MessageSquareShare />
        </Button>
      </Link>
    </TooltipButton>
  );
}
