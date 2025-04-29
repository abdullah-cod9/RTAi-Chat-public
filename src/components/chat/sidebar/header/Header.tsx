import {
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import React, { memo } from "react";
import { Search } from "./Search";
import { ChatFolderGroup } from "@/app/actions/db/actions";
import NewChat from "./NewChat";

type Props = { data: ChatFolderGroup[] | undefined,  };

export default memo(function Header({ data }: Props) {
  return (
    <SidebarHeader
      className="bg-secondary dark:bg-secondary/30"
      onFocusCapture={(e) => {
        e.stopPropagation();
      }}
    >
      <SidebarMenu className="list-none">
        <SidebarMenuItem>
          <SidebarGroupLabel className="flex w-full justify-center text-primary">
            <Link aria-label='Home page' prefetch href={"/chat"}>
               {/* eslint-disable-next-line react/jsx-no-literals */}
              <h4>RTAi chat</h4>
            </Link>
          </SidebarGroupLabel>
        </SidebarMenuItem>
        <SidebarMenuItem className="mt-2 flex items-center justify-end gap-1">
          {/* <div className="mr-auto">
          <RefreshData  />
        </div> */}
          {data && <Search chats={data.flatMap(c => c.items)} />}
          <NewChat  />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
});
