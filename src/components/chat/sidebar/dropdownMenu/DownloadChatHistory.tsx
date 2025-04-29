import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { FiletypePdf } from "react-bootstrap-icons";
import { toast } from "sonner";

type Props = {
  chatId: string;
  chatName: string;
};

export default function DownloadChatHistory({
  chatId,
  chatName,
  
}: Props) {
  const t = useTranslations('Chat.sidebar.content.dropdownMenu.downloadChatHistory')
  const [isPending, setIsPending] = useState<boolean>(false);

  const handelOnClick = async () => {
    setIsPending(true);
    try {
      const getPdf = await fetch("/api/generatePDF", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId }),
      });
      if (getPdf.ok) {
        const blob = await getPdf.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${chatName}.pdf`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error(getPdf.statusText);
      }
    } catch (error) {
      console.log(error);

      toast.error(t('toast_error'));
    }
    setIsPending(false);
  };

  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      className="h-fit w-full justify-start gap-3 p-2 text-start"
      onClick={handelOnClick}
      disabled={isPending}
    >
      <FiletypePdf />
      {isPending ? (
        <span>{t('button.m1')}</span>
      ) : (
        <span>{t('button.m2')}</span>
      )}
    </Button>
  );
}
