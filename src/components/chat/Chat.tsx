"use client";
import React, { useEffect, useRef } from "react";
import ChatComponent from "./ChatComponent";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ToolsContainer from "./toolsContainer/ToolsContainer";
import { InitialMessage, Plan, UsersDb } from "@/app/actions/db/actions";
import Settings from "./settings/Settings";
import { parseAsJson, useQueryState } from "nuqs";
import { ImperativePanelGroupHandle } from "react-resizable-panels";
import { Doc } from "./messageUi/Attachments";
import Link from "next/link";
type Props = {
  chatId: string;
  userData: UsersDb;
  initialMessage: InitialMessage;
  plan: Plan;
  isPublicChat: boolean;
  is_anonymous: boolean;
};

export default function Chat({
  chatId,
  userData,
  initialMessage,
  plan,
  isPublicChat,
  is_anonymous,
}: Props) {
  const [openSetting, setSetting] = useQueryState("setting");
  const [doc] = useQueryState("doc", parseAsJson(Doc.parse));
  const panelGroupRef = useRef<ImperativePanelGroupHandle | null>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {    
    if (doc && doc.isOpen) {
      if (panelGroupRef.current) {
        panelGroupRef.current.setLayout([30, 70]);
      }
    }
  }, [doc]);
  useEffect(() => {
    if (linkRef.current && openSetting && is_anonymous) {
      linkRef.current.click();
      setSetting(null);
    }
  }, [is_anonymous, openSetting, setSetting]);

  return (
    <>
      {openSetting && !is_anonymous ? (
        <Settings plan={plan} userData={userData} />
      ) : (
        <ResizablePanelGroup
          ref={panelGroupRef}
          autoSaveId={"autoSave"}
          direction={"horizontal"}
          className="flex"
        >
          <ResizablePanel id="left-panel" defaultSize={0}>
            <ToolsContainer is_anonymous={is_anonymous} userId={userData.userId} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel id="right-panel" defaultSize={100}>
            <ChatComponent
              chatId={chatId}
              _userData={userData}
              initialMessage={initialMessage}
              plan={plan}
              isPublicChat={isPublicChat}
              is_anonymous={is_anonymous}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
      <Link ref={linkRef} className="hidden" prefetch href={"/login"}></Link>
    </>
  );
}
