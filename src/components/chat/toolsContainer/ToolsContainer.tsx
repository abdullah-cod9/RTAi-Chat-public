"use client";
import React, { memo, useCallback, useState } from "react";
import { Button } from "../../ui/button";
import MyJodit from "../../Jodit/Jodit";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Documents from "./Documents";
import PdfViewer from "./PdfViewer";
import DocxViewer from "./DocxViewer";
import { Doc } from "../messageUi/Attachments";
import { parseAsJson, useQueryState } from "nuqs";
import { X } from "lucide-react";
import { LayoutTextWindow } from "react-bootstrap-icons";
import { useTranslations } from "next-intl";
import LoginNow from "../LoginNow";
type Props = { is_anonymous: boolean; userId: string };
type ToolsType = "editor" | "image" | "pdf" | "office" | null;

export default memo(function ToolsContainer({ is_anonymous, userId }: Props) {
  const t = useTranslations("Chat.toolsContainer");
  const [tool, setTool] = useState<ToolsType | null>(null);
  const [doc, setDoc] = useQueryState("doc", parseAsJson(Doc.parse));
  const handleSelectTool = useCallback((tool: ToolsType) => {
    setTool(tool);
  }, []);
  const handleCloseTool = useCallback(() => {
    setTool(null);
    setDoc(null);
  }, [setDoc]);

  return (
    <div className="relative h-full w-full">
      {tool || doc ? (
        <Button
          size={"icon"}
          variant={"secondary"}
          className="absolute right-3 top-3 p-2"
          onClick={handleCloseTool}
        >
          <X />
        </Button>
      ) : (
        <></>
      )}

      {!is_anonymous ? (
        (!tool && !doc) && (
          <div className="absolute left-1/2 top-1/2 flex h-40 w-fit -translate-x-1/2 -translate-y-1/2 transform flex-col items-start justify-center">
            <span className="absolute top-5 z-10 ml-2 bg-background px-2">
              {t("title")}
            </span>
            <Command className="relative h-fit rounded-lg border shadow-md">
              <CommandList className="pt-4">
                <CommandGroup>
                  <CommandItem className="p-0">
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      className="flex h-full w-full items-center justify-start gap-2 rounded-sm p-2"
                      onClick={() => handleSelectTool("editor")}
                    >
                      <LayoutTextWindow />
                      <span> {t("editor")}</span>
                    </Button>
                  </CommandItem>
                  <CommandItem className="p-0">
                    <Documents userId={userId} />
                  </CommandItem>
                </CommandGroup>
                {/* <CommandSeparator /> */}
              </CommandList>
            </Command>
          </div>
        )
      ) : (
        <LoginNow />
      )}

      <div className="h-full w-full pt-20">
        {tool === "editor" && <MyJodit userId={userId} />}
        {doc?.type === "pdf" && <PdfViewer url={doc.url} />}
        {doc && ["pdf", "docx", "pptx", "xlsx"].includes(doc.type) && (
          <DocxViewer url={doc.url} />
        )}
      </div>
    </div>
  );
});
