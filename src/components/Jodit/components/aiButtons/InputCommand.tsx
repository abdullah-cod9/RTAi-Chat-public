import React, { ChangeEvent, memo, RefObject, useEffect, useState } from "react";
import _ from "lodash";
import { Button } from "@/components/ui/button";
import ButtonWithTextarea from "../ui/ButtonWithTextarea";
import type { Jodit } from "jodit-react";
import { InsertText } from "../../lib/insertText";
import { Status } from "@/lib/consts";
import { toast } from "sonner";
import { useCompletion } from "@ai-sdk/react";
import { Pencil } from "lucide-react";
import { CardText } from "react-bootstrap-icons";
import { chiackUserPlan } from "@/app/actions/db/actions";

type Props = {
  onEditor: RefObject<Jodit>;
  disabled: boolean;
  onDisabled: (id: "translate" | `quizButton`) => void;
  onReset: () => void;
  responsePosition: Status;
  responseLanguage: Status;
  responseColour: Status;
  textTopic: Status;
  models: Status;userId: string;
};

export default memo(function InputCommand({
  onEditor,
  disabled,
  onDisabled,
  onReset,
  responsePosition,
  responseLanguage,
  responseColour,
  textTopic,
  models,userId,
}: Props) {
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [oldText, setOldText] = useState<string>("");
  const [command, setCommand] = useState<string>("");
  const [saveCommand, setSaveCommand] = useState<string>("");

  const editor = onEditor.current;
  const tempElement = document.createElement("div");

  const { completion, complete, isLoading, stop } = useCompletion({
    api: "/api/aiEditorCommands",
    body: {
      responseLanguage: responseLanguage.value,
      models: models.value,userId:userId,
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
  const handleChangeCommand = (c: ChangeEvent<HTMLTextAreaElement>) => {
    setCommand(c.target.value);
  };
  const handleSaveCommand = () => {
    setSaveCommand(command);
  };
  const handelInsertText = async () => {
    tempElement.innerHTML = editor.s.html;
    const plainText = tempElement.textContent || tempElement.innerText || "";

    if (!plainText.trim()) {
      return toast.warning("Please select some text first.");
    }
    const textLength = plainText.length + saveCommand.length;
    if (textLength > 1000) {
      return toast.warning(
        `The combined length of the selected text and the entered command must not exceed 1,000 characters. Please reduce the selected text or shorten the command.`,
      );
    }
    if (!onEditor.current) {
      throw new Error("onEditor.current is null");
    }
    setIsFirstTime(true);
    onDisabled(`translate`);

    try {
      await complete(`Execute the USER PROMPT on the provided TEXT BLOCK
[START USER PROMPT]
${saveCommand}, ${textTopic.value === "general" ? "" : `keeping in mind that the topic is ${textTopic.value}. Use terminology and tone suitable for this domain.`}
[END USER PROMPT]

[START TEXT BLOCK]
${plainText}
[END TEXT BLOCK]

If the USER PROMPT seems unclear or ambiguous, generate a polite and concise message asking the user to clarify their request.
`);
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
            className="w-[52px] rounded-none text-primary hover:text-primary [&_svg]:size-5"
            onClick={() => {
              stop();
              onReset();
            }}
            disabled={!isLoading}
          >
           
              <Pencil />
          </Button>
        ) : (
          <ButtonWithTextarea
            onClick={handelInsertText}
            tooltipContent="Your prompt"
            disabled={disabled || !saveCommand.trim()}
            onChange={handleChangeCommand}
            value={command}
            onSave={handleSaveCommand}
            onClose={() => setCommand(saveCommand)}
          >
            <CardText />
          </ButtonWithTextarea>
        )}
      
    </div>
  );
}
)