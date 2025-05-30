import React, { memo, RefObject, useEffect, useState } from "react";
import _ from "lodash";
import ButtonWithList from "../ui/ButtonWithList";
import { Button } from "@/components/ui/button";
import { questionPattern, Status } from "@/lib/consts";
import { MAX_NUMBER_CHARACTERS } from "../../plugins/AiPlugins";
import type { Jodit } from "jodit-react";
import { InsertText } from "../../lib/insertText";
import { toast } from "sonner";
import { useCompletion } from "@ai-sdk/react";
import { JournalBookmarkFill } from "react-bootstrap-icons";
import { Pencil } from "lucide-react";
import { chiackUserPlan } from "@/app/actions/db/actions";

type Props = {
  onEditor: RefObject<Jodit>;
  disabled: boolean;
  onDisabled: (id: `quizButton`) => void;
  onReset: () => void;
  responsePosition: Status;
  responseLanguage: Status;
  responseColour: Status;
  textTopic: Status;
  models: Status;
  onSave2LocalStorage: (value: Status, id: string) => void;
  saveValue: Status;userId: string;

};

export default memo(function QuizButton({
  onEditor,
  disabled,
  onDisabled,
  onReset,
  responsePosition,
  responseLanguage,
  responseColour,
  textTopic,
  models,
  onSave2LocalStorage,
  saveValue,userId,
}: Props) {
  const [selectedStatus, setSelectedStatus] = useState<Status>(
    saveValue || questionPattern[0],
  );
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [oldText, setOldText] = useState<string>("");
  const editor = onEditor.current;
  const tempElement = document.createElement("div");
  const { completion, complete, isLoading, stop } = useCompletion({
    api: "/api/aiEditorCommands",
    body: {
      responseLanguage: responseLanguage.value,
      models: models.value,
      userId:userId,
    },
    onFinish: async () => {
         onReset();
         await chiackUserPlan(userId)
       },
    onError: () => {
      onReset();
      toast.error(`Something went wrong.`);
    },
  });

  const handleChing = (e: Status) => {
    setSelectedStatus(e);
    onSave2LocalStorage(e, "quizButton");
  };
  const handelInsertText = async () => {
    tempElement.innerHTML = editor.s.html;
    const plainText = tempElement.textContent || tempElement.innerText || "";

    if (!plainText.trim()) {
      return toast.warning("Please select some text first.");
    }
    if (plainText.length > 2300) {
      return toast.warning(
        `The selected text cannot exceed ${MAX_NUMBER_CHARACTERS} characters.`,
      );
    }
    if (!editor) {
      console.error("editor is null");
      return;
    }
    setIsFirstTime(true);
    onDisabled(`quizButton`);
    try {
      await complete(
        `Execute the USER PROMPT on the provided TEXT BLOCK,
[START USER PROMPT]
Create ${selectedStatus.value} questions from the provided TEXT BLOCK and include concise answers at the end, ${textTopic.value === "general" ? "" : `keeping in mind that the topic is ${textTopic.value}. Use terminology and tone suitable for this domain,`}
Keep the answers short and relevant.
[END USER PROMPT]

[START TEXT BLOCK]
${plainText}
[END TEXT BLOCK]
`,
      );
    } catch (error) {
      console.error("Error while inserting text:", error);
      toast.error(`Something went wrong.`);
    }
  };

  useEffect(() => {
    const escapedRes = _.escapeRegExp(oldText);
    const updatedCompletion = _.replace(
      completion,
      new RegExp(escapedRes, "g"),
      "",
    );

    if (updatedCompletion && editor && completion !== oldText) {
      InsertText(
        updatedCompletion,
        editor,
        responsePosition.value,
        responseColour.value,
        isFirstTime,
        setIsFirstTime,
      );
      setOldText(completion);
    }
  }, [
    completion,
    editor,
    isFirstTime,
    oldText,
    responseColour.value,
    responsePosition.value,
  ]);

  return (
    <div className="flex w-[52px] border-b">

        {isLoading ? (
          <Button
            variant="ghost"
            size={"icon"}
            className="w-[52px] rounded-none text-primary [&_svg]:size-5"
            onClick={() => {
              stop();
              onReset();
            }}
            disabled={!isLoading}
          >
     
            
              <Pencil />
           
          </Button>
        ) : (
          <ButtonWithList
            onClick={handelInsertText}
            selectedStatus={selectedStatus}
            setSelectedStatus={handleChing}
            statuses={questionPattern}
            drawerTitle="Question pattern"
            tooltipContent="Generate questions"
            disabled={disabled}
            disableSearch
          >
            <JournalBookmarkFill />
          </ButtonWithList>
        )}
 
    </div>
  );
}
)