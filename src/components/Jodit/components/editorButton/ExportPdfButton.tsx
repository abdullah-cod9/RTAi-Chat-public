import React, { memo, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { isMob } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ExportPdfPlugin } from "../../plugins/ExportPdfPlugin";
import TooltipButton from "@/components/ui/myButtons/TooltipButton";
import { toast } from "sonner";
import { FilePdf } from "react-bootstrap-icons";
import { useTranslations } from "next-intl";
type Props = {
  editorData: string;
};

export default memo(function ExportPdfButton({ editorData }: Props) {
  const t = useTranslations("Chat.jodit");
  const [open, setOpen] = React.useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [pdfName, setPdfName] = useState<string>("");
  useEffect(() => {
    const handleClick = () => {
      setIsDesktop(!isMob());
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editorData.trim().length < 23) {
      return toast.warning("No content in editor to export.");
    }

    if (pdfName) {
      const res = await ExportPdfPlugin(editorData || "", pdfName);
      if (res) {
        return toast.error(
          res.error.message +
            ". You can only request this action up to 5 times per minute.",
        );
      }
    }
    setPdfName("");
    setOpen(false);
  };
  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <TooltipButton side="left" tooltipContent="Export pdf">
            <Button
              size={"icon"}
              variant="ghost"
              className="w-[52px] rounded-none border-b text-foreground [&_svg]:size-5"
            >
              <FilePdf />
            </Button>
          </TooltipButton>
        </PopoverTrigger>

        <PopoverContent className="w-fit p-0" align="start" side="left">
          <form
            className="flex flex-col gap-2 p-2 md:w-60"
            onSubmit={handleSubmit}
          >
            <Input
              onChange={(e) => setPdfName(e.target.value)}
              value={pdfName}
              type="text"
              placeholder="Pdf name"
            />
            <Button
              className="ml-auto"
              type="submit"
              disabled={!pdfName.trim()}
            >
              {t("exportPdfButton.download")}
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          size={"icon"}
          variant="ghost"
          className="w-[52px] rounded-none border-y border-border bg-background text-foreground [&_svg]:size-5"
        >
          <FilePdf />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle className="sr-only"></DrawerTitle>
          <DrawerDescription className="sr-only"></DrawerDescription>
        </DrawerHeader>
        <form className="flex flex-col gap-2 p-2" onSubmit={handleSubmit}>
          <Input
            onChange={(e) => setPdfName(e.target.value)}
            value={pdfName}
            type="text"
            placeholder="Pdf name"
          />
          <Button className="ml-auto" type="submit" disabled={!pdfName.trim()}>
            {t("exportPdfButton.download")}
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
});
