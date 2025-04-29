import React, { memo, useCallback } from "react";
import SelectImageQuality from "./SelectImageQuality";
import SelectImageDimensions from "./SelectImageDimensions";
import { ModelsType, reasoningModels } from "@/models/settings";
import AttUpload from "../../AttUpload";
import ChatSetting from "../../chatSetting/ChatSetting";
import SelectModel from "../../chatSetting/SelectModel";
import ReasoningEffort, { ReasoningEffortType } from "../ReasoningEffort";
import { useLocalStorage } from "usehooks-ts";
import { ChatWithOption, Status } from "@/lib/consts";
import { CAG } from "../../chatSetting/KnowledgeBase";
import { FileUpload } from "@/lib/myTypes";
import { Dimensions, Quality } from "@/models/utils";
import { Plan } from "@/app/actions/db/actions";

type Props = {
  onCAG: (att: CAG[]) => void;
  plan: Plan;
  is_anonymous: boolean;
  userId: string;
  setAtt: (file: FileUpload) => void;
};

export default memo(function Footer({
  is_anonymous,
  onCAG,
  plan,
  userId,
  setAtt,
}: Props) {
  const [chatSetting, setChatSetting] = useLocalStorage<{
    ChatWith: Status;
    selectModel: ModelsType;
    selectedEffort: ReasoningEffortType;
    imageQuality: Quality;
    imageDimensions: Dimensions;
  }>("chat-setting", {
    ChatWith: ChatWithOption[0],
    selectModel: "gpt-4o-mini",
    selectedEffort: "low",
    imageQuality: "low",
    imageDimensions: "1024x1024",
  });

  const handleChatWith = useCallback(
    (e: Status) => {
      setChatSetting((s) => ({ ...s, ChatWith: e }));
    },
    [setChatSetting],
  );
  const handleSelectModel = useCallback(
    (e: ModelsType) => {
      setChatSetting((s) => ({ ...s, selectModel: e }));
    },
    [setChatSetting],
  );
  const handleSelectEffort = useCallback(
    (e: ReasoningEffortType) => {
      setChatSetting((s) => ({ ...s, selectedEffort: e }));
    },
    [setChatSetting],
  );
  const handleSelectImageQuality = useCallback(
    (e: Quality) => {
      setChatSetting((s) => ({ ...s, imageQuality: e }));
    },
    [setChatSetting],
  );
  const handleSelectDimensions = useCallback(
    (e: Dimensions) => {
      setChatSetting((s) => ({ ...s, imageDimensions: e }));
    },
    [setChatSetting],
  );
  return (
    <>
      <ChatSetting
        setChatWith={handleChatWith}
        selectChatWith={chatSetting.ChatWith}
        onCAG={onCAG}
        featuresPlan={plan.featuresPlan}
        is_anonymous={is_anonymous}
        userId={userId}
      />
      <AttUpload
        setAtt={setAtt}
        featuresPlan={plan.featuresPlan}
        is_anonymous={is_anonymous}
      />
      <SelectModel
        onSelectModel={handleSelectModel}
        selectValue={chatSetting.selectModel}
        plan={plan}
        is_anonymous={is_anonymous}
      />
      {reasoningModels.some((model) =>
        plan.featuresPlan.accessModels.includes(model),
      ) &&
        reasoningModels.includes(chatSetting.selectModel) && (
          <ReasoningEffort
            selectedEffort={chatSetting.selectedEffort}
            onReasoningEffort={handleSelectEffort}
          />
        )}
      {chatSetting.selectModel === "gpt-image-1" &&
        plan.subscriptionType === "plus" && (
          <>
            <SelectImageQuality
              onSelectImageQuality={handleSelectImageQuality}
              selectQuality={chatSetting.imageQuality}
              subscriptionType={plan.subscriptionType}
            />
            <SelectImageDimensions
              subscriptionType={plan.subscriptionType}
              onSelectDimensions={handleSelectDimensions}
              selectDimensions={chatSetting.imageDimensions}
            />
          </>
        )}
    </>
  );
});
