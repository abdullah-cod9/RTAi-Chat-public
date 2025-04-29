import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { MemoizedMarkdown } from "./MarkdownRenderer";

export default memo(function ReasoningText({
  content,
  id,
}: {
  content: string;
  id: string;
}) {
  const t = useTranslations("Chat.messageUi");
  return (
    <div>
      <Accordion
        type="single"
        collapsible
        className="w-full rounded-md bg-muted p-1 px-2 dark:bg-muted/30 "
      >
        <AccordionItem value="item-1" className="border-0 ">
          <AccordionTrigger dir="auto">
            {t("reasoningText.title")}
          </AccordionTrigger>
          <AccordionContent>
            <MemoizedMarkdown content={content} id={id} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
});
