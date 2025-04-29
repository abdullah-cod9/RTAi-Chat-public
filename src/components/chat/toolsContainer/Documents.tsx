import React, { useState, useCallback } from "react";
import DialogButton from "../../ui/myButtons/DialogButton";
import { Button } from "../../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command";
import { cn, gatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getRAGAttachments } from "@/app/actions/db/actions";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import { createClient } from "@/lib/supabase/client";
import { iconsTypes } from "../chatSetting/KnowledgeBase";
import {
  parseAsJson,
  parseAsStringEnum,
  useQueryState,
} from "nuqs";
import { Doc } from "../messageUi/Attachments";
import { SupportedDocumentTypes } from "@/lib/myTypes";
import { SettingOption } from "../settings/Settings";
import LoadingButton from "@/components/ui/myButtons/LoadingButton";
import ErrorButton from "@/components/ui/myButtons/ErrorButton";
import { Files } from "lucide-react";
import { useTranslations } from "next-intl";

export type DocUrls = {
  id: string;
  url: string;
  expiresAt: string;
};

export default function Documents({userId}:{userId:string}) {
  const t = useTranslations('Chat.toolsContainer.documents')
  const supabase = createClient();
  const [docUrls, setDocUrls] = useLocalStorage<DocUrls[]>("view-doc-urls", []);
  const [, setDoc] = useQueryState("doc", parseAsJson(Doc.parse));
  const [, setOpenSetting] = useQueryState(
    "setting",
    parseAsStringEnum<SettingOption>(Object.values(SettingOption)),
  );
  const [disabled, setDisabled] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: [`getRAGAttachments`],
    queryFn: () => getRAGAttachments(userId),
    refetchOnMount: false,
  });

  const handleSelection = async (
    id: string,
    type: SupportedDocumentTypes,
    filePath: string,
  ) => {
    setDisabled(true);
    const url = getLocalDocUrls(id, docUrls);
    if (url) {
      setDoc({ url, type, isOpen: true });
      setDisabled(false);
      setOpen(false);
      return;
    }
    const { data, error } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKETS_NAME!)
      .createSignedUrl(filePath, 86400);

    if (error) {
      toast.error("Failed to fetch the link. Try again or contact support.", {
        action: {
          label: "Support",
          onClick: () => setOpenSetting(SettingOption.contactUs),
        },
      });
      setDisabled(false);
      setOpen(false);
      return;
    }
    const { signedUrl } = data;
    setDoc({ url: signedUrl, type, isOpen: true });
    setDocUrls((prev) => {
      const now = new Date().getTime();
      const expiresAt = now + 86400 * 1000;
      const validUrls = prev.filter((p) => parseInt(p.expiresAt) > now);
      const newUrl = {
        id: id,
        url: signedUrl,
        expiresAt: expiresAt.toString(),
      };
      return [...validUrls, newUrl];
    });
    setDisabled(false);
    setOpen(false);
  };

  const handleOpenDialogButton = useCallback((e: boolean) => {
    setOpen(e);
  }, [setOpen]);





  return (
    <DialogButton
    trigger={
      <Button
        onClick={() => handleOpenDialogButton(true)}
        size={"icon"}
        variant={"ghost"}
        className="flex h-full w-full items-center justify-start gap-2 rounded-sm p-2"
      >
        <Files />
        <span>{t('trigger')}</span>
      </Button>
    }
    triggerClose={
      <Button variant={"outline"} className="mx-4">
        {t('triggerClose')}
      </Button>
    }
    onOpenTrigger={handleOpenDialogButton}
    openValue={open}
    title={t('title')}
    description={
      <>
        {data && data.length > 0 ? (
          <span>{t('description.hasDocuments')}</span>
        ) : (
          <span>{t('description.noDocuments')}</span>
        )}
      </>
    }
  >
    <div className="flex w-full items-center justify-center px-3 sm:px-0">
      <Command className="relative mb-3 max-w-96 border sm:max-w-full">
        <CommandInput placeholder={t('description.searchPlaceholder')} />
        <CommandList className="min-h-60">
          <CommandEmpty>
            {data && data.length > 0 ? (
              <span>{t('description.noMatchingDocuments')}</span>
            ) : (
              <span>{t('description.noDocumentsYet')}</span>
            )}
          </CommandEmpty>
  
          <CommandGroup className="w-full px-1 py-2 [&_svg]:size-5 [&_svg]:shrink-0">
            {isPending ? (
              <LoadingButton />
            ) : isError ? (
              <ErrorButton onClick={() => refetch()} />
            ) : (
              data &&
              data.map((d) => (
                <CommandItem key={d.id} className="w-full">
                  <Button
                    onClick={() => handleSelection(d.id, d.fileType, d.filePath)}
                    disabled={disabled}
                    variant={"ghost"}
                    title={d.fileName}
                    className="flex w-full cursor-default justify-between py-5"
                  >
                    <p className="flex max-w-60 gap-2 truncate">
                      <span
                        className={cn(
                          "",
                          d.fileType === "pdf" && "[&_svg]:text-red-500",
                          d.fileType === "docx" && "[&_svg]:text-sky-600",
                          d.fileType === "xlsx" && "[&_svg]:text-green-600",
                          d.fileType === "pptx" && "[&_svg]:text-orange-600"
                        )}
                      >
                        {iconsTypes.get(d.fileType)}
                      </span>
                      <span dir="auto" className="truncate">
                        {d.fileName}
                      </span>
                      <span className="sr-only">{d.fileType}</span>
                    </p>
                    <p className="flex flex-col justify-center gap-3">
                      <span>{gatDate(d.createdAt)}</span>
                      <span className="sr-only">{d.createdAt}</span>
                    </p>
                  </Button>
                </CommandItem>
              ))
            )}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  </DialogButton>
  
  );
}
function getLocalDocUrls(id: string, value: DocUrls[]) {
  const docUrl = value.find((v) => v.id === id);

  if (!docUrl) return undefined;

  const now = new Date();
  const { expiresAt, url } = docUrl;
  const isValid = parseInt(expiresAt) > now.getTime();
  if (isValid) return url;
  return undefined;
}
