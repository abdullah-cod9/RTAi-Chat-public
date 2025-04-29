import { Button } from "@/components/ui/button";
import DialogButton from "@/components/ui/myButtons/DialogButton";
import React, { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  deleteAtt,
  getCAG,
  getRAGAttachments,
  KBAttachments,
} from "@/app/actions/db/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cn, gatDate } from "@/lib/utils";
import KBUpload from "../KBUpload";
import { toast } from "sonner";
import TooltipButton from "@/components/ui/myButtons/TooltipButton";
import DeleteAtt from "../toolsContainer/DeleteAtt";
import LoadingButton from "@/components/ui/myButtons/LoadingButton";
import ErrorButton from "@/components/ui/myButtons/ErrorButton";
import {
  Download,
  FiletypeDocx,
  FiletypePdf,
  FiletypePptx,
  FiletypeXlsx,
  ListUl,
  QuestionCircle,
} from "react-bootstrap-icons";
import { LucidePaintbrush } from "lucide-react";
import { FeaturesPlan } from "@/subscription";
import UpgradeNow from "../UpgradeNow";
import { useTranslations } from "next-intl";
export type SelectedKBId = {
  type: "RAG" | "CAG";
  ids: string[];
};
export type CAG = {
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: "pdf" | "docx" | "pptx" | "xlsx";
  text: string;
};

type Props = {
  onCAG: (att: CAG[]) => void;
  onClose: (value: false) => void;
  featuresPlan: FeaturesPlan;
  is_anonymous: boolean;
  userId: string;
};
export const iconsTypes = new Map<
  "pdf" | "docx" | "pptx" | "xlsx",
  React.ReactNode
>([
  ["pdf", <FiletypePdf key="pdf" />],
  ["docx", <FiletypeDocx key="docx" />],
  ["pptx", <FiletypePptx key="pptx" />],
  ["xlsx", <FiletypeXlsx key="xlsx" />],
]);
export default function KnowledgeBase({
  onCAG,
  onClose,
  featuresPlan,
  is_anonymous,
  userId,
}: Props) {
  const [selectedKBId, setSelectedKBId] = useLocalStorage<SelectedKBId>(
    "selected-KB-id",
    { type: "RAG", ids: [] },
  );
  const [isHide, setIsHide] = useLocalStorage<boolean>(
    "hide-KB-Clarify",
    false,
  );
  const t = useTranslations("Chat.chatSetting.KnowledgeBase");
  const [lastSelected, setLastSelected] = useState<string | null>(null);
  const [downLoadCAG, setDownLoadCAG] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: [`getRAGAttachments`],
    queryFn: () => getRAGAttachments(userId),
    enabled: featuresPlan.knowledgeBase,
  });
  const [open, setOpen] = useState(false);

  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      const res = await deleteAtt(userId, selectedKBId.ids);
      if (res && res.error) {
        throw new Error(res.error.message);
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [`getRAGAttachments`] });
      const prevValue: KBAttachments[] | undefined = queryClient.getQueryData([
        `getRAGAttachments`,
      ]);

      if (!prevValue) return [];
      const mutateValue = prevValue.filter(
        (a) => !selectedKBId.ids.includes(a.id),
      );
      queryClient.setQueryData([`getRAGAttachments`], mutateValue);

      return { prevValue };
    },
    onError: (error, variables, context) => {
      toast.error(error.message);

      queryClient.setQueryData([`getRAGAttachments`], context);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [`getRAGAttachments`],
      });
    },
  });

  const handleSelection = (id: string, event: React.MouseEvent) => {
    if (event.shiftKey && lastSelected) {
      const ids = data!.map((item) => item.id);
      const startIndex = ids.indexOf(lastSelected);
      const endIndex = ids.indexOf(id);

      if (startIndex !== -1 && endIndex !== -1) {
        const minIndex = Math.min(startIndex, endIndex);
        const maxIndex = Math.max(startIndex, endIndex);

        //  تحديث التحديد ليشمل النطاق بالكامل
        setSelectedKBId((prev) => ({
          type: prev.type,
          ids: ids.slice(minIndex, maxIndex + 1).map((id) => id),
        }));
      }
    } else {
      //  تحديد عنصر واحد فقط عند النقر العادي
      setSelectedKBId((prev) => {
        const isExists = prev.ids.some((a) => a === id);
        if (isExists) {
          return {
            type: prev.type,
            ids: prev.ids.filter((a) => a !== id),
          };
        }
        return {
          type: prev.type,
          ids: [...prev.ids, id],
        };
      });
    }

    setLastSelected(id); // تحديث آخر عنصر محدد
  };
  const handleUploadComplete = async () => {
    // router.refresh();
    await queryClient.invalidateQueries({
      queryKey: [`getRAGAttachments`],
    });
  };
  const handleClearSelected = async () => {
    setSelectedKBId((prev) => ({
      type: prev.type,
      ids: [],
    }));
    setLastSelected("");
  };
  const handleSelectAll = async () => {
    if (data && data.length > 0) {
      setSelectedKBId((prev) => ({
        type: prev.type,
        ids: data.map((a) => a.id),
      }));
    }
  };
  const handleSelectType = (type: "RAG" | "CAG") => {
    setSelectedKBId((prev) => ({
      type: prev.type === type ? prev.type : type,
      ids: prev.ids,
    }));
  };
  const handleCAG = async () => {
    if (selectedKBId.ids.length > featuresPlan.maxDocumentUploads) {
      handleClearSelected();
      return toast.warning(
        t("toast1", { doc: featuresPlan.maxDocumentUploads }),
      );
    }
    setDownLoadCAG(true);
    const att = await getCAG(userId, selectedKBId.ids);

    onCAG(att);
    setDownLoadCAG(false);
    setOpen(false);
    onClose(false);
  };
  const handleOpenDialogButton = (e: boolean) => {
    setOpen(e);
  };

  return (
    <DialogButton
      trigger={
        <Button
          onClick={() => handleOpenDialogButton(true)}
          variant={"ghost"}
          className="flex h-fit w-full items-center justify-between rounded-sm p-3"
          dir="auto"
        >
          {t("title")}
        </Button>
      }
      title={t("title")}
      description={<>{t("description")}</>}
      onOpenTrigger={handleOpenDialogButton}
      openValue={open}
    >
      <div className="flex flex-col items-center gap-4 p-2" dir="auto">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <ToggleGroup
              type="single"
              value={selectedKBId.type}
              onValueChange={handleSelectType}
              className="rounded-sm border p-1 text-muted-foreground"
            >
              <ToggleGroupItem
                value="RAG"
                aria-checked={selectedKBId.type === "RAG"}
                aria-label="Toggle RAG"
                className="aria-checked:text-foreground"
                // eslint-disable-next-line react/jsx-no-literals
              >
                RAG
              </ToggleGroupItem>
              <ToggleGroupItem
                value="CAG"
                aria-checked={selectedKBId.type === "CAG"}
                aria-label="Toggle CAG"
                className="aria-checked:text-foreground"
                // eslint-disable-next-line react/jsx-no-literals
              >
                CAG
              </ToggleGroupItem>
            </ToggleGroup>
            <TooltipButton
              side="bottom"
              tooltipContent={
                <div className="max-w-40 space-y-3">
                  <p>{t("tip1.m1")}</p>
                  <p>{t("tip1.m2")}</p>
                </div>
              }
            >
              <Button
                size={"sm"}
                variant={"ghost"}
                className="p-0 hover:bg-transparent"
              >
                <QuestionCircle />
              </Button>
            </TooltipButton>
          </div>
          <div className="flex items-center gap-2">
            <TooltipButton side="top" tooltipContent={t("tip2.tip1")}>
              <Button
                onClick={handleCAG}
                size={"icon"}
                variant={"secondary"}
                className={cn(
                  "h-8 w-8 sm:h-9 sm:w-9",
                  downLoadCAG &&
                    "animate-bounce cursor-default !opacity-100 [&_svg]:text-green-600",
                )}
                disabled={
                  selectedKBId.type === "RAG" ||
                  !selectedKBId.ids.length ||
                  downLoadCAG
                }
              >
                <Download />
              </Button>
            </TooltipButton>
            <TooltipButton side="top" tooltipContent={t("tip2.tip2")}>
              <Button
                onClick={handleSelectAll}
                size={"icon"}
                variant={"secondary"}
                className="h-8 w-8 sm:h-9 sm:w-9"
                disabled={!selectedKBId.ids.length}
              >
                <ListUl />
              </Button>
            </TooltipButton>
            <TooltipButton tooltipContent={t("tip2.tip3")} side="top">
              <Button
                onClick={handleClearSelected}
                size={"icon"}
                variant={"secondary"}
                className="h-8 w-8 sm:h-9 sm:w-9"
                disabled={!selectedKBId.ids.length}
              >
                <LucidePaintbrush />
              </Button>
            </TooltipButton>
            <DeleteAtt
              disabled={data ? !selectedKBId.ids.length : true}
              onAction={async () => {
                await mutateAsync();
                handleClearSelected();
              }}
            />
          </div>
        </div>
        {featuresPlan.knowledgeBase ? (
          <Command
            data-message-hide={isHide}
            className="relative mb-3 max-w-96 border data-[message-hide=false]:border-0 sm:max-w-full"
          >
            <CommandInput
              className="w-full"
              placeholder={t("commandInput.placeholder")}
            />
            <CommandList>
              <CommandEmpty>
                {data && data.length > 0 ? (
                  <span>{t("CommandEmpty.m1")}</span>
                ) : (
                  <span>{t("CommandEmpty.m2")}</span>
                )}
              </CommandEmpty>
              <CommandGroup className="min-h-56 w-full p-2 [&_svg]:size-5 [&_svg]:shrink-0">
                {isPending ? (
                  <LoadingButton />
                ) : isError ? (
                  <ErrorButton onClick={() => refetch()} />
                ) : (
                  <>
                    {data.map((d) => (
                      <CommandItem key={d.id} className="">
                        <div
                          onClick={(e) => handleSelection(d.id, e)}
                          className={cn(
                            "group/icon flex w-full justify-between rounded-sm p-2 text-muted-foreground hover:bg-transparent sm:hover:bg-muted",
                            selectedKBId.ids &&
                              selectedKBId.ids.includes(d.id) &&
                              "ring-1 ring-primary",
                          )}
                          title={d.fileName}
                        >
                          <p className="flex max-w-60 gap-3 truncate">
                            <span
                              className={cn(
                                "",
                                d.fileType === "pdf" && "[&_svg]:text-red-500",
                                d.fileType === "docx" && "[&_svg]:text-sky-600",
                                d.fileType === "xlsx" &&
                                  "[&_svg]:text-green-600",
                                d.fileType === "pptx" &&
                                  "[&_svg]:text-orange-500",
                              )}
                            >
                              {iconsTypes.get(d.fileType)}
                            </span>
                            <span dir="auto" className="truncate">
                              {d.fileName}
                            </span>
                            <span className="sr-only">{d.fileType}</span>
                          </p>
                          <p className="ml-auto flex flex-col justify-center gap-3">
                            <span> {gatDate(d.createdAt)}</span>
                            <span className="sr-only">{d.createdAt}</span>
                          </p>
                        </div>
                      </CommandItem>
                    ))}
                    <div className="absolute bottom-3 right-3 z-10">
                      <KBUpload
                        featuresPlan={featuresPlan}
                        onUploadComplete={handleUploadComplete}
                        currentFiles={data.length}
                      />
                    </div>
                  </>
                )}
              </CommandGroup>
            </CommandList>

            {!isHide && (
              <div className="absolute left-1/2 top-1/2 z-30 flex h-full w-full -translate-x-1/2 -translate-y-1/2 transform flex-col gap-2 rounded-md bg-muted/50 p-2 text-sm text-muted-foreground shadow-md backdrop-blur-sm sm:gap-4">
                <p className="w-full text-center">{t("RAG or CAG.title")}</p>
                <p>{t("RAG or CAG.description.m1")}</p>
                <p>{t("RAG or CAG.description.m2")}</p>
                <p>{t("RAG or CAG.description.m3")}</p>
                <Button
                  variant={"outline"}
                  className="absolute bottom-2 right-2 ml-auto"
                  onClick={() => setIsHide(true)}
                >
                  {t("RAG or CAG.button")}
                </Button>
              </div>
            )}
          </Command>
        ) : (
          <div className="">
            <UpgradeNow is_anonymous={is_anonymous} />
          </div>
        )}
      </div>
    </DialogButton>
  );
}
