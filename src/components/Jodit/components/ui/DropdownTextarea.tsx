import React, { useEffect, useState } from "react";
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
import { cn, isMob } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { CaretDown } from "react-bootstrap-icons";
import { useTranslations } from "next-intl";

type Props = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  value: string | number | readonly string[];
  onClose: (open: boolean) => void;
};
export default function DropdownTextarea({
  onClick,
  onChange,
  value,
  onClose,
}: Props) {
  const t = useTranslations('Chat.jodit.dropdownTextarea')
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  //   const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  useEffect(() => {
    const handleClick = () => {
      setIsDesktop(!isMob());
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (open === false) {
      onClose(open);
    }

  };
  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            size={"icon"}
            variant="ghost"
            className="w-2 items-center justify-center rounded-none p-2"
          >
            <CaretDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="left"
          className={cn(
            "mr-8 flex w-[250px] flex-col items-start gap-2 p-2 sm:w-[350px]",
          )}
          align="start"
        >
          <p className="font-medium leading-none ">{t('write')}</p>
          <Textarea
            dir="auto"
            className="h-32 resize-none"
            onChange={onChange}
            value={value}
          />
          <Button onClick={onClick} className="ml-auto">
          {t('save')}
          </Button>
        </PopoverContent>
      </Popover>
    );
  }
  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button
          size={"icon"}
          variant="ghost"
          className="w-2 items-center justify-center rounded-none p-2"
        >
          <CaretDown />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle className="sr-only"></DrawerTitle>
          <DrawerDescription className="sr-only"></DrawerDescription>
        </DrawerHeader>

        <div className="mt-3 flex flex-col p-2 gap-2">
        <p className="font-medium leading-none sm:text-base">{t('write')}</p>
          <Textarea
            dir="auto"
            className="h-28 resize-none sm:h-40"
            onChange={onChange}
            value={value}
          />
          <Button onClick={onClick} className="ml-auto">
          {t('save')}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
