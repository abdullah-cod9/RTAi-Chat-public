import DeleteAccount from "@/components/auth/DeleteAccount";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

type Props = {
  username: string
  email: string
  publicId: string
  userId: string
};

export default function Account({email, publicId, username, userId }: Props) {
  
  const [, copy] = useCopyToClipboard();
  const t = useTranslations("Chat.settings.Account");
  const handleCopy = async (text: string) => {
    await copy(text)
      .then(() => {
        toast.success("Copied message to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy message to clipboard");
      });
  };
  return (
    <div dir="auto" className="mt-5 flex w-full flex-col gap-2">
      <p className="flex w-full items-center justify-between py-3">
        <span>{t('username')}</span>
        <span>{username}</span>
      </p>
      <p className="flex w-full items-center justify-between py-3">
        <span>{t('email')}</span>
        <span>{email}</span>
      </p>
      <div className="flex w-full items-center justify-between py-3">
        <p >{t("UserId")}</p>
        <Button
          onClick={() => handleCopy(publicId)}
          aria-label="Copy user ID to clipboard"
          variant="outline"
          size={"icon"}
        >
          <Copy />
        </Button>
      </div>
      <div dir="auto" className="flex w-full items-center justify-between py-3">
        <p>{t("deleteAccount")}</p>
        <DeleteAccount userId={userId} />
      </div>
    </div>
  );
}
