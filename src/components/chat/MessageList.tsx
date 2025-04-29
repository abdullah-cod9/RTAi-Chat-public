import { cn } from "@/lib/utils";
import React, { memo, useCallback, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { MemoizedMarkdown } from "./messageUi/MarkdownRenderer";
import { Button } from "../ui/button";
import { useCopyToClipboard, useReadLocalStorage } from "usehooks-ts";
import { toast } from "sonner";
import AvatarComponent from "./messageUi/AvatarComponent";
import { AiUserIsStreaming } from "./ChatComponent";
import { Attachments, chatsAtt, getLocalAtt } from "./messageUi/Attachments";
import { Parts } from "@/lib/myTypes";
import { SupportedImagesTypes, supportedImagesTypes } from "@/lib/myTypes";
import { ModelsType } from "@/models/settings";
import { Copy, Reply } from "lucide-react";
import { useTranslations } from "next-intl";
import ReasoningText from "./messageUi/ReasoningText";
import Image from "next/image";
import { ToolInvocation } from "ai";
import { TextLoadingChat } from "../SkeletonLoad";
export type Reply = {
  replyContent: string;
  replyMessageId: string;
  replyUserName: string | null;
  replyRole: "user" | "assistant";
  aiId: string | null;
  userAttachments: ReplyAttachments[] | undefined;
};
type Props = {
  publicId: string;
  chatId: string;
  messages: chatHistoryProps[];
  isSubmitted: boolean;
  scrollToBottom: boolean;
  refBottom: React.Ref<HTMLDivElement>;
  aiIsUserStreaming: AiUserIsStreaming[];
  onReply: (reply: Reply) => void;
};

export type UserAttachments = {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number | undefined;
  signedUrl: string | undefined;
  fileType:
    | "pdf"
    | "webp"
    | "gif"
    | "jpeg"
    | "png"
    | "docx"
    | "pptx"
    | "xlsx"
    | "txt"
    | "jpg";
  text: string | null;
  isRAG: boolean;
};
type ImagesReply = {
  fileName: string;
  url: string;
  fileType: "webp" | "gif" | "jpeg" | "png" | "jpg";
  filePath: string;
  fileSize: number;
  text: null;
};
type DocReply = {
  fileName: string;
  url: null;
  filePath: undefined;
  fileType: "pdf" | "docx" | "pptx" | "xlsx" | "txt";
  fileSize: undefined;
  text: string;
};
export type ReplyAttachments = ImagesReply | DocReply;

export type chatHistoryProps = {
  id: string;
  content: string | null;
  role: "user" | "assistant";
  model: string | null;
  createdAt: Date;
  createdBy: string;
  publicId: string;
  username: string;
  avatarUrl: string;
  replyToMessage: { type: "text"; text: string }[] | null;
  replyToMessageId: string | null;
  annotations:
    | {
        modelMetadata: {
          id: string;
          modelName: ModelsType;
        };
      }[]
    | null;
  parts: Parts[];
  toolInvocations?: Array<ToolInvocation>;
  userAttachments: UserAttachments[] | undefined;
  error?: boolean;
};
export default memo(function MessageList({
  publicId,
  chatId,
  messages,
  onReply,
  aiIsUserStreaming,
  isSubmitted,
  refBottom,
  scrollToBottom,
}: Props) {
  const [, copy] = useCopyToClipboard();
  const att = useReadLocalStorage<chatsAtt>("att");
  const t = useTranslations("Chat.messageList");
  const lastMessageId = messages[messages.length - 1]?.id || null;
  const ref = useRef<HTMLDivElement>(null);
  // const scrollRef = useRef<HTMLDivElement | null>(null);
  // const [isAtBottom, setIsAtBottom] = useState(false);
  // const hasScrolled = useRef(false);
  const [messageId, setMessageId] = useState<string | null>(lastMessageId);
  const JumpToReply = useCallback((replyToID: string | null) => {
    if (!replyToID) return;
    setMessageId(replyToID);
    setTimeout(() => {
      if (ref.current) {
        ref.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  }, []);

  const handleCopy = useCallback(
    async (text: string) => {
      await copy(text)
        .then(() => {
          toast.success("Copied message to clipboard");
        })
        .catch(() => {
          toast.error("Failed to copy message to clipboard");
        });
    },
    [copy],
  );
  const handleReply = useCallback(
    (message: chatHistoryProps) => {
      const localAttachments =
        att && att.length > 0
          ? getLocalAtt(chatId, message.id, att)
          : undefined;
      const attachments = message.userAttachments
        ? message.userAttachments.filter((f) =>
            supportedImagesTypes.includes(f.fileType),
          )
        : undefined;
      const setUserAttachments: ReplyAttachments[] | undefined =
        localAttachments && attachments
          ? [
              ...localAttachments
                .filter((a) => supportedImagesTypes.includes(a.fileType))
                .flatMap((i) => {
                  const t = attachments.find((f) => f.id === i.id);
                  if (!t) return [];
                  return [
                    {
                      fileName: t.fileName,
                      fileType: t.fileType as SupportedImagesTypes,
                      filePath: t.filePath,
                      fileSize: t.fileSize as number,
                      url: i.url,
                      text: null,
                    },
                  ];
                })
                .slice(0, 3),
              ...(message.parts[3]?.type === "text"
                ? [
                    {
                      fileName: "txt",
                      fileType: "txt" as const,
                      filePath: undefined,
                      fileSize: undefined,
                      url: null,
                      text: message.parts[3].text,
                    },
                  ]
                : []),
            ]
          : undefined;

      onReply({
        replyContent:
          message.role === "user"
            ? message.parts
                .map((p, i) => {
                  if (p.type === "text" && i === 0) {
                    return p.text;
                  } else {
                    return "";
                  }
                })
                .join(" ")
            : message.parts
                .map((p) => {
                  if (p.type === "text") {
                    return p.text;
                  } else {
                    return "";
                  }
                })
                .join(" "),
        replyMessageId: message.id,
        replyRole: message.role,
        replyUserName:
          message.role === "user"
            ? message.parts[1].type === "text"
              ? message.parts[1].text
              : ""
            : (message.model ?? ""),
        aiId: null,
        userAttachments: setUserAttachments,
      });
    },
    [att, chatId, onReply],
  );

  return (
    <ScrollArea className="w-full">
      <div className="flex w-full flex-col items-center px-2 pt-10 sm:px-5">
        <div className="w-full max-w-[50rem]">
          {messages.map((message) => {
            return (
              <div
                key={message.id}
                id={message.id}
                ref={message.id === messageId ? ref : null}
                className={cn("group flex items-start", {
                  "flex-row-reverse justify-start":
                    message.publicId === publicId &&
                    message.role !== "assistant",
                  "bg flex-row justify-start":
                    message.role == "assistant" &&
                    message.publicId !== publicId,
                })}
              >
                {message.role !== "assistant" ? (
                  <AvatarComponent
                    src={message.avatarUrl}
                    username={message.username}
                  />
                ) : (
                  <AvatarComponent
                    username="Ai"
                    src="https://api.rtai.chat/storage/v1/object/public/Public_assets/images/ai-platform-svgrepo-com.png"
                  />
                )}

                <div className="mx-2 my-4 flex flex-col">
                  <div
                    className={cn(
                      "rounded-md bg-secondary pb-1",

                      {
                        "bg-transparent": message.role === "assistant",
                      },
                      {
                        "bg-destructive/80 hover:bg-destructive": message.error,
                      },
                    )}
                  >
                    <div
                      dir="auto"
                      className={"relative mx-2 max-w-80 sm:max-w-[55rem]"}
                    >
                      <p dir="auto" className="mb-2 font-medium">
                        {message.role !== "assistant"
                          ? message.username
                          : message.model
                            ? message.model
                            : (message.annotations?.find((a) => a.modelMetadata)
                                ?.modelMetadata.modelName ?? "")}
                      </p>
                      {message.replyToMessageId && message.replyToMessage && (
                        <div
                          className="mb-1 text-wrap rounded-sm bg-background/75 p-2"
                          onClick={() => JumpToReply(message.replyToMessageId)}
                        >
                          <MemoizedMarkdown
                            content={message.replyToMessage[0].text}
                            id={message.replyToMessageId}
                          />
                        </div>
                      )}
                      {message.userAttachments &&
                      message.userAttachments.length > 0 ? (
                        <Attachments
                          chatId={chatId}
                          userAttachments={message.userAttachments}
                          messageId={message.id}
                        />
                      ) : (
                        <></>
                      )}
                      {message.role === "user" ? (
                        message.parts[0].type === "text" ? (
                          <MemoizedMarkdown
                            content={message.parts[0].text}
                            id={message.id}
                          />
                        ) : (
                          <></>
                        )
                      ) : message.toolInvocations ? (
                        message.toolInvocations.map((ti) => {
                          switch (ti.toolName) {
                            case "generateImage":
                              return ti.state === "result" ? (
                                <Image
                                  key={ti.toolCallId}
                                  src={ti.result.image}
                                  alt={ti.result.prompt}
                                  height={400}
                                  width={400}
                                />
                              ) : (
                                <div
                                  key={ti.toolCallId}
                                  className="animate-pulse"
                                >
                                  Generating image...
                                </div>
                              );
                            case "searchDocument":
                              return ti.state === "result" ? (
                                message.parts.map((part, i) => {
                                  switch (part.type) {
                                    // case "reasoning":
                                    //   return (
                                    //     <ReasoningText
                                    //       key={i}
                                    //       content={part.reasoning}
                                    //       id={message.id}
                                    //     />
                                    //   );
                                    case "text":
                                      return (
                                        <MemoizedMarkdown
                                          key={i}
                                          content={part.text}
                                          id={message.id}
                                        />
                                      );
                                    // case "source": return <p key={i}>{part.source.url}</p>;
                                    // case "tool-invocation": return <div key={i}>{part.toolInvocation.toolName}</div>;
                                  }
                                })
                              ) : (
                                <div
                                  key={ti.toolCallId}
                                  className="animate-pulse"
                                >
                                  Analyzing the documents... This may take a few
                                  moments.
                                </div>
                              );
                            default:
                              break;
                          }
                        })
                      ) : (
                        message.parts.map((part, i) => {
                          switch (part.type) {
                            case "reasoning":
                              return (
                                <ReasoningText
                                  key={i}
                                  content={part.reasoning}
                                  id={message.id}
                                />
                              );
                            case "text":
                              return (
                                <MemoizedMarkdown
                                  key={i}
                                  content={part.text}
                                  id={message.id}
                                />
                              );
                            // case "source": return <p key={i}>{part.source.url}</p>;
                            // case "tool-invocation": return <div key={i}>{part.toolInvocation.toolName}</div>;
                            case "file":
                              return (
                                <Image
                                  key={i}
                                  src={part.data}
                                  alt={"Generate image"}
                                  height={400}
                                  width={400}
                                />
                              );
                          }
                        })
                      )}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "flex w-full items-center justify-end gap-2 rounded-b-md px-2 py-1",
                    )}
                  >
                    {message.publicId !== publicId ||
                    message.role === "assistant" ? (
                      <Button
                        size={"icon"}
                        variant={"ghost"}
                        onClick={() => handleReply(message)}
                        className="invisible h-8 w-8 p-0 hover:bg-transparent hover:text-primary group-hover:visible"
                      >
                        <Reply />
                      </Button>
                    ) : (
                      <Button
                        size={"icon"}
                        variant={"ghost"}
                        onClick={() => handleReply(message)}
                        className="invisible h-8 w-8 p-0 hover:bg-transparent hover:text-primary group-hover:visible"
                      >
                        <Reply />
                      </Button>
                    )}

                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      onClick={() =>
                        handleCopy(
                          message.parts[0].type === "text"
                            ? message.parts[0].text
                            : "",
                        )
                      }
                      className={cn(
                        "invisible h-8 w-8 p-0 hover:bg-transparent hover:text-primary group-hover:visible",
                      )}
                    >
                      <Copy />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
          {aiIsUserStreaming.map((u) => (
            <div
              key={u.publicId}
              className={cn("flex animate-pulse items-start")}
            >
              <AvatarComponent username={u.userName} src={u.avatarUrl} />
              <div className="mx-2 my-4 flex flex-col">
                <div className={cn("rounded-md bg-accent pb-1")}>
                  <div dir="auto" className={"mx-2 max-w-[42rem] text-base"}>
                    <p dir="auto" className="font-medium">
                      {u.userName}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      <span className="font-semibold">
                        {t("ai_is_generating")}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isSubmitted && (
            <div className="flex items-center gap-3 pl-10">
              <TextLoadingChat />
              <TextLoadingChat />
              <TextLoadingChat />
            </div>
          )}
          {scrollToBottom && <div className="h-[20rem] md:h-[25rem]" />}
          <div className="h-80" ref={refBottom} />
        </div>
      </div>
    </ScrollArea>
  );
});
