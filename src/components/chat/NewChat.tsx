"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { ChatWithOption, Languages, Status } from "@/lib/consts";
import SelectModel from "./chatSetting/SelectModel";
import {
  chiackUserPlan,
  createChat,
  Plan,
  UsersDb,
} from "@/app/actions/db/actions";
import { SkeletonNewChat } from "../SkeletonLoad";
import { useQueryState } from "nuqs";
import Settings from "./settings/Settings";
import { useLocalStorage } from "usehooks-ts";
import { ModelsType, reasoningModels } from "@/models/settings";
import ReasoningEffort, { ReasoningEffortType } from "./chatUi/ReasoningEffort";
import { toast } from "sonner";
import Link from "next/link";
import { useCompletion } from "@ai-sdk/react";
import Header from "./chatUi/header/Header";
import { Prompts } from "@/models/prompts";
import { StopFill } from "react-bootstrap-icons";
import { AccordionNewChat } from "./AccordionNewChat";
import { useTranslations } from "next-intl";

type Props = {
  plan: Plan;
  userData: UsersDb;
  is_anonymous: boolean;
};
let didInit = false;

export function NewChat({ plan, userData, is_anonymous }: Props) {
  const { userId } = useMemo(() => userData, [userData]);
  const memoPlan = useMemo(() => plan, [plan]);
  const t = useTranslations("Chat.newChat.agreementMessage");
  const [openSetting, setSetting] = useQueryState("setting");
  const [q] = useQueryState("q");
  const formRef = useRef<HTMLFormElement>(null);
  const [chatSetting, setChatSetting] = useLocalStorage<{
    ResponseLanguage: Status;
    ChatWith: Status;
    selectModel: ModelsType;
    selectedEffort: ReasoningEffortType;
  }>("chat-setting", {
    ResponseLanguage: Languages[0],
    ChatWith: ChatWithOption[0],
    selectModel: "gpt-4o-mini",
    selectedEffort: "low",
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [value, setValue] = useLocalStorage("welcome-to-rtai", true);
  const searchParams = useSearchParams();
  const { avatarUrl } = useMemo(() => userData, [userData]);
  const refCompletion = useRef<string>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const {
    completion,
    complete,
    setCompletion,
    isLoading,
    stop: stopCompletion,
  } = useCompletion({
    api: "/api/completion",
    body: {
      planType: memoPlan.subscriptionType,
      userId: userId,
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onFinish: async () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
      await chiackUserPlan(userId);
    },
  });
  useEffect(() => {
    if (q && !didInit && formRef.current) {
      const input = formRef.current.elements.namedItem(
        "input",
      ) as HTMLTextAreaElement;
      input.value = q;
      formRef.current.requestSubmit();

      didInit = true;
    }
  }, [q, searchParams]);
  useEffect(() => {
    if (linkRef.current && openSetting && is_anonymous) {
      linkRef.current.click();
      setSetting(null);
    }
  }, [is_anonymous, openSetting, setSetting]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!memoPlan.featuresPlan.isActive) {
      return toast.warning(`You've used all your available tokens.`);
    }
    const formData = new FormData(e.currentTarget);
    const textareaValue = formData.get("input") as string;
    if (!textareaValue.trim()) return;
    setValue(false);
    setIsSubmitting(true);
    setCompletion("");

    setQuestion(textareaValue);
    e.currentTarget.reset();
    const res = await createChat(userId, textareaValue);
    if (res && res.error) {
      return toast.error(res.error.message);
    }
    setIsSubmitting(false);
    setQuestion(null);
  };

  const handleTextareaChang = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCompletion(e.target.value);
    refCompletion.current = e.target.value;
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };
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
  const handelOptimizePrompt = useCallback(async () => {
    if (refCompletion.current) {
      handleCompletion("optimize_prompt", refCompletion.current);
    }
  }, [handleCompletion]);
  const handleStopButton = useCallback(() => {
    stopCompletion();
  }, [stopCompletion]);

  if (openSetting && !is_anonymous) {
    return <Settings plan={plan} userData={userData} />;
  }

  return (
    <div className="relative flex h-svh w-full flex-col items-center">
      {question && (
        <SkeletonNewChat
          avatarUrl={avatarUrl}
          userName={userData.username}
          text={question}
        />
      )}
      <div className="absolute bottom-0 z-10 flex w-[90%] min-w-72 max-w-[50rem] flex-col items-center">
        {value && (
          <div
            dir="auto"
            className="mb-3 rounded-sm bg-muted/50 p-2 text-sm shadow-md"
          >
            {t("message")}{" "}
            <Link
              target="_blank"
              prefetch
              className="text-primary"
              href={"/terms-of-service"}
            >
              {t("terms")}
            </Link>{" "}
            {t("and")}{" "}
            <Link
              target="_blank"
              prefetch
              className="text-primary"
              href={"/privacy-policy"}
            >
              {t("privacyPolicy")}
            </Link>
          </div>
        )}
        <div className="z-20 flex w-full flex-col gap-1 rounded-lg rounded-b-none border border-b-0 bg-[#f3f4f6] px-2 py-3 dark:bg-[#0b111f]">
          {is_anonymous ? (
            <Header disabledPasteLastMessage disabledOptimizePrompt />
          ) : (
            <Header
              disabledPasteLastMessage
              disabledOptimizePrompt={
                isLoading ||
                completion.trim().length < 10 ||
                completion.trim().length > 1000
              }
              onOptimizePrompt={handelOptimizePrompt}
            />
          )}
          <form onSubmit={handleSubmit} ref={formRef}>
            <textarea
              name="input"
              id="chat-input"
              ref={textareaRef}
              dir="auto"
              value={completion}
              placeholder="Type your message here..."
              className="max-h-60 w-full resize-none bg-transparent text-base leading-6 outline-none disabled:opacity-0"
              onKeyDown={handleEnterKey}
              onChange={handleTextareaChang}
            ></textarea>

            <div dir="ltr" className="flex items-center gap-3">
              <SelectModel
                onSelectModel={handleSelectModel}
                selectValue={chatSetting.selectModel}
                plan={memoPlan}
                is_anonymous={is_anonymous}
              />
              {reasoningModels.some((model) =>
                memoPlan.featuresPlan.accessModels.includes(model),
              ) &&
                reasoningModels.includes(chatSetting.selectModel) && (
                  <ReasoningEffort
                    selectedEffort={chatSetting.selectedEffort}
                    onReasoningEffort={handleSelectEffort}
                  />
                )}
              {isLoading ? (
                <Button
                  variant={"secondary"}
                  type="button"
                  className="ml-auto rounded-3xl shadow-lg [&_svg]:size-6"
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
                  disabled={isSubmitting}
                >
                  <Send />
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
      {value && (
        <div className="absolute top-40 flex h-svh w-full max-w-md justify-center px-3">
          <AccordionNewChat />
        </div>
      )}
      <Link ref={linkRef} className="hidden" prefetch href={"/login"}></Link>
    </div>
  );
}
