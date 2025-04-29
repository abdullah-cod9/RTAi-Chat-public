import { Button } from "@/components/ui/button";
import React from "react";
import Image from "next/image";
import { supportedImagesTypes } from "@/lib/myTypes";
import { Minus } from "lucide-react";
import { FileEarmarkText } from "react-bootstrap-icons";
import { v4 as uuidv4 } from "uuid";
import { useTranslations } from "next-intl";

type Props = {
  att: AttDoc[];
  onClearAtt: (
    signedUrl: string,
    filePath: string ,
    isRAG: boolean,
    isReply: undefined | boolean,
  ) => void;
};
export type AttDoc = {
  fileName: string;
  filePath: string 
  fileSize: number 
  fileType:
    | "pdf"
    | "webp"
    | "gif"
    | "jpeg"
    | "png"
    | "docx"
    | "pptx"
    | "xlsx"
    | "txt"
    | "jpg"
  signedUrl: string;
  text: string | null;
  isRAG: boolean;
  isReply?: boolean;
};

export default function ViewUploadedAtt({ att, onClearAtt }: Props) {
  const t = useTranslations('Chat.chatUi.header.ViewUploadedAtt')
  if (att.length > 0) {
    return (
      <div className=" flex h-fit max-h-40 min-h-20 w-full flex-col gap-2 overflow-y-auto rounded-md rounded-b-none border border-b-0 bg-background px-3 py-1 pb-2">
        <p dir="auto" className="text-sm text-muted-foreground">
          {t('title')}
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(10rem,_1fr))] gap-2 p-1 px-2 pb-3">
          {att.map((a) => (
            <div
              key={uuidv4()}
              className="group/ca relative mr-1 min-w-32 max-w-80 rounded-md bg-[#0b111f]"
            >
              <Button
                className="absolute -right-2 -top-1 h-5 w-5 p-1 opacity-0 transition-opacity duration-200 group-hover/ca:opacity-100"
                size={"sm"}
                variant={"destructive"}
                onClick={() =>
                  onClearAtt(a.signedUrl, a.filePath, a.isRAG, a.isReply)
                }
              >
                <Minus />
              </Button>
              {supportedImagesTypes.includes(a.fileType) ? (
                <div className="flex h-full items-start gap-2 p-1">
                  <div className="min-w-10 p-1">
                    <Image
                      alt={a.fileName}
                      src={a.signedUrl}
                      sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 400px"
                      width={100}
                      height={100}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  </div>
                  <p className="flex h-full min-w-10 flex-col items-stretch px-1 py-1 text-xs text-muted-foreground">
                    <span className="truncate">{a.fileName}</span>
                    <span className="mt-auto truncate">
                      {a.fileType.toUpperCase()} {a.fileSize}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="flex h-full w-full items-start gap-2 p-1">
                  <div className="p-1 [&_svg]:size-10 [&_svg]:shrink-0">
                    <FileEarmarkText className="rounded-sm bg-red-700 p-1" />
                  </div>
                  <p className="flex h-full w-full min-w-20 flex-col items-stretch gap-2 overflow-hidden text-ellipsis whitespace-nowrap px-1 text-sm text-muted-foreground">
                    <span dir="auto" className="mb-auto truncate pr-1">
                      {a.fileName}
                    </span>
                    <span dir="auto" className="mt-auto">
                      {a.fileType.toUpperCase()} {a.fileSize}
                    </span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
