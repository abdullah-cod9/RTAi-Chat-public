import React, { memo, useCallback, useEffect, useState } from "react";
import TranslateButton from "../components/aiButtons/TranslateButton";
import QuizButton from "../components/aiButtons/QuizButton";
import SettingsButton from "../components/aiButtons/SettingsButton";
import { standardColors, Status } from "@/lib/consts";
import { useTheme } from "next-themes";
import InputCommand from "../components/aiButtons/InputCommand";
import EditTextButton from "../components/aiButtons/EditTextButton";
import SwitchToneButton from "../components/aiButtons/SwitchToneButton";
import ImportWordButton from "../components/editorButton/ImportWordButton";
import type { Jodit } from "jodit-react";
import ExportPdfButton from "../components/editorButton/ExportPdfButton";
import TooltipButton from "@/components/ui/myButtons/TooltipButton";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "usehooks-ts";
import { toast } from "sonner";
import { Copy, LucideEraser } from "lucide-react";
import { useRouter } from "next/navigation";

export const MAX_NUMBER_CHARACTERS = "2,300";
type Props = {
  onEditor: React.RefObject<Jodit>;
  handleWordImport: (html: string) => void;
  editorData: string;
  userId: string;
  handleClearAll: () => void;
};
export type ButtonsId = {
  id:
    | "translate"
    | `quizButton`
    | "InputCommand"
    | "switchToneButton"
    | "editTextOptions";
  status: boolean;
};
const buttonsId: ButtonsId[] = [
  {
    id: `translate`,
    status: false,
  },
  {
    id: `quizButton`,
    status: false,
  },
  {
    id: `InputCommand`,
    status: false,
  },
  {
    id: `editTextOptions`,
    status: false,
  },
  {
    id: `switchToneButton`,
    status: false,
  },
];

const aiEditorSitting = {
  translationLanguage: { value: "english", label: "English" },
  questionPattern: { value: "true/false", label: "True/False" },
  editTextOptions: { value: "Summarize the text", label: "Summarize" },
  switchToneButton: { value: "academic", label: "Academic" },
  responseSettings: {
    responseLanguage: { value: "auto", label: "Auto" },
    responsePosition: { value: "under", label: "Under selected text" },
    responseColour: {
      value: "rgb(0, 0, 0)",
      label: "Black",
      color: "rgb(0, 0, 0)",
    },
    textTopic: { value: "general", label: "General" },
    aiModels: { value: "gpt-4o-mini", label: "gpt-4o-mini" },
  },
};

export default memo(function AiPlugins({
  onEditor,
  handleWordImport,
  editorData,userId,
  handleClearAll,
}: Props) {
  const [, copy] = useCopyToClipboard();
  const router = useRouter();
  const { theme } = useTheme();
  const [aiEditorSittingData, setAiEditorSittingData] = useState(() => {
    const storedAiEditorSitting = localStorage.getItem("aiEditorSitting");
    if (storedAiEditorSitting) {
      return JSON.parse(storedAiEditorSitting);
    } else {
      return aiEditorSitting;
    }
  });
  const [isDisabled, setIsDisabled] = useState<ButtonsId[]>(buttonsId);
  const [responseLanguage, setResponseLanguage] = useState<Status>(
    aiEditorSittingData.responseSettings.responseLanguage,
  );
  const [responsePosition, setResponsePosition] = useState<Status>(
    aiEditorSittingData.responseSettings.responsePosition,
  );
  const [responseColour, setResponseColour] = useState<Status>(
    aiEditorSittingData.responseSettings.responseColour,
  );
  const [textTopic, setTextTopic] = useState<Status>(
    aiEditorSittingData.responseSettings.textTopic,
  );
  const [models, setModels] = useState<Status>(
    aiEditorSittingData.responseSettings.aiModels,
  );
  useEffect(() => {
    if (
      aiEditorSittingData.responseSettings.responseColour.label === "White" ||
      aiEditorSittingData.responseSettings.responseColour.label === "Black"
    ) {
      setResponseColour(
        theme === "dark" ? standardColors[7] : standardColors[6],
      );
    }
  }, [aiEditorSittingData.responseSettings.responseColour.label, theme]);
  const tempElement = document.createElement("div");

  const onSave2LocalStorage = useCallback(
    (value: Status, id: string) => {
      const updatedSitting = {
        translationLanguage:
          id === "translate" ? value : aiEditorSittingData.translationLanguage,
        questionPattern:
          id === "quizButton" ? value : aiEditorSittingData.questionPattern,
        editTextOptions:
          id === "editTextOptions"
            ? value
            : aiEditorSittingData.editTextOptions,
        textToneOptions:
          id === "SwitchToneButton"
            ? value
            : aiEditorSittingData.textToneOptions,
        responseSettings: {
          responseLanguage:
            id === "responseLanguage"
              ? value
              : aiEditorSittingData.responseSettings.responseLanguage,
          responsePosition:
            id === "responsePosition"
              ? value
              : aiEditorSittingData.responseSettings.responsePosition,
          responseColour:
            id === "responseColour"
              ? value
              : aiEditorSittingData.responseSettings.responseColour,
          textTopic:
            id === "textTopic"
              ? value
              : aiEditorSittingData.responseSettings.textTopic,
          aiModels:
            id === "models"
              ? value
              : aiEditorSittingData.responseSettings.aiModels,
        },
      };
      localStorage.setItem("aiEditorSitting", JSON.stringify(updatedSitting));
      setAiEditorSittingData(updatedSitting);
    },
    [
      aiEditorSittingData.editTextOptions,
      aiEditorSittingData.questionPattern,
      aiEditorSittingData.responseSettings.aiModels,
      aiEditorSittingData.responseSettings.responseColour,
      aiEditorSittingData.responseSettings.responseLanguage,
      aiEditorSittingData.responseSettings.responsePosition,
      aiEditorSittingData.responseSettings.textTopic,
      aiEditorSittingData.textToneOptions,
      aiEditorSittingData.translationLanguage,
    ],
  );

  const handleDisable = useCallback(() => {
    const d = isDisabled.map((b) => ({
      id: b.id,
      status: true,
    }));
    setIsDisabled(d);
  }, [isDisabled]);
  const handleEnable = useCallback(() => {
    router.refresh();
    const d = isDisabled.map((b) => ({
      id: b.id,
      status: false,
    }));
    setIsDisabled(d);
  }, [isDisabled, router]);
  const handleResponseLanguage = useCallback(
    (r: Status) => {
      setResponseLanguage(r);
      onSave2LocalStorage(r, "responseLanguage");
    },
    [onSave2LocalStorage],
  );
  const handleResponsePosition = useCallback(
    (r: Status) => {
      setResponsePosition(r);
      onSave2LocalStorage(r, "responsePosition");
    },
    [onSave2LocalStorage],
  );
  const handleResponseColour = useCallback(
    (r: Status) => {
      setResponseColour(r);
      onSave2LocalStorage(r, "responseColour");
    },
    [onSave2LocalStorage],
  );
  const handleTextTopic = useCallback(
    (r: Status) => {
      setTextTopic(r);
      onSave2LocalStorage(r, "textTopic");
    },
    [onSave2LocalStorage],
  );
  const handletModels = useCallback(
    (r: Status) => {
      setModels(r);
      onSave2LocalStorage(r, "models");
    },
    [onSave2LocalStorage],
  );
  const handleCopyAll = useCallback(async () => {
    const html = editorData ?? onEditor.current.getEditorValue();
    tempElement.innerHTML = html;
    const plainText = tempElement.textContent || tempElement.innerText || "";
    await copy(plainText)
      .then(() => {
        toast.success("Copied message to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy message to clipboard");
      });
  }, [copy, editorData, onEditor, tempElement]);

  return (
    <div className="sticky">
      <div className="flex w-fit flex-col items-center justify-center rounded-md border">
        <TranslateButton
          onEditor={onEditor}
          disabled={
            (isDisabled.find((b) => b.id === "translate") as ButtonsId).status
          }
          onDisabled={handleDisable}
          onReset={handleEnable}
          models={models}
          responseColour={responseColour}
          responseLanguage={responseLanguage}
          responsePosition={responsePosition}
          textTopic={textTopic}
          onSave2LocalStorage={onSave2LocalStorage}
          saveValue={aiEditorSittingData.translationLanguage}userId={userId}
        />
        <QuizButton
          onEditor={onEditor} userId={userId}
          disabled={
            (isDisabled.find((b) => b.id === "quizButton") as ButtonsId).status
          }
          onDisabled={handleDisable}
          onReset={handleEnable}
          models={models}
          responseColour={responseColour}
          responseLanguage={responseLanguage}
          responsePosition={responsePosition}
          textTopic={textTopic}
          onSave2LocalStorage={onSave2LocalStorage}
          saveValue={aiEditorSittingData.questionPattern}
        />
        <EditTextButton
          onEditor={onEditor} userId={userId}
          disabled={
            (isDisabled.find((b) => b.id === "editTextOptions") as ButtonsId)
              .status
          }
          onDisabled={handleDisable}
          onReset={handleEnable}
          models={models}
          responseColour={responseColour}
          responseLanguage={responseLanguage}
          responsePosition={responsePosition}
          textTopic={textTopic}
          onSave2LocalStorage={onSave2LocalStorage}
          saveValue={aiEditorSittingData.editTextOptions}
        />
        <SwitchToneButton
          onEditor={onEditor}userId={userId}
          disabled={
            (isDisabled.find((b) => b.id === "switchToneButton") as ButtonsId)
              .status
          }
          onDisabled={handleDisable}
          onReset={handleEnable}
          models={models}
          responseColour={responseColour}
          responseLanguage={responseLanguage}
          responsePosition={responsePosition}
          textTopic={textTopic}
          onSave2LocalStorage={onSave2LocalStorage}
          saveValue={aiEditorSittingData.switchToneButton}
        />
        <InputCommand
          onEditor={onEditor}userId={userId}
          disabled={
            (isDisabled.find((b) => b.id === "InputCommand") as ButtonsId)
              .status
          }
          onDisabled={handleDisable}
          onReset={handleEnable}
          models={models}
          responseColour={responseColour}
          responseLanguage={responseLanguage}
          responsePosition={responsePosition}
          textTopic={textTopic}
        />
        <ExportPdfButton editorData={editorData} />
        <ImportWordButton
          jodit={onEditor}
          handleWordImport={handleWordImport}
        />
        <TooltipButton tooltipContent="Copy all" side="left">
          <Button
            size={"icon"}
            variant="ghost"
            className="w-[52px] rounded-none border-b text-foreground"
            onClick={handleCopyAll}
          >
            <Copy />
          </Button>
        </TooltipButton>
        <TooltipButton tooltipContent="Clear all" side="left">
          <Button
            size={"icon"}
            variant="ghost"
            className="w-[52px] rounded-none border-b text-foreground [&_svg]:size-5"
            onClick={handleClearAll}
          >
            <LucideEraser />
          </Button>
        </TooltipButton>
        <SettingsButton
          responseLanguage={responseLanguage}
          setResponseLanguage={handleResponseLanguage}
          responsePosition={responsePosition}
          setResponsePosition={handleResponsePosition}
          responseColour={responseColour}
          setResponseColour={handleResponseColour}
          textTopic={textTopic}
          setTextTopic={handleTextTopic}
          models={models}
          setModels={handletModels}
        />
      </div>
    </div>
  );
}
)