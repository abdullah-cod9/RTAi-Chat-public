import { Button } from "@/components/ui/button";
import React, { memo } from "react";
import AddFriend from "./AddFriend";
import ComboBoxResponsive from "@/components/ui/myButtons/ComboBoxResponsive";
import GroupMembers from "./GroupMembers";
import DownloadChatHistory from "./DownloadChatHistory";
import DeleteChat from "./DeleteChat";
import { Chat, ChatFolder, Plan } from "@/app/actions/db/actions";
import Rename from "./ReName";
import CreateChat from "./CreateNewChat";
import DeleteFolder from "./DeleteFolder";
import { MoreHorizontal } from "lucide-react";
import LoginNow from "../../LoginNow";

type Props = {
  onOpen: (value: boolean) => void;
  openValue: boolean;
  data: Chat | ChatFolder;
  publicId: string;
  plan: Plan;
  is_anonymous: boolean;
  userId: string;
};

export default memo(function SidebarDropdownMenu({
  onOpen,
  openValue,
  data,
  publicId,
  plan,
  is_anonymous,
  userId,
}: Props) {
  if ("chats" in data) {
    return (
      <ComboBoxResponsive
        openValue={openValue}
        onOpen={onOpen}
        trigger={
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={(e) => e.stopPropagation()}
            className="h-6 border-0 shadow-lg hover:bg-background hover:text-primary"
          >
            <MoreHorizontal />
          </Button>
        }
        side="right"
        align="start"
      >
        <div className={"max-w-40 p-1 sm:max-w-52"}>
          {is_anonymous ? (
            <LoginNow />
          ) : (
            <>
              <Rename
                userId={userId}
                currentName={data.name}
                chatId={undefined}
                folderId={data.id}
              />
              <CreateChat
                folderId={data.id}
                folderName={data.name}
                userId={userId}
              />
              <DeleteFolder
                chats={data.chats}
                folderId={data.id}
                folderName={data.name}
                publicId={publicId}
                userId={userId}
              />
            </>
          )}
        </div>
      </ComboBoxResponsive>
    );
  }

  return (
    <ComboBoxResponsive
      openValue={openValue}
      onOpen={onOpen}
      trigger={
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={(e) => e.stopPropagation()}
          className="h-6 border-0 shadow-lg hover:bg-background hover:text-primary"
        >
          <MoreHorizontal />
        </Button>
      }
      side="right"
      align="start"
    >
      <div className={"p-1 md:max-w-52"}>
        {is_anonymous ? (
          <LoginNow />
        ) : (
          <>
            <Rename
              currentName={data.name}
              userId={userId}
              chatId={data.id}
              folderId={undefined}
            />
            <AddFriend
              maxGroupMembers={plan.featuresPlan.maxGroupMembers}
              publicId={publicId}
              role={data.role}
              chatId={data.id}
              userId={userId}
            />
            <GroupMembers
              chatId={data.id}
              userId={userId}
              publicId={publicId}
              role={data.role}
            />
            <DownloadChatHistory chatId={data.id} chatName={data.name} />
            <DeleteChat
              chatName={data.name}
              chatId={data.id}
              publicId={publicId}
              userId={userId}
            />
          </>
        )}
      </div>
    </ComboBoxResponsive>
  );
});
