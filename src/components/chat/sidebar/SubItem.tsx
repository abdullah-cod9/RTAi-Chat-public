import React, { memo } from "react";
import { Chat, ChatFolder, Plan } from "@/app/actions/db/actions";
import MotionFolder from "./ui/MotionFolder";
import MotionChat from "./ui/MotionChat";

type Props = {
  data: Chat | ChatFolder;
  plan: Plan;
  publicId: string;
  pathname: string;
  is_anonymous: boolean;
  userId: string;

  onOpen?: (value: boolean) => void;
  openValue?: boolean;
  isHover?: boolean;
};

export default memo(function SubItem({
  data,
  publicId,
  plan,
  userId,
  pathname,
  is_anonymous,
  openValue,
  onOpen,
  isHover,
}: Props) {
  if ("chats" in data) {
    return (
      onOpen &&
      openValue !== undefined &&
      isHover !== undefined && (
        <MotionFolder
          data={data}
          plan={plan}
          publicId={publicId}
          is_anonymous={is_anonymous}
          userId={userId}
          onOpen={onOpen}
          openValue={openValue}
          isHover={isHover}
        />
      )
    );
  }
  return (
    <MotionChat
      data={data}
      pathname={pathname}
      plan={plan}
      publicId={publicId}
      userId={userId}
      is_anonymous={is_anonymous}
    />
  );
});
