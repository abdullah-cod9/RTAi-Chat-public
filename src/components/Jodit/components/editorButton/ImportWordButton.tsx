import { Button } from "@/components/ui/button";
import React, { memo, RefObject } from "react";
import type { Jodit } from "jodit-react";
import TooltipButton from "@/components/ui/myButtons/TooltipButton";
import mammoth from "mammoth";
import { FileWord } from "react-bootstrap-icons";

type Props = {
  jodit: RefObject<Jodit>;
  handleWordImport: (html: string) => void;
};

export default memo(function ImportWordButton({
  jodit,
  handleWordImport,

}: Props) {
  const handleClick = async () => {
    // const res = await reteLimitByUserId(userId, 2);
    // if (!res.success) {
    //   return toast.error(
    //     "Too Many Requests. You can only request this action up to 5 times per minute.",
    //   );
    // }
    const input = document.createElement("input");
    input.type = "file";
    input.accept =
      ".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        if (!jodit.current) {
          throw new Error("jodit.current is null");
        }
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = async (event) => {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const html = await mammoth.convertToHtml({ arrayBuffer });

          if (html) {
            // jodit.current.setEditorValue(html.value);
            handleWordImport(html.value);
          }
        };

        reader.readAsArrayBuffer(file);
      }
    };
    input.click();
  };
  return (
    <div>
      <TooltipButton tooltipContent="Import word" side="right">
        <Button
          size={"icon"}
          variant="ghost"
          className="w-[52px] rounded-none border-b text-foreground [&_svg]:size-5"
          onClick={handleClick}
        >
          <FileWord />
        </Button>
      </TooltipButton>
    </div>
  );
}
)