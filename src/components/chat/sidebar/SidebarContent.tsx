"use client";
import { WindowVirtualizer } from "virtua";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChatFolder,
  chatToFolder,
  insetFolder,
  chatFromFolder2Folder,
  chatFromFolder2Menu,
  getFoldersAndChats,
  Chat as _Chat,
  Plan,
  UsersDb,
  ChatFolderGroup,
} from "@/app/actions/db/actions";
import { usePathname } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SkeletonChatTransfer } from "@/components/SkeletonLoad";
import { useCopyToClipboard, useLocalStorage } from "usehooks-ts";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useHotkeys } from "react-hotkeys-hook";
import LoadingButton from "@/components/ui/myButtons/LoadingButton";
import ErrorButton from "@/components/ui/myButtons/ErrorButton";
import Header from "./header/Header";
import Chat from "./ui/Chat";
import Folder from "./ui/Folder";
import { useTranslations } from "next-intl";
import { revalidate } from "@/app/actions/other/action";
import FooterS from "./footerS/FooterS";
import { isProduction } from "std-env";

let didInit = false;

type Props = {
  userData: UsersDb;
  publicId: string;
  plan: Plan;
  is_anonymous: boolean;
};

export function Content({ plan, publicId, userData, is_anonymous }: Props) {
  const t = useTranslations("Chat.sidebar.content");
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [isDraggingOver, setIsDraggingOver] = useState<string | null>(null);

  const [, copy] = useCopyToClipboard();
  const [sidebarState, setSidebarState] = useLocalStorage<boolean>(
    "sidebarState",
    true,
  );
  const { userId } = useMemo(() => userData, [userData]);
  const memoPlan = useMemo(() => plan, [plan]);
  const { open, setOpen } = useSidebar();
  const [_draggedChatId, set_draggedChatId] = useState<string[]>([""]);
  const [openFolders, setOpenFolders] = useLocalStorage<string[]>(
    "openFolders",
    [""],
  );
  const pathname = usePathname();
  const { data, isError, isPending, refetch } = useQuery({
    queryKey: [`getFoldersAndChats`],
    queryFn: () => getFoldersAndChats(userId, publicId),
  });
  useEffect(() => {
    if (isProduction) {
      revalidate();
    }
  }, []);

  const { mutateAsync, isPending: mutatePending } = useMutation({
    mutationFn: async ({
      draggedChatId,
      draggedFolderId,
      targetChatId,
      targetFolderId,

      isLestChat,
      type,
    }: {
      draggedChatId: string | null;
      draggedFolderId: string | null;
      targetChatId: string | null;
      targetFolderId: string | null;

      isLestChat: boolean | null;
      type:
        | "chat2Folder"
        | "insetFolder"
        | "folder2Folder"
        | "chatFromFolder2Menu";
    }) => {
      switch (type) {
        case "chat2Folder": {
          if (!draggedChatId || !targetFolderId)
            throw new Error("Lack of parameters");
          return await chatToFolder(userId, draggedChatId, targetFolderId);
        }

        case "chatFromFolder2Menu": {
          if (!draggedChatId || !draggedFolderId || isLestChat === null)
            throw new Error("Lack of parameters");

          return await chatFromFolder2Menu(
            userId,
            draggedChatId,
            draggedFolderId,
            isLestChat,
          );
        }

        case "folder2Folder": {
          if (
            !draggedChatId ||
            !draggedFolderId ||
            !targetFolderId ||
            isLestChat === null
          )
            throw new Error("Lack of parameters");
          return await chatFromFolder2Folder(
            userId,
            draggedChatId,
            targetFolderId,
            draggedFolderId,
            isLestChat,
          );
        }

        case "insetFolder": {
          if (!draggedChatId || !targetChatId)
            throw new Error("Lack of parameters");
          return await insetFolder(
            userId,
            draggedChatId,
            targetChatId,
            "New folder",
          );
        }
        default:
          throw new Error("Invalid mutation type");
      }
    },

    onMutate: async ({
      draggedChatId,
      type,
      targetChatId,
      draggedFolderId,
      targetFolderId,
    }) => {
      await queryClient.cancelQueries({
        queryKey: [`getFoldersAndChats`],
      });
      const previous = queryClient.getQueryData([`getFoldersAndChats`]);
      switch (type) {
        case "chat2Folder":
          set_draggedChatId([draggedChatId!, targetFolderId!]);
          queryClient.setQueryData(
            [`getFoldersAndChats`],
            (old: ChatFolderGroup[]) =>
              old.map((c) => ({
                label: c.label,
                items: c.items
                  .filter(
                    (f) =>
                      ("type" in f && f.id !== draggedChatId) ||
                      ("chats" in f && f.chats && f.chats.length > 0),
                  )
                  .filter(
                    (f) =>
                      ("type" in f && f.id) ||
                      ("chats" in f && f.chats && f.chats.length > 0),
                  ),
              })),
          );
          break;
        case "insetFolder":
          set_draggedChatId(["RTC"]);
          queryClient.setQueryData(
            [`getFoldersAndChats`],
            (old: ChatFolderGroup[]) =>
              old.map((c) => ({
                label: c.label,
                items: c.items.filter(
                  (c) =>
                    ("type" in c &&
                      ![draggedChatId, targetChatId].includes(c.id)) ||
                    "chats" in c,
                ),
              })),
          );
          break;
        case "folder2Folder":
          set_draggedChatId([targetFolderId!, draggedFolderId!]);
          queryClient.setQueryData(
            [`getFoldersAndChats`],
            (old: ChatFolderGroup[]) =>
              old.map((c) => ({
                label: c.label,
                items: c.items
                  .map((f) => {
                    if ("chats" in f && f.id === draggedFolderId) {
                      const draggedChatIndex = f.chats.findIndex(
                        (obj) => obj.id === draggedChatId,
                      );

                      if (draggedChatIndex !== -1) {
                        const updatedChats = [...f.chats];
                        updatedChats.splice(draggedChatIndex, 1);

                        return { ...f, chats: updatedChats };
                      }
                    }
                    return f;
                  })
                  .filter((f) => {
                    if ("chats" in f) return f.chats.length > 0 || !!f.id;
                    return "type" in f && !!f.id;
                  }),
              })),
          );
          break;
        case "chatFromFolder2Menu":
          set_draggedChatId(["RTC", draggedFolderId!]);

          queryClient.setQueryData(
            [`getFoldersAndChats`],
            (old: ChatFolderGroup[]) =>
              old.map((c) => ({
                label: c.label,
                items: c.items
                  .map((f) => {
                    if ("chats" in f && f.id === draggedFolderId) {
                      const draggedChatIndex = f.chats.findIndex(
                        (obj) => obj.id === draggedChatId,
                      );

                      f.chats.splice(draggedChatIndex, 1);
                      return f;
                    } else {
                      return f;
                    }
                  })
                  .filter(
                    (f) =>
                      ("type" in f && f.id) ||
                      ("chats" in f && f.chats && f.chats.length > 0),
                  ),
              })),
          );
          break;
      }

      return { previous };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: [`getFoldersAndChats`],
      });
      set_draggedChatId([""]);
    },

    onError: (err, newTodo, context) => {
      if (context && context.previous) {
        queryClient.setQueryData([`getFoldersAndChats`], context.previous);
      }
    },
  });

  const handleDrop = useCallback(
    async (
      e: React.DragEvent,
      targetChatId: string | null = null,
      targetFolderId: string | null = null,
    ) => {
      if (!data) {
        throw new Error("data in undefined");
      }
      e.stopPropagation();
      // e.preventDefault();
      setIsDraggingOver(null);
      const draggedChatId = e.dataTransfer.getData("chat_id");
      const draggedFolderId = e.dataTransfer.getData("folder_id");
      // console.log(targetChatId, "Dragged Chat ID:", draggedChatId);
      // console.log(targetFolderId, "Dropped on Chat ID:", targetChatId);
      const updatedData = structuredClone(data.flatMap((c) => c.items));
      const folderData: ChatFolder[] = updatedData.filter((f) => "chats" in f);
      const isFolder = folderData.find((obj) => obj.id === targetFolderId);
      const isDraggedFolder = folderData.find(
        (obj) => "chats" in obj && obj.id === draggedFolderId,
      );

      const draggedChatFromFolder = isDraggedFolder?.chats?.find(
        (obj: _Chat) => obj.id === draggedChatId,
      );

      if (
        targetFolderId === draggedFolderId ||
        targetChatId === draggedChatId ||
        (draggedChatId &&
          !targetChatId &&
          !targetFolderId &&
          !draggedChatFromFolder)
      ) {
        // console.log("عملية غير صالحة: محاولة إسقاط عنصر على نفسه");

        return;
      }

      if (draggedChatId && targetFolderId && !draggedChatFromFolder) {
        // chat to folder
        await mutateAsync({
          draggedChatId,
          targetChatId,
          draggedFolderId: null,
          isLestChat: null,
          targetFolderId: targetFolderId,
          type: "chat2Folder",
        });
      } else if (draggedChatId && targetChatId) {
        // chat to chat = inset folder
        await mutateAsync({
          draggedChatId,
          targetChatId,
          draggedFolderId: null,
          isLestChat: null,
          targetFolderId: null,
          type: "insetFolder",
        });
      }
      if (
        isFolder &&
        draggedFolderId &&
        targetFolderId &&
        draggedChatFromFolder
      ) {
        // chat from folder to another folder
        if (!isDraggedFolder) return;

        const isLestChat = isDraggedFolder.chats.length === 1;
        await mutateAsync({
          draggedChatId,
          targetChatId: null,
          draggedFolderId: draggedFolderId,
          isLestChat: isLestChat,
          targetFolderId: targetFolderId,
          type: "folder2Folder",
        });
        return;
      } else if (
        !isFolder &&
        !targetChatId &&
        !targetFolderId &&
        isDraggedFolder &&
        draggedFolderId &&
        draggedChatFromFolder
      ) {
        // chat from folder to menu

        const isLestChat = isDraggedFolder.chats.length === 1;
        await mutateAsync({
          draggedChatId,
          targetChatId: null,
          draggedFolderId: draggedFolderId,
          isLestChat: isLestChat,
          targetFolderId: null,
          type: "chatFromFolder2Menu",
        });
      }
    },
    [data, mutateAsync],
  );

  const handleOpenCollapsible = useCallback(
    (folderId: string) => {
      if (openFolders.includes(folderId)) {
        const updated = openFolders.filter((id) => id !== folderId);
        setOpenFolders(updated);
      } else {
        const updated = [...openFolders, folderId];
        setOpenFolders(updated);
      }
    },
    [openFolders, setOpenFolders],
  );
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);
  useEffect(() => {
    if (memoPlan.featuresPlan.realTime) {
      const channel = supabase
        .channel("db-changes")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_group",
            filter: `created_by=eq.${publicId}`,
          },
          async (payload) => {
            const { role } = payload.new;
            if (role === "user") {
              await queryClient.invalidateQueries({
                queryKey: [`getFoldersAndChats`],
              });
              toast("You have been added to the chat");
            }
          },
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "chat_group",
          },
          async () => {
            queryClient.invalidateQueries({
              queryKey: [`getFoldersAndChats`],
            });
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [memoPlan.featuresPlan.realTime, publicId, queryClient, supabase]);

  useEffect(() => {
    if (!didInit) {
      didInit = true;
      setOpen(sidebarState);
    }
    setSidebarState((prev) => {
      if (prev === open) {
        return prev;
      } else {
        return open;
      }
    });
  }, [open, setOpen, setSidebarState, sidebarState]);

  useHotkeys("ctrl+shift+d", (k) => {
    k.preventDefault();
    copy(publicId)
      .then(() => {
        toast.success("Copied user Id to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy user Id to clipboard");
      });
  });
  const handleDropCallback = useCallback(
    (e: React.DragEvent) => {
      handleDrop(e, null, null);
    },
    [handleDrop],
  );
  const handleRefetch = () => {
    refetch();
  };
  const handleDragEnd = useCallback(() => {
    setIsDraggingOver(null);
  }, []);
  const handleIsDraggingOver = useCallback((e: string | null) => {
    setIsDraggingOver(e);
  }, []);
  return (
    <>
      <Header data={data} />
      {isPending ? (
        <div className="flex h-full w-full items-center justify-center bg-secondary dark:bg-secondary/30">
          <LoadingButton />
        </div>
      ) : isError ? (
        <div className="flex h-full w-full items-center justify-center bg-secondary dark:bg-secondary/30">
          <ErrorButton onClick={handleRefetch} />
        </div>
      ) : (
        <>
          <SidebarContent
            onDragOver={handleDragOver}
            onDrop={handleDropCallback}
            onDragEnd={handleDragEnd}
            className="bg-secondary dark:bg-secondary/30"
          >
            <WindowVirtualizer>
              {data.map((d) => (
                <SidebarGroup key={d.label} className="list-none">
                  <SidebarGroupLabel dir="auto" className="text-primary">
                    {t("timing.option", { option: d.label })}
                  </SidebarGroupLabel>
                  <SidebarGroupContent className="space-y-1">
                    {d.items.map((chat) =>
                      "chats" in chat ? (
                        <Folder
                          key={chat.id}
                          _draggedChatId={_draggedChatId}
                          onDrop={(e) => {
                            handleDrop(e, null, chat.id);
                          }}
                          chat={chat}
                          isDraggingOver={isDraggingOver}
                          setIsDraggingOver={handleIsDraggingOver}
                          onOpenChange={() => handleOpenCollapsible(chat.id)}
                          open={openFolders.includes(chat.id)}
                          pathname={pathname}
                          plan={memoPlan}
                          publicId={publicId}
                          is_anonymous={is_anonymous}
                          userId={userId}
                        />
                      ) : (
                        <Chat
                          key={chat.id}
                          chat={chat}
                          isDraggingOver={isDraggingOver}
                          mutatePending={mutatePending}
                          onDrop={(e) => handleDrop(e, chat.id, null)}
                          pathname={pathname}
                          setIsDraggingOver={handleIsDraggingOver}
                          plan={memoPlan}
                          publicId={publicId}
                          is_anonymous={is_anonymous}
                          userId={userId}
                        />
                      ),
                    )}
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </WindowVirtualizer>{" "}
            {_draggedChatId.includes("RTC") && <SkeletonChatTransfer />}
          </SidebarContent>
        </>
      )}
      <FooterS
        is_anonymous={is_anonymous}
        plan={memoPlan}
        userData={userData}
      />
    </>
  );
}
