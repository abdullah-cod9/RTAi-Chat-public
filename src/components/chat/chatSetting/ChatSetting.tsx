import React, { memo, useCallback, useState } from "react";

import ComboBoxResponsive from "../../ui/myButtons/ComboBoxResponsive";
import { Button } from "../../ui/button";
import { Status } from "@/lib/consts";
import ChatWith from "./ChatWith";
import KnowledgeBase, { CAG } from "./KnowledgeBase";
import { Stars } from "react-bootstrap-icons";
import { FeaturesPlan } from "@/subscription";
import LoginNow from "../LoginNow";
import { useTranslations } from "next-intl";
export type userSettingsDropdownMenuChatPdf = {
  responseLanguage: string;
  userAutoSuggest: boolean;
  userRespondMode: boolean;
  userModel: string;
};
type Props = {
  setChatWith: (status: Status) => void;
  selectChatWith: Status;
  onCAG: (att: CAG[]) => void;
  featuresPlan: FeaturesPlan;
  is_anonymous: boolean;
  userId: string;
};
const ChatSetting = ({
  setChatWith,
  selectChatWith,
  onCAG,
  featuresPlan,
  is_anonymous,
  userId
}: Props) => {const t = useTranslations('Chat.chatSetting')

  const [open, setOpen] = useState(false);

  const handleOpenDialogButton = useCallback((e: boolean) => {
    setOpen(e);
  }, []);
  const handleTriggerOpenDialog = useCallback(() => {
    handleOpenDialogButton(true);
  }, [handleOpenDialogButton]);

  const handleCloseKB = (e: boolean) => {
    setOpen(e);
  };

  return (
    <ComboBoxResponsive
      title={t('title')}
      side="top"
      trigger={
        <Button
          autoFocus={false}
          onClick={handleTriggerOpenDialog}
          variant={"outline"}
          className="border-0 shadow-md"
          size={"icon"}
        >
          <Stars />
        </Button>
      }
      onOpen={handleOpenDialogButton}
      openValue={open}
    >
      <div  className="flex w-full flex-col items-start justify-center gap-2">
        {is_anonymous ? (
          <LoginNow/>
        ) : (
          <>
            <KnowledgeBase
                featuresPlan={featuresPlan}
                onCAG={onCAG}
                onClose={handleCloseKB}
                is_anonymous={is_anonymous} userId={userId}            />
            <ChatWith
              setSelectedStatus={setChatWith}
              selectValue={selectChatWith}
            />
          </>
        )}
      </div>
    </ComboBoxResponsive>
  );
};

export default memo(ChatSetting);
