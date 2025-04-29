import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useRef, useState } from "react";
import { UserAttachments } from "../MessageList";
import { useLocalStorage } from "usehooks-ts";
import { useInView } from "react-intersection-observer";
import BlurImage, { LoadingBlurImage } from "./BlurImage";
import ImageViewer from "./ImageViewer";
import { parseAsJson, useQueryState } from "nuqs";
import { z } from "zod";
import {
  supportedImagesTypes,
  SupportedDocumentTypes,
  supportedDocumentTypes,
} from "@/lib/myTypes";
import { FileEarmarkText } from "react-bootstrap-icons";
import { v4 as uuidv4 } from "uuid";
import LoadingButton from "@/components/ui/myButtons/LoadingButton";
import ErrorButton from "@/components/ui/myButtons/ErrorButton";

export const Doc = z.object({
  url: z.string(),
  type: z.enum(["pdf", "docx", "pptx", "xlsx"]),
  isOpen: z.boolean().default(false),
});
type Props = {
  chatId: string;
  userAttachments: UserAttachments[];
  messageId: string;
};
export type chatsAtt = {
  chatId: string;
  message: {
    messageId: string;
    data: {
      id: string;
      fileName: string;
      url: string;
      fileType:
        | "pdf"
        | "webp"
        | "gif"
        | "jpeg"
        | "png"
        | "docx"
        | "pptx"
        | "xlsx"
        | "txt";
      expiresAt: string;
    }[];
  }[];
}[];

export const Attachments = React.memo(function Attachments({
  chatId,
  userAttachments,
  messageId,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { ref: inViewRef, inView } = useInView({ triggerOnce: true });
  const [value, setValue] = useLocalStorage<chatsAtt>("att", []);
  const [open, setOpen] = useState(false);
  const [, setDoc] = useQueryState("doc", parseAsJson(Doc.parse));
  const supabase = createClient();
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: [`Attachments-${messageId}`],
    queryFn: async () => {
      const initialAtt = getLocalAtt(chatId, messageId, value);
      if (initialAtt) return initialAtt;
      const { data, error } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKETS_NAME!)
        .createSignedUrls(
          userAttachments.map((a) => a.filePath),
          86400,
        );

      if (error) throw new Error(error.message);
      const attData = data
        .map((d) => {
          if (d.error) return undefined;
          const userAtt = userAttachments.find((a) => a.filePath === d.path);
          if (!userAtt) return undefined;
          const expiresAt = new Date(Date.now() + 85400 * 1000).getTime();
          return {
            id: userAtt.id,
            fileName: userAtt.fileName,
            url: d.signedUrl,
            fileType: userAtt.fileType,
            expiresAt: expiresAt.toString(),
          };
        })
        .filter(Boolean) as chatsAtt[0]["message"][0]["data"];

      setValue((prev) => {
        const now = new Date();

        const cleanedPrev = prev
          .map((chat) => ({
            ...chat,
            message: chat.message
              .map((msg) => ({
                ...msg,
                data: msg.data.filter((d) => {
                  return parseInt(d.expiresAt) > now.getTime();
                }),
              }))
              .filter((msg) => msg.data.length > 0),
          }))
          .filter((chat) => chat.message.length > 0);
        const chatAtt = value
          .filter((v) => v.chatId === chatId)
          .flatMap((c) => c.message);
        if (!chatAtt)
          return [
            ...cleanedPrev,
            { chatId, message: [{ messageId, data: attData }] },
          ];
        const messageAtt = chatAtt.find((m) => m.messageId === messageId)?.data;
        if (!messageAtt)
          return [
            ...cleanedPrev,
            { chatId, message: [{ messageId, data: attData }] },
          ];

        return prev;
      });

      return attData;
    },
    enabled: inView,
  });

  // Use `useCallback` so we don't recreate the function on each render
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      // Ref's from useRef needs to have the node assigned to `current`
      ref.current = node;
      // Callback refs, like the one from `useInView`, is a function that takes the node as an argument
      inViewRef(node);
    },
    [inViewRef],
  );
  const imagesData = data
    ? data.filter((d) => supportedImagesTypes.includes(d.fileType))
    : [];
  const handleOpenImageViewer = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);
  const handleRefetch = useCallback(() => {
    refetch()
  }, [refetch]);
  const handleOpenTrigger = (open: boolean) => {
    setOpen(open);
  };
  const handleDoc = (url: string, type: SupportedDocumentTypes) => {
    setDoc({
      url,
      type,
      isOpen: true,
    });
  };

  return (
    <div ref={setRefs}>
      {isPending ? (
        <LoadingButton/>
      ) : isError ? (
        <ErrorButton onClick={handleRefetch}/>
      ) : (
        <div
          dir="auto"
          className="flex max-h-96 max-w-md flex-wrap gap-1 overflow-y-auto p-1"
        >
          {data.map((d) => (
            <div
              key={uuidv4()}
              onClick={() => {
                if (supportedImagesTypes.includes(d.fileType)) {
                  handleOpenImageViewer();
                }
              }}
            >
              {supportedImagesTypes.includes(d.fileType) ? (
                <div className="relative rounded-md">
                  <BlurImage image={d as LoadingBlurImage["image"]} />
                </div>
              ) : (
                <div className="flex w-full max-w-64 items-start gap-1 rounded-md bg-background p-1 text-sm">
                  <div
                    onClick={() => {
                      if (supportedDocumentTypes.includes(d.fileType)) {
                        handleDoc(d.url, d.fileType as SupportedDocumentTypes);
                      }
                    }}
                    className="an cursor-pointer rounded-sm bg-red-700 p-1 transition duration-300 ease-in-out hover:bg-red-800 [&_svg]:size-10 [&_svg]:shrink-0"
                  >
                    <FileEarmarkText />
                  </div>
                  <p className="flex flex-col gap-1 px-1 text-muted-foreground">
                    <span dir="auto w-full">{d.fileName}</span>
                    <span>{d.fileType.toUpperCase()}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
          {imagesData.length > 0 ? (
            <ImageViewer
              image={imagesData as LoadingBlurImage["image"][]}
              openValue={open}
              onOpenTrigger={handleOpenTrigger}
            />
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
});
export function getLocalAtt(
  chatId: string,
  messageId: string,
  value: chatsAtt,
) {
  const chatAtt = value
    .filter((v) => v.chatId === chatId)
    .flatMap((c) => c.message);

  if (!chatAtt) return undefined;
  const messageAtt = chatAtt.find((m) => m.messageId === messageId)?.data;
  if (!messageAtt) return undefined;
  const now = new Date();

  const imagesAtt = messageAtt.filter(
    (d) => parseInt(d.expiresAt) > now.getTime(),
  );
  if (messageAtt.length > 0) {
    return imagesAtt;
  } else {
    return undefined;
  }
}
