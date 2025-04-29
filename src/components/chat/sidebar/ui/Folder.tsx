import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import React, { memo, useCallback, useState } from "react";
import SubItem from "../SubItem";
import { cn } from "@/lib/utils";
import { ChatFolder, Plan } from "@/app/actions/db/actions";
import { Folder as LiFolder } from "lucide-react";
import { SkeletonChatTransfer } from "@/components/SkeletonLoad";
import { motion } from "framer-motion";

type Props = {
  chat: ChatFolder;
  onDrop: React.DragEventHandler<HTMLDivElement>;
  _draggedChatId: string[];
  isDraggingOver: string | null;
  setIsDraggingOver: (id: string | null) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  is_anonymous: boolean;
  pathname: string;
  plan: Plan;
  publicId: string;
  userId: string;
};
export default memo(function Folder({
  chat,
  onDrop,
  _draggedChatId,
  isDraggingOver,
  setIsDraggingOver,
  onOpenChange,
  open,
  pathname,
  publicId,
  plan,
  userId,
  is_anonymous,
}: Props) {
  const [isHover, setIsHover] = useState<boolean>(false);
  const [openDropdownMenu, setOpenDropdownMenu] = useState<boolean>(false);

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
  const handelDragEnter = useCallback(
    (id: string) => {
      if (isDraggingOver !== id) {
        setIsDraggingOver(id);
      }
      return (e: React.DragEvent<HTMLDivElement>) => e;
    },
    [isDraggingOver, setIsDraggingOver],
  );
  const handelDragEnd = useCallback(() => {
    setIsDraggingOver(null);
  }, [setIsDraggingOver]);
  const handelDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);
  const handelDragStart = useCallback(
    (e: React.DragEvent<HTMLLIElement>, chatId: string, folderId: string) => {
      e.dataTransfer.setData("chat_id", chatId);
      e.dataTransfer.setData("folder_id", folderId);
    },
    [],
  );
  return (
    <Collapsible
      onOpenChange={onOpenChange}
      open={open}
      className={cn(
        "group/collapsible h-fit w-full",
        isDraggingOver === chat.id && "rounded-sm bg-muted",
      )}
      onDrop={onDrop}
      onDragOver={handelDragOver}
      onDragEnter={() => handelDragEnter(chat.id)}
      onDragEnd={handelDragEnd}
    >
      <SidebarMenuItem>
        <motion.div
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          className="flex w-full"
          title={chat.name}

        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className={cn("h-9 cursor-default pr-1")}>
              <LiFolder className="text-yellow-500" />
              <div className="max-w-48">
                <p className="truncate text-sm">{chat.name}</p>
              </div>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <SubItem
            plan={plan}
            publicId={publicId}
            data={chat}
            pathname={pathname}
            is_anonymous={is_anonymous}
            userId={userId}
            isHover={isHover}
            onOpen={handleOpenDropdownMenu}
            openValue={openDropdownMenu}
          />
        </motion.div>
        <CollapsibleContent>
          <SidebarMenuSub className="mr-0 list-none">
            {chat.chats.map((c) => (
              <SidebarMenuSubItem
                key={c.id}
                draggable
                onDragStart={(e) => handelDragStart(e, c.id, chat.id)}
                className={cn(
                  "my-1 pr-1 flex h-9 w-full items-center rounded-sm hover:rounded-sm hover:bg-muted",
                  pathname === `/chat/${c.id}` && "bg-muted",
                  isDraggingOver === c.id && "rounded-sm bg-muted",
                )}
              >
                <SubItem
                  plan={plan}
                  publicId={publicId}
                  data={c}
                  pathname={pathname}
                  is_anonymous={is_anonymous}
                  userId={userId}
                />
              </SidebarMenuSubItem>
            ))}
            {_draggedChatId.includes(chat.id) && <SkeletonChatTransfer />}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
});
