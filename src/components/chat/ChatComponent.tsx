"use client";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "../ui/button";
import MessageList, {
  chatHistoryProps,
  Reply,
  UserAttachments,
} from "./MessageList";
import { createClient } from "@/lib/supabase/client";
import { ChatWithOption, Status } from "@/lib/consts";
import { v4 as uuidv4 } from "uuid";
import { Message, useChat, useCompletion } from "@ai-sdk/react";
import {
  useEventListener,
  useLocalStorage,
  useReadLocalStorage,
} from "usehooks-ts";
import ReplyMessage from "../ui/ReplyMessage";
import {
  chiackUserPlan,
  InitialMessage,
  nameToNewChat,
  Plan,
  saveUserMessage,
  UsersDb,
} from "@/app/actions/db/actions";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Attachment } from "ai";
import { toast } from "sonner";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  FileUpload,
  supportedDocumentTypes,
  supportedImagesTypes,
} from "@/lib/myTypes";
import { CAG } from "./chatSetting/KnowledgeBase";
import ViewUploadedAtt, { AttDoc } from "./chatUi/ViewUploadedAtt";
import { ModelsType } from "@/models/settings";
import { ArrowDown, Send, StopFill } from "react-bootstrap-icons";
import { ReasoningEffortType } from "./chatUi/ReasoningEffort";
import { parseAsString, useQueryState } from "nuqs";
import { useQueryClient } from "@tanstack/react-query";
import { Prompts } from "@/models/prompts";
import Header from "./chatUi/header/Header";
import Footer from "./chatUi/footer/Footer";
import { Dimensions, Quality } from "@/models/utils";

type Props = {
  chatId: string;
  _userData: UsersDb;
  initialMessage: InitialMessage;
  plan: Plan;
  isPublicChat: boolean;
  is_anonymous: boolean;
};

export type getReply = {
  replyContent: string;
  id: string;
  replyRole: "user" | "assistant";
} | null;
// let didInit = false;
export type AiUserIsStreaming = {
  publicId: string;
  userName: string;
  avatarUrl: string;
  isStreaming: boolean;
};
let didInit = "";
let isNowChat = "";
let setNameToNewChat = "";
export default memo(function ChatComponent({
  chatId,
  _userData,
  initialMessage,
  plan,
  isPublicChat,
  is_anonymous,
}: Props) {
  const refBottom = useRef<HTMLDivElement>(null);
  const refCompletion = useRef<string>(null);
  const isInView = useInView(refBottom);
  const queryClient = useQueryClient();
  const userData = useMemo(() => _userData, [_userData]);
  const memoPlan = useMemo(() => plan, [plan]);
  const [chatSetting] = useLocalStorage<{
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
  const supabase = createClient();
  const { avatarUrl, publicId, userId, username } = useMemo(
    () => userData,
    [userData],
  );
  const [reply, setReply] = useState<Reply | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [q, setQ] = useQueryState("q", parseAsString);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const selectedKBId = useReadLocalStorage<{
    type: "RAG" | "CAG";
    ids: string[];
  }>("selected-KB-id");

  const channelRef = useRef<RealtimeChannel>(null);
  const [att, setAtt] = useLocalStorage<AttDoc[]>("att-upload", []);
  const [aiIsUserStreaming, setAiUserIsStreaming] = useState<
    AiUserIsStreaming[]
  >([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { setMessages, messages, reload, status, stop, error } = useChat({
    api: "/api/chat",
    body: {
      chatId,
      userId: userId,
      username: username,
      replyMessageId: reply ? reply.replyMessageId : null,
      planType: memoPlan.subscriptionType,
      userPreferences: {
        reasoningEffort: chatSetting.selectedEffort,
        selectedKBId: selectedKBId,
        model: chatSetting.selectModel,
        imageDimensions: chatSetting.imageDimensions,
        imageQuality: chatSetting.imageQuality,
      },
    },
    experimental_throttle: 50,
    initialMessages: initialMessage,
    onResponse: async () => {
      const aiIsStreaming: AiUserIsStreaming = {
        userName: username,
        publicId: publicId,
        avatarUrl: avatarUrl,
        isStreaming: true,
      };
      if (isNowChat === chatId) {
        await queryClient.invalidateQueries({
          queryKey: [`getFoldersAndChats`],
        });
        isNowChat = "";
      }
      if (!channelRef.current) return;
      channelRef.current.send({
        type: "broadcast",
        event: "AiResponse",
        aiIsStreaming,
      });
    },
    onFinish: async ({ annotations, content }) => {
      await chiackUserPlan(userId);
      const aiIsStreaming: AiUserIsStreaming = {
        userName: username,
        publicId: publicId,
        avatarUrl: avatarUrl,
        isStreaming: false,
      };
      const { modelMetadata } = annotations?.find(
        (a) => typeof a === "object" && a !== null && "modelMetadata" in a,
      ) as { modelMetadata: { id: string; modelName: string } };

      if (!modelMetadata) {
        throw new Error("Model metadata is undefined");
      }

      const newMessage = {
        id: modelMetadata.id,
        avatarUrl: avatarUrl,
        publicId: publicId,
        model: modelMetadata.modelName,
        content: content,
        createdAt: new Date(),
        role: "assistant",
        replyMessage: null,
        replyToMessageId: null,
      };
      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "sendAiMessages",
          newMessage,
          aiIsStreaming,
        });
      }
    },
    onError: async () => {
      const aiIsStreaming: AiUserIsStreaming = {
        userName: username,
        publicId: publicId,
        avatarUrl: avatarUrl,
        isStreaming: false,
      };
      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "errorAiMessages",
          aiIsStreaming,
        });
      }
    },
  });
  const {
    completion,
    complete,
    setCompletion,
    isLoading,
    stop: stopCompletion,
  } = useCompletion({
    api: "/api/completion",
    body: {
      planType: plan.subscriptionType,
      userId: userId,
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onFinish: async (_, text) => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
      if (setNameToNewChat === chatId) {
        setCompletion("");
        setNameToNewChat = "";
        await nameToNewChat(userId, chatId, text);
        await queryClient.invalidateQueries({
          queryKey: [`getFoldersAndChats`],
        });
      }
      await chiackUserPlan(userId);
    },
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!memoPlan.featuresPlan.isActive) {
        return toast.warning(
          memoPlan.subscriptionType === "free"
            ? "You've reached your free token limit for today. No worries — your tokens will automatically refresh tomorrow."
            : "You've used all your available tokens. Please renew your subscription to continue.",
        );
      }
      if (
        !memoPlan.featuresPlan.imageGenerations &&
        memoPlan.subscriptionType === "plus"
      ) {
        return toast.warning(
          "You have reached your image generation limit. Please renew your subscription to continue.",
        );
      }
      if (!plan.featuresPlan.accessModels.includes(chatSetting.selectModel)) {
        return toast.warning(
          "This model requires a Plus subscription. Please upgrade or select a different model.",
        );
      }
      const formData = new FormData(e.currentTarget);
      const textareaValue = formData.get("input") as string;
      if (!textareaValue.trim()) return;
      setLastMessage(textareaValue);
      setIsSubmitted(true);
      e.currentTarget.reset();
      setCompletion("");
      const imagesAtt = att.filter((a) =>
        supportedImagesTypes.includes(a.fileType),
      );

      if (imagesAtt.length > 1 && chatSetting.selectModel === "gpt-4o-mini") {
        return toast.warning(
          "The 'gpt-4o-mini' model supports only one image at a time. Please switch to 'gpt-4o' to analyze multiple images.",
        );
      }

      if (imagesAtt.length > 3) {
        return toast.warning("You can send a maximum of 3 images per request.");
      }

      const textFileContent: { type: "text"; text: string } | undefined =
        att.filter((a) => supportedDocumentTypes.includes(a.fileType)).length >
        0
          ? {
              type: "text",
              text: `[BEGINNING OF DOCUMENT]\n${att
                .filter((a) => supportedDocumentTypes.includes(a.fileType))
                .map((f) => f.text)
                .join("\n")}\n[END OF DOCUMENT]`,
            }
          : undefined;

      const replyMessage: { type: "text"; text: string } | undefined =
        reply?.replyContent
          ? {
              type: "text",
              text: `[The beginning of the message that the user replied to]
${
  reply.replyRole === "assistant"
    ? `Ai message:${reply.replyContent}`
    : ` ${reply.replyUserName ?? ""}
User message: ${reply.replyContent ?? ""}
${reply.userAttachments?.filter((a) => a.fileType === "txt").map((a) => a.text) ?? ""}`
}
[End of the message the user replied to]`,
            }
          : undefined;
      const imagesAttachments = imagesAtt.map((a) => ({
        name: a.fileName,
        contentType: `image/${a.fileType}`,
        url: a.signedUrl,
      }));

      const images = [
        ...(imagesAttachments.length > 0 ? imagesAttachments : []),
      ];
      const attachments: Attachment[] | undefined =
        images.length > 0 ? images : undefined;
      const userAttachments: UserAttachments[] = att.map((a) => ({
        id: uuidv4(),
        fileType: a.fileType,
        filePath: a.filePath,
        signedUrl: a.signedUrl,
        fileSize: a.fileSize,
        fileName: a.fileName,
        text: a.text,
        isRAG: a.isRAG,
      }));

      const parts: { type: "text"; text: string }[] = [
        { type: "text", text: textareaValue },
        {
          type: "text",
          text: `[username]:${username}`,
        },
        replyMessage,
        textFileContent,
      ].filter(Boolean) as { type: "text"; text: string }[];

      const uuid = uuidv4();
      const newMessage = {
        id: uuid,
        avatarUrl: avatarUrl,
        publicId: publicId,
        username: username,
        createdAt: new Date(),
        role: "user",
        replyToMessage: reply
          ? [
              {
                type: "text",
                text: reply.replyContent,
              },
            ]
          : null,
        replyToMessageId: reply ? reply.replyMessageId : null,
        experimental_attachments: attachments,
        userAttachments,
        parts: parts,
      };
      setMessages((prevMessages) => [
        ...prevMessages,
        newMessage as unknown as Message,
      ]);

      saveUserMessage(
        userId,
        uuid,
        chatId,
        parts,
        reply?.replyMessageId ?? null,
        userAttachments
          .filter((a) => a.filePath && a.fileSize)
          .filter((f) => !f.isRAG)
          .map((a) => ({
            id: a.id,
            type: a.fileType,
            fileName: a.fileName,
            filePath: a.filePath,
            fileSize: a.fileSize as number,
          })),
      );

      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "sendUserMessages",
          newMessage,
        });
      }

      if (
        chatSetting.ChatWith.value === "ai" ||
        reply?.replyRole === "assistant"
      ) {
        reload();
      }

      setReply(null);
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
      }
      e.currentTarget.reset();
      setAtt([]);
    },
    [
      att,
      avatarUrl,
      chatId,
      chatSetting.ChatWith.value,
      chatSetting.selectModel,
      memoPlan.featuresPlan.imageGenerations,
      memoPlan.featuresPlan.isActive,
      memoPlan.subscriptionType,
      plan.featuresPlan.accessModels,
      publicId,
      reload,
      reply,
      setAtt,
      setCompletion,
      setMessages,
      userId,
      username,
    ],
  );
  const handleSand = useCallback(
    async (text: string) => {
      if (!memoPlan.featuresPlan.isActive) {
        if (memoPlan.subscriptionType === "free") {
          return toast.warning(
            "You've used all your free credits. Come back tomorrow for a fresh refill or upgrade to keep going!",
          );
        } else {
          return toast.warning(
            "Your credits are finished. Renew your subscription or switch to the free plan for limited access.",
          );
        }
      }
      if (
        !memoPlan.featuresPlan.accessModels.includes(chatSetting.selectModel)
      ) {
        return toast.warning(
          "This model requires a Plus subscription. Please upgrade or select a different model.",
        );
      }
      const textareaValue = text;
      if (!textareaValue.trim()) return;
      setLastMessage(textareaValue);
      setIsSubmitted(true);
      setCompletion("");
      const imagesAtt = att.filter((a) =>
        supportedImagesTypes.includes(a.fileType),
      );

      if (imagesAtt.length > 1 && chatSetting.selectModel === "gpt-4o-mini") {
        return toast.warning(
          "The 'gpt-4o-mini' model supports only one image at a time. Please switch to 'gpt-4o' to analyze multiple images.",
        );
      }

      if (imagesAtt.length > 3) {
        return toast.warning("You can send a maximum of 3 images per request.");
      }
      const textFileContent: { type: "text"; text: string } | undefined =
        att.filter((a) => supportedDocumentTypes.includes(a.fileType)).length >
        0
          ? {
              type: "text",
              text: `[BEGINNING OF DOCUMENT]\n${att
                .filter((a) => supportedDocumentTypes.includes(a.fileType))
                .map((f) => f.text)
                .join("\n")}\n[END OF DOCUMENT]`,
            }
          : undefined;

      const replyMessage: { type: "text"; text: string } | undefined =
        reply?.replyContent
          ? {
              type: "text",
              text: `[The beginning of the message that the user replied to]
${
  reply.replyRole === "assistant"
    ? `Ai message:${reply.replyContent}`
    : ` ${reply.replyUserName ?? ""}
User message: ${reply.replyContent ?? ""}
${reply.userAttachments?.filter((a) => a.fileType === "txt").map((a) => a.text) ?? ""}`
}
[End of the message the user replied to]`,
            }
          : undefined;
      const imagesAttachments = imagesAtt.map((a) => ({
        name: a.fileName,
        contentType: `image/${a.fileType}`,
        url: a.signedUrl,
      }));

      const images = [
        ...(imagesAttachments.length > 0 ? imagesAttachments : []),
      ];
      const attachments: Attachment[] | undefined =
        images.length > 0 ? images : undefined;
      const userAttachments: UserAttachments[] = att.map((a) => ({
        id: uuidv4(),
        fileType: a.fileType,
        filePath: a.filePath,
        signedUrl: a.signedUrl,
        fileSize: a.fileSize,
        fileName: a.fileName,
        text: a.text,
        isRAG: a.isRAG,
      }));

      const parts: { type: "text"; text: string }[] = [
        { type: "text", text: textareaValue },
        {
          type: "text",
          text: `[username]:${username}`,
        },
        replyMessage,
        textFileContent,
      ].filter(Boolean) as { type: "text"; text: string }[];

      const uuid = uuidv4();
      const newMessage = {
        id: uuid,
        avatarUrl: avatarUrl,
        publicId: publicId,
        username: username,
        createdAt: new Date(),
        role: "user",
        replyToMessage: reply
          ? [
              {
                type: "text",
                text: reply.replyContent,
              },
            ]
          : null,
        replyToMessageId: reply ? reply.replyMessageId : null,
        experimental_attachments: attachments,
        userAttachments,
        parts: parts,
      };
      setMessages((prevMessages) => [
        ...prevMessages,
        newMessage as unknown as Message,
      ]);
      saveUserMessage(
        userId,
        uuid,
        chatId,
        parts,
        reply?.replyMessageId ?? null,
        userAttachments
          .filter((a) => a.filePath && a.fileSize)
          .filter((f) => !f.isRAG)
          .map((a) => ({
            id: a.id,
            type: a.fileType,
            fileName: a.fileName,
            filePath: a.filePath,
            fileSize: a.fileSize as number,
          })),
      );

      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "sendUserMessages",
          newMessage,
        });
      }

      if (
        chatSetting.ChatWith.value === "ai" ||
        reply?.replyRole === "assistant"
      ) {
        reload();
      }

      setReply(null);
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
      }
      setAtt([]);
    },
    [
      att,
      avatarUrl,
      chatId,
      chatSetting.ChatWith.value,
      chatSetting.selectModel,
      memoPlan.featuresPlan.accessModels,
      memoPlan.featuresPlan.isActive,
      memoPlan.subscriptionType,
      publicId,
      reload,
      reply,
      setAtt,
      setCompletion,
      setMessages,
      userId,
      username,
    ],
  );
  const completeRef = useRef(complete);

  useEffect(() => {
    completeRef.current = complete;
  }, [complete]);
  const handleCompletion = useCallback(
    (type: "generate_chat_name" | "optimize_prompt", q: string) => {
      const prompt = Prompts.get(type) + q;

      completeRef.current(prompt);
    },
    [],
  );
  useEffect(() => {
    if (q && didInit !== chatId) {
      const decodeQ = decodeURIComponent(q);
      handleSand(decodeQ);
      handleCompletion("generate_chat_name", decodeQ);
      didInit = chatId;
      setNameToNewChat = chatId;
      isNowChat = chatId;
      setQ(null);
    }
  }, [chatId, handleCompletion, handleSand, q, setQ]);

  useEffect(() => {
    if (memoPlan.featuresPlan.realTime && isPublicChat) {
      const channel = supabase.channel(`room-chat-${chatId}`);
      channelRef.current = channel;
      channel.on("broadcast", { event: "sendUserMessages" }, (payload) => {
        const { newMessage } = payload;
        setMessages((prev) => [...prev, newMessage]);
      });
      channel.on("broadcast", { event: "sendAiMessages" }, (payload) => {
        const { newMessage, aiIsStreaming } = payload;
        setAiUserIsStreaming((prev) => {
          return prev
            .map((s) => {
              if (
                s.publicId === aiIsStreaming?.publicId &&
                !aiIsStreaming.isStreaming
              ) {
                return undefined;
              }
              return s;
            })
            .filter((s) => s !== undefined);
        });
        setMessages((prev) => [...prev, newMessage]);
      });
      channel.on("broadcast", { event: "AiResponse" }, (payload) => {
        const { aiIsStreaming } = payload;
        setAiUserIsStreaming((prev) => {
          const alreadyExists = prev.some(
            (u) => u.publicId === aiIsStreaming.publicId,
          );
          return alreadyExists ? prev : [...prev, aiIsStreaming];
        });
      });
      channel.on("broadcast", { event: "errorAiMessages" }, (payload) => {
        const { aiIsStreaming } = payload;
        setAiUserIsStreaming((prev) => {
          return prev
            .map((s) => {
              if (
                s.publicId === aiIsStreaming?.publicId &&
                !aiIsStreaming.isStreaming
              ) {
                return undefined;
              }
              return s;
            })
            .filter((s) => s !== undefined);
        });
      });

      channel.subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [
    chatId,
    isPublicChat,
    memoPlan.featuresPlan.realTime,
    setMessages,
    supabase,
  ]);

  const handleReply = useCallback(
    (reply: Reply) => {
      if (
        att.length +
          (reply.userAttachments ? (reply.userAttachments?.length ?? 0) : 0) >=
        4
      ) {
        return toast.warning(
          "You can only send up to 3 attachments per message.",
        );
      }
      const replyAtt = reply.userAttachments
        ?.filter((a) => a.filePath && a.fileSize && a.url)
        .filter((f) => !att.map((a) => a.filePath).includes(f.filePath!))
        .map((a) => ({
          ...a,
          filePath: a.filePath as string,
          fileSize: a.fileSize as number,
          url: a.url as string,
        }));
      setReply(reply);
      if (replyAtt) {
        setAtt((prev) => [
          ...prev,
          ...replyAtt.map((a) => ({
            fileName: a.fileName,
            filePath: a.filePath,
            fileSize: a.fileSize,
            fileType: a.fileType,
            signedUrl: a.url,
            text: null,
            isRAG: false,
            isReply: true,
          })),
        ]);
      }

      const textarea = textareaRef.current;
      if (textarea) {
        textarea.focus();
      }
    },
    [att, setAtt],
  );
  const handleCloseReplyMessage = () => {
    setReply(null);
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  const handleEnterKey = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (formRef.current) {
          formRef.current.requestSubmit();
        }
      }
    },
    [],
  );

  const handleTextareaChang = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCompletion(e.target.value);
      refCompletion.current = e.target.value;
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    },
    [setCompletion],
  );

  const handleClearAtt = useCallback(
    async (
      url: string,
      filePath: string,
      isRAG: boolean,
      isReply: undefined | boolean,
    ) => {
      setAtt((prev) => prev.filter((p) => p.signedUrl !== url));
      if (!isRAG && !isReply) {
        await supabase.storage
          .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKETS_NAME!)
          .remove([filePath]);
      }
    },
    [setAtt, supabase.storage],
  );

  const handleAtt = useCallback(
    async (att: FileUpload) => {
      const { fileName, filePath, fileSize, fileType, signedUrl, text } = att;
      setAtt([
        {
          fileName,
          filePath,
          fileSize,
          fileType,
          signedUrl,
          text,
          isRAG: false,
        },
      ]);
    },
    [setAtt],
  );

  const handleStopButton = useCallback(() => {
    stop();
    stopCompletion();
    const aiIsStreaming: AiUserIsStreaming = {
      userName: username,
      publicId: publicId,
      avatarUrl: avatarUrl,
      isStreaming: false,
    };
    if (!channelRef.current || !setAiUserIsStreaming.length) return;
    channelRef.current.send({
      type: "broadcast",
      event: "errorAiMessages",
      aiIsStreaming,
    });
  }, [stop, stopCompletion, avatarUrl, publicId, username]);
  const scrollToBottom = useCallback(() => {
    if (refBottom.current) {
      refBottom.current.scrollIntoView({
        behavior: "smooth",
        inline: "start",
      });
    }
  }, []);

  useEffect(() => {
    if (status === "submitted" && refBottom.current) {
      refBottom.current.scrollIntoView({
        behavior: "instant",
        inline: "end",
      });
    }
  }, [status]);
  useEffect(() => {
    if (error != null) {
      const e = error;
      const errorMessage = {
        id: uuidv4(),
        publicId: publicId,
        createdAt: new Date(),
        role: "assistant",
        parts: [{ type: "text", text: e.message }],
        error: error ? true : false,
      };
      setMessages((prev) => [...prev, errorMessage as unknown as Message]);
    }
  }, [error, setMessages, publicId]);

  const handleBeforeunload = () => {
    if (att.length > 0) {
      const data = new Blob(
        [
          JSON.stringify({
            filePiths: [
              ...att
                .filter((a) => a.isRAG === false && !a.isReply)
                .map((a) => a.filePath),
            ],
          }),
        ],
        { type: "application/json" },
      );
      navigator.sendBeacon("/api/delete-att-storage", data);
    }
  };
  useEventListener("beforeunload", handleBeforeunload);
  useEventListener("pagehide", handleBeforeunload);
  const handleCAG = useCallback(
    (att: CAG[]) => {
      setAtt(
        att.map((a) => {
          const { fileName, filePath, fileSize, fileType, text } = a;

          return {
            fileName,
            filePath,
            fileSize,
            fileType,
            signedUrl: "",
            text: text,
            isRAG: false,
          };
        }),
      );
    },
    [setAtt],
  );

  const handelOptimizePrompt = useCallback(async () => {
    if (refCompletion.current) {
      handleCompletion("optimize_prompt", refCompletion.current);
    }
  }, [handleCompletion]);

  const handelPasteLastMessage = useCallback(() => {
    if (!lastMessage) return;
    setCompletion(lastMessage);
  }, [lastMessage, setCompletion]);

  return (
    <div className="relative flex h-svh w-full flex-col items-center">
      <MessageList
        messages={messages as unknown as chatHistoryProps[]}
        publicId={publicId}
        chatId={chatId}
        onReply={handleReply}
        isSubmitted={status === "submitted"}
        scrollToBottom={isSubmitted}
        refBottom={refBottom}
        aiIsUserStreaming={aiIsUserStreaming}
      />
      <div className="absolute bottom-0 z-10 flex w-[90%] min-w-72 max-w-[50rem] flex-col items-center">
        <div className="relative h-full w-full space-y-4">
          <AnimatePresence>
            {!isInView ? (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.2,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.2,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                }}
                className="relative bottom-4 flex items-start justify-center"
              >
                <Button
                  onClick={() => scrollToBottom()}
                  size={"icon"}
                  variant={"outline"}
                  aria-label="Scroll to bottom"
                >
                  <ArrowDown />
                </Button>
              </motion.div>
            ) : (
              <div />
            )}
          </AnimatePresence>
          <ViewUploadedAtt att={att} onClearAtt={handleClearAtt} />
        </div>
        <div className="z-20 flex w-full flex-col gap-2 rounded-lg rounded-b-none border border-b-0 bg-[#f3f4f6] px-2 py-3 shadow-md dark:bg-[#0b111f]">
          <ReplyMessage
            reply={reply}
            closeReplyMessage={handleCloseReplyMessage}
          />
          {is_anonymous ? (
            <Header disabledPasteLastMessage disabledOptimizePrompt />
          ) : (
            <Header
              disabledPasteLastMessage={isLoading || !lastMessage}
              onPasteLastMessage={handelPasteLastMessage}
              disabledOptimizePrompt={
                isLoading || completion.length < 10 || completion.length > 1000
              }
              onOptimizePrompt={handelOptimizePrompt}
            />
          )}

          <form onSubmit={handleSubmit} ref={formRef}>
            <textarea
              readOnly={isLoading}
              autoFocus
              name="input"
              rows={2}
              id="chat-input"
              ref={textareaRef}
              dir="auto"
              value={!setNameToNewChat ? completion : undefined}
              placeholder="Type your message here..."
              className="max-h-60 w-full resize-none bg-transparent text-base leading-6 outline-none disabled:opacity-0"
              onKeyDown={handleEnterKey}
              onChange={handleTextareaChang}
            ></textarea>

            <div dir="ltr" className="flex items-center gap-3">
              <Footer
                onCAG={handleCAG}
                plan={memoPlan}
                is_anonymous={is_anonymous}
                userId={userId}
                setAtt={handleAtt}
              />
              {status === "submitted" || status === "streaming" || isLoading ? (
                <Button
                  variant={"secondary"}
                  type="button"
                  aria-label="stop"
                  className="ml-auto rounded-3xl bg-primary hover:bg-primary [&_svg]:size-6"
                  size={"icon"}
                  onClick={handleStopButton}
                >
                  <StopFill />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="ml-auto rounded-3xl [&_svg]:size-5"
                  size={"icon"}
                  aria-label="submit"
                  disabled={isLoading}
                >
                  <Send />
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});
