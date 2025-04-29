import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

export function AccordionNewChat() {
  const t = useTranslations("Chat.newChat.accordionNewChat");
  return (
    <div dir="auto">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>{t("item1.trigger")}</AccordionTrigger>
          <AccordionContent>{t("item1.content")}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>{t("item2.trigger")}</AccordionTrigger>
          <AccordionContent>{t("item2.content")}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>{t("item3.trigger")}</AccordionTrigger>
          <AccordionContent>{t("item3.content")}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>{t("item4.trigger")}</AccordionTrigger>
          <AccordionContent>{t("item4.content")}</AccordionContent>
        </AccordionItem>
      </Accordion>

      <p dir="auto" className="mt-6 text-center text-sm text-muted-foreground">
        {t("footer")}
      </p>
    </div>
  );
}
