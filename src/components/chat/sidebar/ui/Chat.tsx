import { SidebarMenuItem } from "@/components/ui/sidebar";
import React, { memo, useCallback } from "react";
import SubItem from "../SubItem";
import { Chat as _Chat, Plan } from "@/app/actions/db/actions";
import { cn } from "@/lib/utils";

type Props = {
  chat: _Chat;
  mutatePending: boolean;
  onDrop: React.DragEventHandler<HTMLLIElement>;
  isDraggingOver: string | null;
  setIsDraggingOver: (id: string | null) => void;
  pathname: string;
  plan: Plan
  publicId: string;
  userId: string;
  is_anonymous:boolean
};

export default memo(function Chat({
  chat,
  mutatePending,
  onDrop,
  isDraggingOver,
  setIsDraggingOver,
  pathname,
  publicId,
  plan,
  is_anonymous, userId
}: Props) {
  const handelDragEnter = useCallback(
    (id: string) => {
      setIsDraggingOver(id);
      return (e: React.DragEvent<HTMLLIElement>) => e;
    },
    [setIsDraggingOver],
  );
  const handelDragOver = useCallback((e: React.DragEvent<HTMLLIElement>) => {
  
    e.preventDefault();
  }, []);
  const handelDragStart = useCallback(
    (e: React.DragEvent<HTMLLIElement>, chatId: string) => {
      e.dataTransfer.setData("chat_id", chatId);
    },
    [],
  );
  return (
    <SidebarMenuItem
      draggable={!mutatePending}
      onDragStart={(e) => handelDragStart(e, chat.id)}
      onDrop={onDrop}
      onDragOver={handelDragOver}
      onDragEnter={() => handelDragEnter(chat.id)}
      className={cn(
        "!hover:rounded-sm flex !h-9 items-center overflow-clip !rounded-sm py-1 pl-2 hover:bg-muted",

        pathname === `/chat/${chat.id}` && "bg-muted",
        isDraggingOver === chat.id && "rounded-sm bg-muted",
      )}
    >
      <SubItem
        pathname={pathname}
        plan={plan}
        publicId={publicId}
        data={chat}
        is_anonymous={is_anonymous} userId={userId}      />
    </SidebarMenuItem>
  );
});
