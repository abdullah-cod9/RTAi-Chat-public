import React from "react";
import Image from "next/image";
import DialogButton from "@/components/ui/myButtons/DialogButton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export type ImageViewer = {
  image: {
    fileName: string;
    url: string;
    fileType: "webp" | "gif" | "jpeg" | "png" | "jpg";
    expiresAt: string;
  }[];
  openValue: boolean;
  onOpenTrigger: (open: boolean) => void;
};

export default function ImageViewer({
  image,
  openValue,
  onOpenTrigger,
}: ImageViewer) {

  return (
    <DialogButton openValue={openValue} onOpenTrigger={onOpenTrigger}>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex w-max space-x-4 p-4">
          {image.map((i) => (
            <figure key={i.url} className="shrink-0">
              <div className="relative aspect-square h-full w-60 overflow-hidden rounded-md sm:w-80 lg:w-96">
                <Image
                  src={i.url}
                  alt={i.fileName}
                  className="h-full w-full object-fill"
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 400px"
                />
              </div>
            </figure>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </DialogButton>
  );
}
